// Button events
$('#include-all-btn').on('click', function () {
  $('.list-group-item').addClass('active');
});

$('#remove-all-btn').on('click', function () {
  $('.list-group-item').removeClass('active');
});

$('#edit-roulette').on('click', function () {
  editRoulette();
});

$('#choose-another-roulette').on('click', function () {
  $('div.roulette').roulette('stop');	
  $('#roulettes-modal').modal('show');
});

$('#import-roulette-btn').on('click', function () {
  importRoulettesData();
});

// Modal events
$('#roulettes-modal-ok').on('click', function () {
  if (checkSetupIsValid()) {
    createRouletteImages();
  } else if (CURRENT_ROULETTE.name) {
    alert('Escolha a roleta');
  } else {
    alert('Escolha pelo menos 2 opções');
  }
});

$('#new-roulette-modal-ok').on('click', function () {
  saveRoulette();
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

// General functions
function init () {
  populateRouletteDropdown();
  showRoulettesModal();
}

// Roulette functions
function populateRouletteDropdown () {
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
      click: function () { fetchRouletteOptionsList(this.text); }
    }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));
  });
  
  populateDropdownMenus();
}

function populateDropdownMenus () {
  $('<li />', {
    role  : 'separator',
    class : 'divider' 
  }).appendTo($('#dropdown-roulette-list'));

  $('<a />', {
    href  : '#',
    text  : 'Nova Roleta',
    click: function(){ showNewRouletteModal(); }
  }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));

  $('<a />', {
    href  : '#',
    text  : 'Importar/Exportar roletas (json)',
    click: function(){ showImportExportModal(); }
  }).wrap('<li />').parent().appendTo($('#dropdown-roulette-list'));
}

function fetchRouletteOptionsList (rouletteName) {
  $('#dropdown-roulette-selector').html(rouletteName + '&nbsp<span class="caret"></span>');
  
  $('#roulette-options-list').empty();
  
  CURRENT_ROULETTE = _.find(SESSION_DATA.roulettes, function(o) { return o.name === rouletteName; });
  
  _.forEach(CURRENT_ROULETTE.options, function(value, key) {
    $('<a />', {
      id    : 'opt-' + key,
      href  : '#',
      class : 'list-group-item active',
      text  : value,
      click: function(){ $(this).toggleClass('active'); }
    }).appendTo($('#roulette-options-list'));
  });
  
  setPlaceholderName(rouletteName);
}

function createRouletteImages () {
  var activeOptions = $('.list-group').find('.active');
  
  asyncLoop(activeOptions.length, function(loop) {
    var currentOption = activeOptions[loop.iteration()];
    
    $('#img-generator-text').text(currentOption.text);
    
    html2canvas($('#img-generator'), {
      onrendered: function(canvas) {        
        var imgSrc = canvas.toDataURL("image/png");

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

function saveRoulette () {
  var rouletteName    = $('#new-roulette-name').val();
  var rouletteOptions = _.map(_.filter(_.split($('#new-roulette-options').val(), ','), function(item) { return _.trim(item) !== ""; }), function (item) { return _.trim(item); });
  
  if (rouletteName.length === 0) {
    alert('A roleta precisa de um nome');
  } else if (rouletteOptions.length < 2) {
    alert('A roleta precisa de no mínimo duas opções');
  } else {
    var existingRoulette = _.find(SESSION_DATA.roulettes, function(o) { return o.name === rouletteName; });
    
    if (existingRoulette) {
      var idx = _.findIndex(SESSION_DATA.roulettes, function(o) { return o.name === existingRoulette.name; });
      
      SESSION_DATA.roulettes[idx].name    = rouletteName;
      SESSION_DATA.roulettes[idx].options = rouletteOptions;
    } else {
      var newRoulette = {};
    
      newRoulette.name    = rouletteName;
      newRoulette.options = rouletteOptions;

      SESSION_DATA.roulettes.push(newRoulette);
    }
    
    saveToCookie();
    clearNewRouletteForm();
    resetRouletteDropdown();
    populateRoulettes();
    
    $('#new-roulette-modal').modal('hide');
    $('#roulettes-modal').modal('show');
  }
}

function importRoulettesData () {
  var selectedFile = $('#json-file').get(0).files[0];

  if (selectedFile) {
    var reader = new FileReader();
    reader.readAsText(selectedFile, "UTF-8");
    reader.onload = function (evt) {
      var importedRoulettes = JSON.parse(evt.target.result);
      
      if (tv4.validate(importedRoulettes, ROULETTES_JSON_SCHEMA)) {
        
        var shouldReplace = $('#import-replace-check').is(':checked');
        
        if (shouldReplace) {
          SESSION_DATA = importedRoulettes;
        } else {
          _.forEach(importedRoulettes.roulettes, function(value) {
            SESSION_DATA.roulettes.push(value);
          });
        }

        saveToCookie();
        populateRoulettes();

        $('#impexp-roulettes-modal').modal('hide');
        $('#roulettes-modal').modal('show');
      } else {
        alert('Selecione um arquivo .json válido');
      }
    }
  } else {
    alert('Selecione um arquivo .json');
  }
}

function editRoulette () {
  if (CURRENT_ROULETTE.name) {
    $('#new-roulette-name').val(CURRENT_ROULETTE.name);
    $('#new-roulette-options').val(CURRENT_ROULETTE.options); 
    
    showNewRouletteModal();
  } else {
    alert('Escolha uma roleta para editar'); 
  }
}

function loadExportRoulettesDataURL () {  
  var json = JSON.stringify(SESSION_DATA);
  var blob = new Blob([json], {type: "application/json"});
  var url  = URL.createObjectURL(blob);
  
  $('#export-roulette-btn').attr('href', url);
  $('#export-roulette-btn').attr('download', 'roulettes.json');
}

// Modal functions
function showRoulettesModal () {
  $('#roulettes-modal').modal('show');
}

function showImportExportModal () {
  $('#roulettes-modal').modal('hide');
  $('#impexp-roulettes-modal').modal('show');
  loadExportRoulettesDataURL();
}

function showNewRouletteModal () {
  $('#roulettes-modal').modal('hide');
  $('#new-roulette-modal').modal('show');
}

// Validation functions
function checkSetupIsValid () {
  return $('.list-group').find('.active').length >= 2;
}

// Cleaning functions
function clearNewRouletteForm () {
  $('#new-roulette-name').val('');
  $('#new-roulette-options').val('')
}

function resetRouletteDropdown () {
  $('#roulette-options-list').empty();
  $('#dropdown-roulette-selector').html('Escolha a Roleta&nbsp<span class="caret"></span>');
  CURRENT_ROULETTE = {};
}

function setPlaceholderName (rouletteName) {
  $('#roulette-name').text(rouletteName);
}

// Cookie functions
function loadRoulettesFromCookie () { 
  if ($.cookie("fibelatti-roulettes-data") !== undefined) SESSION_DATA = JSON.parse($.cookie("fibelatti-roulettes-data"));
}

function saveToCookie () {
  $.cookie("fibelatti-roulettes-data", JSON.stringify(SESSION_DATA), { expires: 365 });
}