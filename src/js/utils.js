(function(){
  document.querySelector('a#draft').addEventListener('click', function(event){
    event.preventDefault()

    var audio = document.querySelector('audio');
    var button = document.querySelector('#draft');
    var audioDurantion = $('#roulette-options-list').children().length * 1000;

    if ( audio.paused ) {
      $('audio').animate({volume: 1});
      audio.currentTime = 0;
      audio.play();
      button.innerHTML = 'Parar!';
      $('div.roulette').roulette('start');	
    } else {
      button.innerHTML = 'Aguarde...';
      $('audio').animate({volume: 0}, audioDurantion, function() {
        audio.pause();
        button.innerHTML = 'Roda a Roda!';
      });
      
      $('div.roulette').roulette('stop');	
    } 
  }) 
}())

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