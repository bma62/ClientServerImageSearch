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

    // The packet length in bytes
    let packetLength = 4 + fileNameSize + 2 * imageNameArray.length;
    packet = Buffer.alloc(packetLength,null, 'binary');

    // convert version from integer to binary
    let v = version.toString(2);
    if (v.length < 3) {
      v.padStart(3, '0');
    }
    else if(v.length > 3){
      throw new Error('Version Error!');
    }

    let ic = imageNameArray.length.toString(2);
    if (ic.length < 5) {
      ic.padStart(5, '0');
    }
    else if(ic.length > 5){
      throw new Error('Image Count Exceeds 31!');
    }

    packetLength[0] = Buffer.from(bin2hex(v+ic), "hex");

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
      packetBits += hex2bin(byte.toString('hex'));
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