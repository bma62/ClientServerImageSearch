let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');

// You may need to add some delectation here
const net = require('net')

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
    let bufferOffset = 0;

    let header = int2bin(packet.readUInt8(bufferOffset));
    let version = bin2int(header.substring(0, 3));
    console.log(`\t--ITP version: ${version}`);
    let imageCount = bin2int(header.substring(3));
    console.log(`\t--Image count: ${imageCount}`);
    bufferOffset = bufferOffset + 3;

    header = int2bin(packet.readUInt8(bufferOffset));
    let requestType = bin2int(header);
    if (requestType === 0) {
        console.log(`\t--Request type: Query`);
    }
    ++bufferOffset;

    let imageType = 0, imageTypeArray = [], imageName = '', imageNameArray = [], imageNameSize = 0;
    for (let i = 0; i < imageCount; i++) {
        header = int2bin(packet.readUInt16BE(bufferOffset));
        imageType = bin2int(header.substring(0, 4));
        imageTypeArray.push(getImageExtension(imageType));
        imageNameSize = bin2int(header.substring(4));

        bufferOffset = bufferOffset + 2;

        imageNameArray.push(packet.slice(bufferOffset, bufferOffset + imageNameSize).toString());

        bufferOffset = bufferOffset + imageNameSize;
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
            console.log(type);
            throw new Error('Image type not supported!');
    }
}