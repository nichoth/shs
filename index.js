const crypto = require('crypto')
var SHS = require('secret-handshake')

var S = require('pull-stream')
var cl = require('chloride')

var appKey = crypto.randomBytes(32)
// var appKey = ... //32 random bytes
var alice = cl.crypto_sign_keypair() //client
var bob = cl.crypto_sign_keypair()   //server

function authorize(id, cb) {
  cb(null, check(id)) //check wether id is authorized.
}

function check (id) {
    // The value that authorize calls back cb(null, <V>) will
    // be assigned to plainstream.auth = <V>.

    // Also, the id of the remote will be assigned to plainstream.id.
    // This way the application layer can know who it's peer is
    return true

    // If authorize calls back truthy, then we reuturn a plainstream
    // if not, error
}

//initialize, with default timeouts.
var ServerStream = SHS.createServer(alice, authorize, appKey)
var ClientStream = SHS.createClient(bob, appKey)

var alice_stream = ServerStream(function (err, stream) {
    // ...
    console.log('=> alice')
    S(
        stream,
        S.map(buf => buf.toString()),
        S.drain(msg => console.log('in alice, the server -- ', msg))
    )

    S(
        S.values(['baz', 'clam']),
        stream
    )
})

// bob, the client, must know alice's public key
var bob_stream = ClientStream(alice.publicKey, function (err, stream) {
    // ...
    console.log('=> bob')
    S(
        S.values(['foo', 'bar']),
        stream
    )

    S(
        stream,
        S.map(buf => buf.toString()),
        S.drain(msg => console.log('in bob the client -- ', msg))
    )
})

//simulate a streaming network connection by connecting streams together
S(alice_stream, bob_stream, alice_stream)

