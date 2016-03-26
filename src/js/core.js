$('#include-all-btn').on('click', function () {
  $('.list-group-item').addClass('active');
});

$('#remove-all-btn').on('click', function () {
  $('.list-group-item').removeClass('active');
});

$('#roulettes-modal-ok').on('click', function () {
  if (checkSetupIsValid()) {
    createRouletteImages();
  } else {
    alert('Escolha pelo menos 2 opções!');
  }
});

$('#new-roulette-modal-ok').on('click', function () {
  createNewRoulette();
});

$('#new-roulette-modal-cancel').on('click', function () {
  clearNewRouletteForm();
  $('#new-roulette-modal').modal('hide');
  $('#roulettes-modal').modal('show');
});

$('#impexp-roulettes-modal-cancel').on('click', function () {
  $('#impexp-roulettes-modal').modal('hide');
  $('#roulettes-modal').modal('show');
});

function init () {
  populateRoulettes();
  showRoulettesModal();
}

function populateRoulettes () {
  loadRoulettesFromCookie();
  $('#dropdown-roulette-list').empty()
  
  $('<li />', {
    class : 'dropdown-header',
    text  : 'Suas roletas'
  }).appendTo($('#dropdown-roulette-list'));
  
  _.forEach(SESSION_DATA.roulettes, function(value) {
    $('<a />', {
      href  : '#',
      text  : value.name,
      click: function(){ fetchRouletteOptionsList(this.text); }
    }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));
  });
  
  populateDefaultOptions();
}

function populateDefaultOptions () {
  $('<li />', {
    role  : 'separator',
    class : 'divider' 
  }).appendTo($('#dropdown-roulette-list'));

  $('<a />', {
    href  : '#',
    text  : 'Nova Roleta',
    click: function(){ showNewRouletteModal(); }
  }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));

  /*
  $('<a />', {
    href  : '#',
    text  : 'Importar/Exportar roletas (json)',
    click: function(){ showImportExportModal(); }
  }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));
  */
}

function fetchRouletteOptionsList (rouletteName) {
  $('#roulette-options-list').empty();
  
  let roulette = _.find(SESSION_DATA.roulettes, function(o) { return o.name === rouletteName; });
  
  _.forEach(roulette.options, function(value, key) {
    $('<a />', {
      id    : 'opt-' + key,
      href  : '#',
      class : 'list-group-item active',
      text  : value,
      click: function(){ $(this).toggleClass('active'); }
    }).appendTo($('#roulette-options-list'));
  });
}

function showRoulettesModal () {
  $('#roulettes-modal').modal('show');
}

function showImportExportModal () {
  $('#roulettes-modal').modal('hide');
  $('#impexp-roulettes-modal').modal('show');
}

function showNewRouletteModal () {
  $('#roulettes-modal').modal('hide');
  $('#new-roulette-modal').modal('show');
}

function createRouletteImages () {
  let activeOptions = $('.list-group').find('.active');
  
  asyncLoop(activeOptions.length, function(loop) {
    let currentOption = activeOptions[loop.iteration()];
    
    $('#img-generator-text').text(currentOption.text);
    
    html2canvas($('#img-generator'), {
      onrendered: function(canvas) {        
        let imgSrc = canvas.toDataURL("image/png");

        $('<img />', {
          src: imgSrc,
        }).appendTo($('#opt-container'));

        loop.next();
      }
    })},
    function(){
      $('div.roulette').roulette(ROULETTE_OPTION);
      $('#roulettes-modal').modal('hide');
    }
  );
}

function checkSetupIsValid () {
  let activeOptions = $('.list-group').find('.active');
  
  return activeOptions.length >= 2;
}

function createNewRoulette () {
  let rouletteName    = $('#new-roulette-name').val();
  let rouletteOptions = _.map(_.filter(_.split($('#new-roulette-options').val(), ','), function(item) { return _.trim(item) !== ""; }), function (item) { return _.trim(item); });
  
  if (rouletteName.length === 0) {
    alert('A roleta precisa de um nome.');
  } else if (rouletteOptions.length < 2) {
    alert('A roleta precisa de no mínimo duas opções.');
  } else {
    let newRoulette = {};
    
    newRoulette.name    = rouletteName;
    newRoulette.options = rouletteOptions;
    
    SESSION_DATA.roulettes.push(newRoulette);
    saveToCookie();
    
    populateRoulettes();
    clearNewRouletteForm();
    $('#new-roulette-modal').modal('hide');
    $('#roulettes-modal').modal('show');
  }
}

function clearNewRouletteForm () {
  $('#new-roulette-name').val('');
  $('#new-roulette-options').val('')
}

function loadRoulettesFromCookie () {
  if ($.cookie("fibelatti-roulettes-data") !== undefined) {
    let cookieData = JSON.parse($.cookie("fibelatti-roulettes-data"));
    
    SESSION_DATA = cookieData;
  }
}

function saveToCookie () {
  $.cookie("fibelatti-roulettes-data", JSON.stringify(SESSION_DATA), { expires: 365 });
}