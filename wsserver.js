module.exports = function (options, callback) {
  
  let port = options.port || 8080

  const fs = require('fs');
  const https = require('https');
  const WebSocket = require('ws')
  const path = require('path')

  // Define path to certificates
  const home = require('os').homedir()
  const dir = path.join(home, 'certificates')

/*

  When using https, you might need a (self-signed) certifcate.
  Enter commands from the conosle similar to this:

  openssl genrsa -out key.pem
  openssl req -new -key key.pem -out csr.pe
  openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
  rm csr.pem

*/

  const server = https.createServer({
    cert: fs.readFileSync(path.join(dir, 'cert.pem')),
    key: fs.readFileSync(path.join(dir, 'key.pem'))
  });

  const wss = new WebSocket.Server({ server, port });

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