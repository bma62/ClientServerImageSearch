
// Some code need to be added here, that are common for the module

let timer;

function incrementTimer() {
    // reset timer after reaching 2^32
    if (timer === Math.pow(2, 32)) {
        timer = 0;
    }
    timer++;
}

module.exports = {
    init: function() {
       // init function needs to be implemented here //
        // initialize timer with a random number between 1 and 999
        timer = Math.floor((Math.random() * 999) + 1);
        // increment every 10ms
        setInterval(incrementTimer, 10)
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
      // Enter your code here //
        return "this should be a correct sequence number";
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function() {
        return timer;
    }


};