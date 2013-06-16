Horizon.init();

function incurso_user_edit(params) {
  alert('Edição temporariamente indisponível');
}

function incurso_user_remove(params) {
  console.log(params);
  $.get('/user/delete',params,function(){
    location.reload();
  });
}