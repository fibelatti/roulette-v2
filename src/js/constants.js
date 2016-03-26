var SESSION_DATA = {
  "roulettes":[]
};

var ROULETTE_OPTION = {
  speed : 6,
  duration : 30,
  stopImageNumber : -1,
  startCallback : function() {
    console.log('start');
  },
  slowDownCallback : function() {
    console.log('slowDown');
  },
  stopCallback : function($stopElm) {
    console.log('stop');
  }
};