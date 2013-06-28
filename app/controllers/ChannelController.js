module.exports = {
  index : function(req,res) {
    console.log(req.query);
    conditions = {};
    if(typeof req.body.q !== 'undefined') {
      conditions['name'] = new RegExp('.*'+req.body.q+'.*','i');
      conditions['description'] = new RegExp('.*'+req.body.q+'.*','i');
      // console.log(conditions);
    }
    //if Administrator
    if(req.session.user.role == 1) {
      Channel.find(conditions).populate('_owner','name email')
      .sort({_id:'desc'})
      .exec(function(err,channels){
        if(err)
          req.flash('error','Houve um erro ao buscar por canais');
        res.render('channel/index',{channels:channels});
      });

    //if Manager
    } else if(req.session.user.role == 2) {
      conditions['_owner'] = req.session.user._id;
      Channel
      .find(conditions)
      .sort({_id:'desc'})
      .populate('_owner','name email')
      .exec(function(err,channels){
        if(err)
          req.flash('error','Houve um erro ao buscar por canais');
        res.render('channel/index',{channels:channels});
      });

    //if User
    } else {
      ChannelUser
      .find({_user:req.session.user._id})
      .sort({_id:'desc'})
      .populate({
        path: '_channel',
        match: conditions,
      })
      // .populate('_channel._owner')
      .exec(function(err,userChannels){
        if(err) {
          req.flash('error','Houve um erro ao buscar por canais');
          res.render('channel/index',{channels:{}});
        } else if(!userChannels) {
          req.flash('warning','Você ainda não tem canais cadastrados');
          res.render('channel/index',{channels:userChannels});
        } else {
          channels = [];
          for(var i in userChannels)
            channels.push(userChannels[i]._channel);
          res.render('channel/index',{channels:channels});
        }
      });
    }
  },

  view : function(req,res) {
    Channel.findOne({_id:req.session.channel._id}).populate('_owner','name email image').exec(function(err,channel){
      Material.find({_channel:channel._id}).sort({_id:'ASC'}).exec(function (err,mats){
        if(err)
          req.flash('Não foi possível encontrar materiais');
        
        if(req.session.user.role == 1 || req.session.user.role == 2) {
          ChannelUser.find({_channel:req.session.channel._id})
          .populate('_user','email name')
          .exec(function (err2,chanUsers){
            if(err2)
              req.flash('Não possível achar alunos');
            res.render('channel/view',{chan:channel,channel_user:chanUsers,materials:mats});
          });
        } else {
          res.render('channel/view',{chan:channel,channel_user:null,materials:mats});
        }
      });
    });
  },

  create : function(req,res) {
    if(!req.isPost()) {
      req.redirect('/channel/index');
      return;
    }

    c = req.body;
    c._owner = req.session.user._id;
    if(c.channel_name != '' && c.channel_description != '' && (c.channel_access == 1 || c.channel_access == 2)) {
      Channel({
        name : c.channel_name,
        description : c.channel_description,
        access : c.channel_access,
        _owner : c._owner
      }).save(function(err){
        if(err)
          req.flash('error','Não foi possível salvar: '+err.err);
        else
          req.flash('success','O Canal foi salvo com sucesso');
        res.redirect('/channel/index');
      });
    } else {
      req.flash('error','Não foi possível salvar!');
      res.redirect('/channel/index');
    }

  },

  edit : function(req,res) {
    if(!req.isPost()) {
      req.redirect('/channel/index');
      return;
    }

    channel = req.session.channel;
    data = {
      name: req.body.name,
      description: req.body.description,
    };
    if(req.session.user.role == 1)
      data.active = req.body.active;
    Channel.update({_id:req.session.channel._id},{$set:data},{multi:true}
      ,function(err,numAffected){
        if(err)
          req.flash('error','Ouve uma falha no banco');
        else if(numAffected > 0)
          req.flash('success','Elemento atualizado com sucesso');
        res.redirect('/channel/view?channel='+req.session.channel._id);
      }
    );
  },

  delete : function(req,res) {
    Material.remove({_channel:req.session.channel._id},function(err){
      if(err)
        req.flash('error','Houve um erro no banco!');
      else
        Channel.remove({_id:req.session.channel._id},function(err){
          if(err)
            req.flash('error','Houve um erro no banco!');
          else
            req.flash('success','Canal removido com sucesso');
          res.redirect('/channel/index');
        });
    });
  },

  
}