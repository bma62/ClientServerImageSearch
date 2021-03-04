let net = require("net");
let fs = require("fs");
let open = require("open");

let ITPpacket = require("./ITPRequest"); // uncomment this line after you run npm install command

// Enter your code for the client functionality here
const yargs = require('yargs');
const helpers = require('./helpers');

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

const client = new net.Socket();
net.bufferSize = 300000;
net.bytesRead = 300000;
let responsePacket = Buffer.alloc(0);

// Connect to the host and port received from command line
client.connect(port, host, () => {
    console.log('Connected to the server.');

    // Add a one-byte delimiter for server to concatenate buffer chunks
    let packet = ITPpacket.getBytePacket();
    let delimiter = Buffer.from('\n');
    packet = Buffer.concat([packet, delimiter])

    client.write(packet);
});

client.on('data', (data) => {

    // Handle the case when the packet is divided into multiple chunks when received
    responsePacket = Buffer.concat([responsePacket, data]);

    // Check for the delimiter for complete packet
    if (responsePacket.slice(-1).toString() === '\n'){
        console.log('full packet received');
        // Remove the delimiter
        responsePacket = responsePacket.slice(0, -1);

        printHeader(responsePacket);
        decodePacket(responsePacket);
    }
});

client.on('end', () => {
    console.log('\nDisconnected from the server.')
})

client.on('close', () => {
    console.log('Connection closed.');
});

function printHeader(packet) {
    console.log('ITP packet header received:');

    let displayColumn = 4, packetBits = '';

    for (let i = 0; i < 8; i++){
        // Convert each byte to binary string and pad to 8 bits
        packetBits += helpers.padStringToLength(packet[i].toString(2), 8);
        packetBits += ' ';
        --displayColumn;
        if (displayColumn === 0) {
            packetBits += '\n';
            displayColumn = 4;
        }
    }

    console.log(packetBits);
}

function decodePacket(packet) {
    console.log(`Server sent:`);

    // First 4 bytes is the header
    let bufferOffset = 0;
    let header = helpers.padStringToLength(helpers.int2bin(packet.readUInt32BE(bufferOffset)), 32);
    bufferOffset = bufferOffset + 4;

    let version = helpers.bin2int(header.substring(0, 3));
    console.log(`\t--ITP version: ${version}`);

    let isFulfilled = header.substring(3, 4);
    if (isFulfilled === '0') {
        isFulfilled = 'No';
    }
    else {
        isFulfilled = 'Yes';
    }
    console.log(`\t--Fulfilled: ${isFulfilled}`);

    let responseType = helpers.bin2int(header.substring(4, 12));
    switch (responseType) {
        case 0:
            responseType = 'Query';
            break;
        case 1:
            responseType = 'Found';
            break;
        case 2:
            responseType = 'Not Found';
            break;
        case 3:
            responseType = 'Busy';
            break;
        default:
            responseType = 'Not Recognized';
    }
    console.log(`\t--Response Type: ${responseType}`);

    let imageCount = helpers.bin2int(header.substring(12, 17));
    console.log(`\t--Image Count: ${imageCount}`);

    let sequenceNumber = helpers.bin2int(header.substring(17));
    console.log(`\t--Sequence Number: ${sequenceNumber}`);

    // Second 4 bytes of the header is timestamp
    let timestamp = packet.readUInt32BE(bufferOffset);
    bufferOffset = bufferOffset + 4;
    console.log(`\t--Timestamp: ${timestamp}`);

    // Payload section
    let imageType = '', fileNameSize = 0, imageSize = 0, fileName = '', promises = [];
    for (let i = 0; i < imageCount; i++) {
        header = helpers.padStringToLength(helpers.int2bin(packet.readUInt16BE(bufferOffset)), 16);
        bufferOffset = bufferOffset + 2;

        imageType = helpers.bin2int(header.substring(0, 4));
        imageType = helpers.getImageExtension(imageType);

        fileNameSize = helpers.bin2int(header.substring(4));
        imageSize = packet.readUInt16BE(bufferOffset);
        bufferOffset = bufferOffset + 2;

        fileName = packet.slice(bufferOffset, bufferOffset + fileNameSize).toString();
        bufferOffset = bufferOffset + fileNameSize;

        let imageData = Buffer.from(packet.slice(bufferOffset, bufferOffset + imageSize));
        bufferOffset = bufferOffset + imageSize;

        promises.push(writeToFile(fileName, imageType, imageData));
    }

    // Wait until all writes are done, then open them
    Promise.all(promises)
        .then((fileNames) => {
            promises = [];
            fileNames.forEach( fileName => {
                promises.push(open(fileName));
            })

            Promise.all(promises)
                .then( ()=>{
                    // All files are open, close the connection
                    client.end();
                })
                .catch(err => {
                    console.log(err);
                })
        })

        .catch(err => {
            console.log(err);
        })
}

function writeToFile(fileName, fileExtension, data) {
    return new Promise((resolve, reject) => {
        let file = `${fileName}.${fileExtension}`;

        fs.writeFile(file, data, (err) => {
            if (err) {
                // Write error
                reject(err);
            }
            else {
                // Write completed and return the file name
                resolve(file);
            }
        });
    });
}