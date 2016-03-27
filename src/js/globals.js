var CURRENT_ROULETTE = {};

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