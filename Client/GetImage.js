let net = require("net");
let fs = require("fs");
let open = require("open");

let ITPpacket = require("./ITPRequest"); // uncomment this line after you run npm install command

// Enter your code for the client functionality here
const yargs = require('yargs');
console.log(yargs.array('-s')) // this captures command line option -s and what follows it

// const client = new net.Socket();
//
// client.connect(3000, '127.0.0.1', () => {
//     console.log('Connected to the server.');
//     // TODO: update this to get inputs from CLI
//     client.write('Hi server!')
// })
//
// client.on('data', (data) => {
//     // TODO: decode the packet and open the images
//     console.log('Received: ' + data);
//     client.destroy(); // kill client after server's response
// });
//
// client.on('close', () => {
//     console.log('Connection closed');
// });