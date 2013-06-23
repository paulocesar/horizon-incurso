module.exports = {

  index : function(req,res) { res.redirect('/'); },
  view : function(req,res) { res.redirect('/'); },
  create : function(req,res) { res.redirect('/'); },
  edit : function(req,res) { res.redirect('/'); },
  delete : function(req,res) { res.redirect('/'); },

  invite : function(req,res) {
    if(!req.isPost()) {
      res.redirect('/channel/view?channel='+req.session.channel._id);
      return;
    }

    User.findOne({email:req.body.email},function(err,user){
      if(err) {
        req.flash('error','Houve um erro no banco!');
        res.redirect('/channel/view?channel='+req.session.channel._id);
      } else if(!user) {
        req.flash('error','Usuário inexistente!');
        res.redirect('/channel/view?channel='+req.session.channel._id);
      } else {

        ChannelUser.findOne({_channel:req.session.channel._id,_user:user._id}).exec(function(err,channelUser){
          if(err) {
            req.flash('error','Houve um erro no banco!');
            res.redirect('/channel?channel='+req.session.channel._id);
          } else if(channelUser) {
            req.flash('error','Usuário já foi convidado!');
            res.redirect('/channel/view?channel='+req.session.channel._id);
          } else {
              ChannelUser({
                _channel: req.session.channel._id,
                _user: user._id,
                level: 1
              }).save(function(err){
                if(err)
                  req.flash('error','Houve um erro no banco!');
                else
                  req.flash('success','Usuário convidado');
                res.redirect('/channel/view?channel='+req.session.channel._id);
              });
          }
        });

      }
    });
  },

  uninvite : function(req,res) {
    if(!req.isGet()) {
      res.redirect('/channel/view?channel='+req.session.channel._id);
      return;
    }
    //remove user from channel and channel from user
    ChannelUser.remove({_id:req.query.id},function(err,channelUser){
      if(err)
        req.flash('error','Houve um erro no banco!');
      else
        req.flash('success','Usuário desconvidado');
      res.redirect('/channel/view?channel='+req.session.channel._id);
    });
  }

};