var AUDIO           = document.querySelector('audio');
var START_STOP_BTN  = document.querySelector('#draft');

var ROULETTE_IS_SPINNING = false;
var MUSIC_IS_PLAYING     = true;

var CURRENT_ROULETTE = {};

var SESSION_DATA = {
  "roulettes":[]
};

var ROULETTE_OPTION = {
  speed : 8,
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
    onRouletteStop();
  }
};

var ROULETTES_JSON_SCHEMA = {
  "type": "object",
  "properties": {
    "roulettes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "options": {
            "type": "array",
            "items": [
              {
                "type": "string"
              }
            ]
          }
        },
        "required": [
          "name",
          "options"
        ]
      }
    }
  },
  "required": [
    "roulettes"
  ]
}