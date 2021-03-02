
module.exports = {
    int2bin: function (int) {
    return int.toString(2);
},

    bin2int: function (bin) {
    return parseInt(bin,2);
},

// Pad binary strings to fixed length to avoid conversion issues between int and binary
    padStringToLength: function (str, targetLength) {
    if (str.length < targetLength) {
        return str.padStart(targetLength, '0');
    }
    else if (str.length === targetLength) {
        return str;
    }
},

    getImageExtension: function (type) {
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
};