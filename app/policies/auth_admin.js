module.exports = function(req,res,ok) {
  if(!req.session.user || req.session.user.role != 1) {
    req.flash('error','Você não tem permissão');
    res.redirect('/channel/index');
    return;
  }
  ok();
};