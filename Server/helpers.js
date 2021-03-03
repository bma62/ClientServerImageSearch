
module.exports = {
    int2bin: function (int) {
    return int.toString(2);
},

    bin2int: function (bin) {
    return parseInt(bin,2);
},

    bin2hex: function(bin) {
        return parseInt(bin, 2).toString(16);
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
},

    getImageType: function(extension) {
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
};