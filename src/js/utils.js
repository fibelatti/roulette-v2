(function(){
  document.querySelector('a#draft').addEventListener('click', function(event){
    event.preventDefault();
    
    ROULETTE_IS_SPINNING ? triggerStopRoulette() : triggerStartRoulette();
  }) 
}())

function triggerStartRoulette () {
  $('div.roulette').roulette('start');
  onRouletteStart();
}

function onRouletteStart () {
  $('audio').animate({volume: 1});
  AUDIO.currentTime = 0;
  AUDIO.play();
  START_STOP_BTN.innerHTML = 'Parar!';
  ROULETTE_IS_SPINNING = true;
}

function triggerStopRoulette () {
  $('div.roulette').roulette('stop');
  $('audio').animate({volume: 0}, 5000);
  START_STOP_BTN.innerHTML = 'Aguarde...';
}

function onRouletteStop () {
  AUDIO.pause();
  START_STOP_BTN.innerHTML = 'Roda a Roda!';
  ROULETTE_IS_SPINNING = false;
}

function toggleMusic () {
  if (MUSIC_IS_PLAYING) {
    MUSIC_IS_PLAYING = false;
    $('audio').animate({volume: 0});
    $('#btn-toggle-music').html('<span class="glyphicon glyphicon-volume-off" aria-hidden="true"></span>'); 
  } else {
    MUSIC_IS_PLAYING = true;
    $('audio').animate({volume: 1});
    $('#btn-toggle-music').html('<span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span>');
  }
}

function asyncLoop (iterations, func, callback) {
  var index = 0;
  var done = false;
  var loop = {
    next: function() {
      if (done) {
        return;
      }
      if (index < iterations) {
        index++;
        func(loop);
      } else {
        done = true;
        callback();
      }
    },
    iteration: function() {
      return index - 1;
    },
    break: function() {
      done = true;
      callback();
    }
  };
  loop.next();
  return loop;
}