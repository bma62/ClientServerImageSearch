
module.exports = {

    hex2bin: function(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
},

    bin2hex: function(bin) {
    return parseInt(bin, 2).toString(16);
},

    bin2int: function (bin) {
        return parseInt(bin,2);
    },

    int2bin: function(int) {
    return int.toString(2);
},

    padStringToLength: function(str, targetLength, errorMsg) {
    if (str.length < targetLength) {
        return str.padStart(targetLength, '0');
    }
    else if (str.length === targetLength) {
        return str;
    }
    else {
        throw new Error(errorMsg);
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