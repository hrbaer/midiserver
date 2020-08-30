/*
 *  Simple MIDI WebSocket Server
 *
 *  Author
 *  hansruedi.baer@bluewin.ch
 *
 *  Versions
 *	1.0: 2020-08-29
 */

const wss = require('./wsserver.js')
const easymidi = require('easymidi')
const NanoTimer = require('nanotimer')
const args = require('minimist')(process.argv.slice(2))

const inName = 'WSS In'
const outName = 'WSS Out'

let outputs = easymidi.getOutputs()
let inputs = easymidi.getInputs()

let startTime = 0
let port = args.p || 8888

let wssClient

if (args.l) {
  console.log('Available  MIDI output devices')
  outputs.forEach(output => {
    console.log('• ' + output)
  })
  console.log('Available  MIDI input devices')
  inputs.forEach(input => {
    console.log('• ' + input)
  })
  return
}
else if (args.h) {
  let usage = `Usage: node index.js [options]
-i <midi input>: Use the specified input device
-o <midi output>: Use the specified output device
-h This help
-p <n>: Port number (default: 8888)
-l List available midi devices or drivers
-v Verbose MIDI events
`
  console.log(usage)
  return
}

let outdev = args.o || outName
let virtualOut = !outputs.includes(outdev)
let output = new easymidi.Output(outdev, virtualOut)

let indev = args.i || inName
let virtualIn = !inputs.includes(indev)
let input = new easymidi.Input(indev, virtualIn)

if (!output) {
  return
}

if (input) {
  input.on('message', message => {
    console.log(message)
    if (wssClient) {
      wssClient.send(JSON.stringify(message))
    }
  })
}


console.log(
`
M I D I   W E B S O C K E T   S E R V E R
–––––––––––––––––––––––––––––––––––––––––
`)

function sendEvent(params) {
  output.send(params._type, params)
}

function getTime() {
  var time = process.hrtime()
  return Math.round(1e6 * time[0] + time[1] * 1e-3)
}

console.log(`Now listening on port ${port}...`)


wss({ port }, (cmd, msg, client) => {

  switch(cmd) {

    case 'connect':
    console.log('Connection requested.')
    wssClient = client
    break

    case 'msg':
    if (args.v) {
      console.log(msg)
    }
    let params = JSON.parse(msg)
  
    if (params._type == 'log') {
      console.log('Log:', params.log)
      return
    }
    else if (params._type == 'reset') {
      startTime = getTime()
      return
    }
  
    let timer = new NanoTimer()
    let delay = Math.round(1000 * params.time - getTime() + startTime)
    let micros = `${delay}u`
    timer.setTimeout(sendEvent, [params], micros)
    if (delay < 0) {
      let ms = Math.round(-delay / 1000)
      console.log(`MIDI event timed out: ${ms} ms.`)
    }
    break

    case 'close':
    console.log('Closing connection.\n')
    break
  }

})