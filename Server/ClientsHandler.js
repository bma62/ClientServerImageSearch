let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here
const net = require('net');
let version, imageCount , requestType, imageTypeArray = [], imageNameArray = [];

module.exports = {

    handleClientJoining: function (sock) {
        //
        // Enter your code here
        //
        // you may need to develop some helper functions
        // that are defined outside this export block
        let timeStamp = singleton.getTimestamp();
        console.log(`\nClient-${timeStamp} is connected at timestamp: ${timeStamp}\n`);

        // Receive data from the socket
        sock.on('data', (packet) => {
            // TODO: update to decode the packet
            console.log(`ITP packet received: \n${packet}`);
            decodePacket(packet, timeStamp);
            sock.write('Hi client, the server got your msg.');
        });

        sock.on('end', () => {
            console.log(`\nClient-${timeStamp} closed the connection.\n`);
        });

        sock.on('error', (err) => {
            console.log(`Error: ${err}`);
        });
    }
};

function decodePacket(packet, timeStamp) {
    console.log(`\nClient-${timeStamp} requests:`);

    // First byte of packet
    let bufferOffset = 0;
    let header = padStringToLength(int2bin(packet.readUInt8(bufferOffset)), 8);

    // Bit 1-3 is version
    version = bin2int(header.substring(0, 3));
    console.log(`\t--ITP version: ${version}`);

    // Bit 4-8 is image count
    imageCount = bin2int(header.substring(3));
    console.log(`\t--Image count: ${imageCount}`);

    bufferOffset = bufferOffset + 3; // Skip byte 2-3 as they are reserved and not used

    // 4th byte is request type
    header = padStringToLength(int2bin(packet.readUInt8(bufferOffset)), 8);
    requestType = bin2int(header);
    if (requestType === 0) {
        console.log(`\t--Request type: Query`);
    }

    // Repeat for the payload part to read image names and types
    ++bufferOffset;
    let imageType, imageName = '', imageNameSize = 0;
    for (let i = 0; i < imageCount; i++) {

        // First 2 bytes of payload is image type and image name size
        header = padStringToLength(int2bin(packet.readUInt16BE(bufferOffset)), 16);
        imageType = bin2int(header.substring(0, 4)); // Bit 1-4 is image type
        imageTypeArray.push(getImageExtension(imageType)); // Convert to extension name and add to array
        imageNameSize = bin2int(header.substring(4)); // Bit 5-16 is image name size

        bufferOffset = bufferOffset + 2; // Shift buffer offset to read image name

        // As this range of buffer is characters, they can be pushed together as the full name string
        imageNameArray.push(packet.slice(bufferOffset, bufferOffset + imageNameSize).toString());

        bufferOffset = bufferOffset + imageNameSize; // Move on to next image
    }

    console.log(`\t--Image file extension(s): ${imageTypeArray.toString()}`);
    console.log(`\t--Image file name(s): ${imageNameArray.toString()}`);
}

function int2bin(int) {
    return int.toString(2);
}

function bin2int(bin) {
    return parseInt(bin,2);
}

// pad binary strings to fixed length to avoid conversion issues between int and binary
function padStringToLength(str, targetLength) {
    if (str.length < targetLength) {
        return str.padStart(targetLength, '0');
    }
    else if (str.length === targetLength) {
        return str;
    }
}

function getImageExtension(type) {
    switch (type) {
        case 1:
            return 'bmp';
        case 2:
            return 'jpeg';
        case 3:
            return 'gif';
        case 4:
            return 'png';
        case 5:
            return 'tiff';
        case 15:
            return 'raw';
        default:
            throw new Error(`Image type ${type} not supported!`);
    }
}