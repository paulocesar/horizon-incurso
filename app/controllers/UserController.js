module.exports = {
  index : function(req,res) {
    User.find({}).exec(function(err,users){
      res.render('user/create',{users:users});
    });
  },

  create : function(req,res){
    if(!req.isPost()) {
      res.redirect('/user/index');
      return;
    }

    if(req.body.password == req.body.passwordconfirm
      && req.body.password != '' 
      && req.body.password.length > 5
      && req.body.email != ''
      && req.body.name != '') {
      User({
        name:req.body.name,
        email:req.body.email,
        password:Utils.passwordHash(req.body.password),
        role:req.body.role
      }).save(function(err){
        if(err)
          req.flash('error','Usuário inválido: '+err.err);
        else
          req.flash('success','Usuario salvo com sucesso');
        res.redirect('/user/index');
      });
    }else{
      res.redirect('/user/index');
    }
  },

  edit : function(req,res) {
    if(req.isGet()) {
      User.find({}).exec(function(err,users){
        res.render('user/create',{users:users});
      });
    }
    if(req.isPost()) {
      res.redirect('/user/create');
    }
  },

  delete : function(req,res) {
    if(typeof req.query._id === 'undefined') {
      res.redirect('/user/index');
      return;
    }
    User.remove({_id:req.query._id},function(err){
      if(err)
        req.flash('error', 'Houve um erro ao excluir: '+err.err);
      else
        req.flash('success', 'Usuário removido com sucesso');
      res.redirect('/user/index');
    });
  }
}