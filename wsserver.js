module.exports = function (options, callback) {
  
  let port = options.port || 8080

  var WebSocketServer = require('ws').Server,
      wss = new WebSocketServer({ port });

  wss.on('connection', (client, req) => {

    callback('connect', req.headers, client)

    client.on('message', msg => {
      callback('msg', msg)
    })
  
    client.on('close', () => {
      callback('close')
    })
  
  })

}