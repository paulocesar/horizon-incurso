module.exports = {
  login : function(req,res) {
    if(req.isGet()) {
      if(req.session.user)
        res.redirect('/channel/index');
      else
        res.render('session/login');
    }

    if(req.session.user) {
      res.redirect('/channel/index');
      return;
    }

    email = req.body.email;
    password = req.body.password;
    if(!email || !password) {
      res.render('session/login',{flash_error:"existe campos em branco"});
      return;
    }
    password = Utils.passwordHash(password);
    User.findOne({email:email,password:password},function(err,user){
      if(err) {
        res.send(__('500'),500);
        return;
      }
      if(!user) {
        res.render('session/login',{flash_error:"login/senha inválidos"});
        return;
      }
      if(user) {
        req.session.user = user;
        res.redirect('/channel/index');
      }
    });
  },

  logout : function (req,res) {
    req.session.user = null;
    res.redirect('/session/login');
  }
}