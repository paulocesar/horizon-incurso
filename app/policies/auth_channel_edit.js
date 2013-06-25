module.exports = function(req,res,ok) {
  channel = Utils.getChannel(req);
  if(!channel || !req.session.user) {
    res.redirect('/channel/index');
    return;
  }

  Channel.findOne({_id:channel}).exec(function(err,channel){
    if(err) {
      req.flash('error','Houve um erro na busca!');
      res.redirect('/channel/index');
    } else if(!channel) {
      req.flash('error','Canal indexistente');
      res.redirect('/channel/index');
    } else if(channel) {
      can_access = false;

      //if Administrator
      if(req.session.user.role == 1)
        can_access = true;
      //if Manager
      if(req.session.role == 2 && channel._owner == req.session.user._id)
        can_access = true;

      if(can_access) {
        req.session.channel = channel;
        ok();
        return;
      }

      //if User can Edit
      ChannelUser
      .findOne({_channel:channel._id,_user:req.session.user._id,level:2})
      .exec(function(err,channelUser) {
        if(err) {
          req.flash('error','Houve um erro na busca!');
          res.redirect('/channel/index');
        } else if(!channelUser) {
          req.flash('error','Você não tem permissão!');
          res.redirect('/channel/index');
        } else {
          req.session.channel = channel;
          req.session.channelUser = channelUser;
          ok();
        }
      });
    }
  });
};