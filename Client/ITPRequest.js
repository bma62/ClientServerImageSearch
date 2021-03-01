// You may need to add some delectation here

let packet;

module.exports = {
  init: function (version, imageArray, requestType) {
    // feel free to add function parameters as needed
    //
    // enter your code here
    //
    let imageNameArray = [], imageTypeArray = [], fileNameSize = 0;

    imageArray.forEach( item => {
      imageNameArray.push(item.split('.')[0]);
      // Each char of the file name will be reflected as a byte
      fileNameSize += item.split('.')[0].length;
      imageTypeArray.push(item.split('.')[1]);
    });

    // DEBUG
    // console.log(imageNameArray);
    // console.log(fileNameSize);
    // console.log(imageTypeArray);
    // console.log(version);

    // The packet length in bytes
    let packetLength = 4 + fileNameSize + 2 * imageNameArray.length;
    packet = Buffer.alloc(packetLength);

    // convert version from integer to binary
    let v = int2bin(version);
    v = padStringToLength(v, 3, 'Version not support!');

    let ic = imageNameArray.length.toString(2);
    ic = padStringToLength(ic, 5, 'Image count exceeds 31!')

    packet.write(bin2hex(v+ic), 0, 1, 'hex'); // first byte is V and IC
    packet.write('0000', 1, 2, 'hex'); // reserved 2 bytes

    // Last byte in header is the request type
    if (requestType === 0) {
      packet.write('00', 3, 1, 'hex');
    }
    else {
      throw new Error('Request type not supported!');
    }

    let bufferIndexOffset = 4;
    imageNameArray.forEach((element, i) => {
      let it = int2bin(getImageType(imageTypeArray[i]));
      it = it.padStart(4, '0');
      let fileNameSize = int2bin(element.length);
      fileNameSize = padStringToLength(fileNameSize, 12, 'File name too long!');

      // Convert the 2 byte payload header to buffer and copy into packet
      let payloadHeader = Buffer.from(bin2hex(it + fileNameSize), 'hex');
      payloadHeader.copy(packet, bufferIndexOffset);

      bufferIndexOffset = bufferIndexOffset + 2;

      // Load file name into packet and move on to next image
      let payload = Buffer.from(element);
      payload.copy(packet, bufferIndexOffset);

      bufferIndexOffset = bufferIndexOffset + element.length;
    })
  },

  //--------------------------
  //getBytePacket: returns the entire packet in bytes
  //--------------------------
  getBytePacket: function () {
    // enter your code here
    return packet;
    // console.log(Buffer.byteLength(packet));
  },

  //--------------------------
  //getBitPacket: returns the entire packet in bits format
  //--------------------------
  getBitPacket: function () {
    // enter your code here
    // return "this should be a correct packet";
    let packetBits = '';
    packet.forEach( byte => {
      packetBits += padStringToLength(byte.toString(2), 8, 'Error converting packet to bits');
      // packetBits += ' ';
    });

    return packetBits;
  },
};

// Extra utility methods can be added here
function hex2bin(hex) {
  return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

function bin2hex(bin) {
  return parseInt(bin, 2).toString(16);
}

function int2bin(int) {
  return int.toString(2);
}

function padStringToLength(str, targetLength, errorMsg) {
  if (str.length < targetLength) {
    return str.padStart(targetLength, '0');
  }
  else if (str.length === targetLength) {
    return str;
  }
  else {
    throw new Error(errorMsg);
  }
}

function getImageType(extension) {
  let type = extension.toLowerCase();
  switch (type) {
    case 'bmp':
      return 1;
    case 'jpeg':
      return 2;
    case 'gif':
      return 3;
    case 'png':
      return 4;
    case 'tiff':
      return 5;
    case 'raw':
      return 15;
    default:
      throw new Error('Image type not supported!');
  }
}