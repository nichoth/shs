ar SHS = require('secret-handshake')

var S = require('pull-stream')
var cl = require('chloride')
var appKey = ... //32 random bytes
var alice = cl.crypto_sign_keypair() //client
var bob = cl.crypto_sign_keypair()   //server

function authorize(id, cb) {
  cb(null, check(id)) //check wether id is authorized.
}

//initialize, with default timeouts.
var ServerStream = SHS.createServer(alice, authorize, appKey)
var ClientStream = SHS.createClient(bob, appkey)

var alice_stream = ServerStream(function (err, stream) {
  ...
})

var bob_stream = ClientStream(alice.publicKey, function (err, stream) {
  ...
})

//simulate a streaming network connection by connecting streams together
S(alice_stream, bob_stream, alice_stream)

