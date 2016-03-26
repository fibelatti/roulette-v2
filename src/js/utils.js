(function(){
  document.querySelector('a#draft').addEventListener('click', function(event){
    event.preventDefault()

    let audio = document.querySelector('audio');
    let button = document.querySelector('#draft');

    if ( audio.paused ) {
      $('audio').animate({volume: 1});
      audio.currentTime = 0;
      audio.play();
      button.innerHTML = 'Parar!';
      $('div.roulette').roulette('start');	
    } else {
      button.innerHTML = 'Aguarde...';
      $('audio').animate({volume: 0}, 21000, function() {
        audio.pause();
        button.innerHTML = 'Roda a Roda!';
      });
      
      $('div.roulette').roulette('stop');	
    } 
  }) 
}())

function asyncLoop (iterations, func, callback) {
  let index = 0;
  let done = false;
  let loop = {
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