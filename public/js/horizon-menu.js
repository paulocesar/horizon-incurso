
var HorizonMenu = {
  data : null,
  init : function(data) {
    HorizonMenu.data = data;
    $('a.horizon_menu_index').click(function (event){
      event.preventDefault();
      id = $(this).prop('href');
      id = id.split('#')[1];
      for(var i = 0; i < HorizonMenu.data.length; i++) {
        $('div'+HorizonMenu.data[i]).hide('slow');
      }
      $('div#'+id).show('slow');
    });
  }
};