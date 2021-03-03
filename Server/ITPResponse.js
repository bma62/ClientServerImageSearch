
const helpers = require('./helpers');
let packet;

module.exports = {

    init: function(version, isFulfilled, sequenceNumber, timestamp, imageTypeArray, imageNameArray, imageArray) {
        //
        // enter your code here
        //

        let v, f, responseType, ic, it, fileNameSize;

        // The packet length in bytes
        let packetLength = 8, bufferOffset = 0; // Fixed header

        // Payload section length
        imageNameArray.forEach( (name, index) => {
            packetLength += (4 + name.length + Buffer.byteLength(imageArray[index]));
        });

        packet = Buffer.alloc(packetLength);

        v = helpers.padStringToLength(helpers.int2bin(version), 3);

        // Check isFulfilled
        if (isFulfilled) {
            f = '1';
        }
        else {
            f = '0';
        }

        // Check if any image is found
        if (imageNameArray.length > 0) {
            // Found
            responseType = helpers.padStringToLength(helpers.int2bin(1), 8);
        }
        else {
            // Not found
            responseType = helpers.padStringToLength(helpers.int2bin(2), 8);
        }

        // There is restriction on the client side for not requesting more than 31 images, so no need to check here
        ic = helpers.padStringToLength(helpers.int2bin(imageNameArray.length), 5);

        // Sequence number
        sequenceNumber = sequenceNumber % Math.pow(2, 15);
        sequenceNumber = helpers.padStringToLength(helpers.int2bin(sequenceNumber), 15);

        // Write first 4 bytes into the packet
        Buffer.from(helpers.bin2hex(v+f+responseType+ic+sequenceNumber), 'hex')
            .copy(packet, bufferOffset);
        bufferOffset = bufferOffset + 4;

        packet.writeUInt32BE(timestamp, bufferOffset);
        bufferOffset = bufferOffset + 4;

        // Repeat the payload section for each image
        imageNameArray.forEach( (name,index) => {

            // Image Type
            it = helpers.getImageType(imageTypeArray[index]);
            it = helpers.padStringToLength(helpers.int2bin(it), 4);

            fileNameSize = helpers.padStringToLength(helpers.int2bin(name.length), 12);

            Buffer.from(helpers.bin2hex(it+fileNameSize), 'hex')
                .copy(packet, bufferOffset);
            bufferOffset = bufferOffset + 2;

            // Image size in bytes
            packet.writeUInt16BE(Buffer.byteLength(imageArray[index]), bufferOffset);
            bufferOffset = bufferOffset + 2;

            // Image file name
            Buffer.from(name)
                .copy(packet, bufferOffset);
            bufferOffset = bufferOffset + name.length;

            // Image data
            imageArray[index].copy(packet, bufferOffset);
            bufferOffset = bufferOffset + Buffer.byteLength(imageArray[index]);
        })
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function() {
        // enter your code here
        return packet;
    }
};

// Extra utility methods can be added here