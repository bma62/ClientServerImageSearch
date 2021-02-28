let net = require("net");
let fs = require("fs");
let open = require("open");

let ITPpacket = require("./ITPRequest"); // uncomment this line after you run npm install command

// Enter your code for the client functionality here
const yargs = require('yargs');

// set up command line options
const argv = yargs
    .usage('Usage: $0 -s [serverIP:port] -q [images list separated by space] -v [version]')
    .options({
        's': {
            demandOption: true,
            default: '127.0.0.1:3000',
            type: 'string',
            describe: 'The server IP and port the client needs to connect to.',
        },
        'q': {
            demandOption: true,
            default: 'Swan.jpeg',
            type: 'array',
            describe: 'A list of image names separated by space.',
        },
        'v': {
            demandOption: true,
            default: 7,
            type: 'number',
            describe: 'The protocol version.',
        }
    })
    .argv;

const host = argv.s.split(':')[0],
    port = Number(argv.s.split(':')[1]),
    version = argv.v,
    imageArray = argv.q,
    requestType = 0;
// add error checks here

ITPpacket.init(version, imageArray, requestType);
ITPpacket.getBytePacket();

const client = new net.Socket();

// Connect to the host and port received from command line
// client.connect(port, host, () => {
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