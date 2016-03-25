(function(){
  document.querySelector('a#draft').addEventListener('click', function(event){
    event.preventDefault()

    var audio = document.querySelector('audio');
    var button = document.querySelector('#draft');

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

$('#include-all-btn').on('click', function () {
  $('.list-group-item').addClass('active');
  
  var node = document.getElementById("opt-container");

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
  
  $('#opt-container').append('<img id="img-204" src="src/assets/includes/images/204.png"/>');
  $('#opt-container').append('<img id="img-alemao" src="src/assets/includes/images/alemao.png"/>');
  $('#opt-container').append('<img id="img-croasonho" src="src/assets/includes/images/croasonho.png"/>');
  $('#opt-container').append('<img id="img-jaber" src="src/assets/includes/images/jaber.png"/>');
  $('#opt-container').append('<img id="img-primedog" src="src/assets/includes/images/primedog.png"/>');
  $('#opt-container').append('<img id="img-mineiro" src="src/assets/includes/images/mineiro.png"/>');
  $('#opt-container').append('<img id="img-passarinho" src="src/assets/includes/images/passarinho.png"/>');
  $('#opt-container').append('<img id="img-patiopaulista" src="src/assets/includes/images/patiopaulista.png"/>');
  $('#opt-container').append('<img id="img-jazz" src="src/assets/includes/images/jazz.png"/>');
  $('#opt-container').append('<img id="img-massinha" src="src/assets/includes/images/massinha.png"/>');
  $('#opt-container').append('<img id="img-trikilo" src="src/assets/includes/images/trikilo.png"/>');
  $('#opt-container').append('<img id="img-dominos" src="src/assets/includes/images/dominos.png"/>');
  $('#opt-container').append('<img id="img-habbibs" src="src/assets/includes/images/habbibs.png"/>');
  $('#opt-container').append('<img id="img-pastel" src="src/assets/includes/images/pastel.png"/>');
  $('#opt-container').append('<img id="img-shoppinho" src="src/assets/includes/images/shoppinho.png"/>');
  $('#opt-container').append('<img id="img-padariaar" src="src/assets/includes/images/padariaar.png"/>');
  $('#opt-container').append('<img id="img-pf" src="src/assets/includes/images/pf.png"/>');
  $('#opt-container').append('<img id="img-temakiya" src="src/assets/includes/images/temakiya.png"/>');
  $('#opt-container').append('<img id="img-premium" src="src/assets/includes/images/premium.png"/>');
});

$('#remove-all-btn').on('click', function () {
  $('.list-group-item').removeClass('active');
  
  var node = document.getElementById("opt-container");

  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }

  $('#opt-container').append('<img id="sadface" src="src/assets/includes/images/sadface.png"/>');
});

$('#modal-ok').on('click', function () {
  var option = {
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
  } 

  $('div.roulette').roulette(option);
});

$('.list-group-item').on('click', function () {
  var targetID = $(this).attr('id').replace("opt-", "");
  
  var node = document.getElementById("opt-container");
  var childNode = document.getElementById("sadface");
  
  if (childNode != null) node.removeChild(childNode);
  
  if ($('#img-' + targetID).length > 0) {
    $('#img-' + targetID).remove();
  } else {
    $('#opt-container').append('<img id="' + targetID + '" src="src/assets/includes/images/' + targetID + '.png"/>');
  }
  
  if (node.hasChildNodes() == false) $('#opt-container').append('<img id="sadface" src="src/assets/includes/images/sadface.png"/>');
  
  $('#opt-' + targetID).toggleClass('active');
});