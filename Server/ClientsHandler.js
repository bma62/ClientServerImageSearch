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
            console.log(`Packet from client: ${packet}`);
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


