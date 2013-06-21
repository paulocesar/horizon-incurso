module.exports = function(req,res,ok) {
  channel = Utils.getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/channel/index');
    return;
  }
  Channel.find({_id:channel}).find(function(err,channel){
    if(err) {
      req.flash('error','Houve um erro na busca!');
      res.redirect('/channel/index');
      return;
    } else if(!channel) {
      req.flash('error','Canal indexistente');
      res.redirect('/channel/index');
      return;
    }

    if(req.session.user.role == 1 || channel._owner == req.session.user._id) {
      req.session.channel = channel;
      ok();
    } else {
      req.flash('error','Você não tem permissão');
      res.redirect('/channel/index');
      return;
    }
  });
};