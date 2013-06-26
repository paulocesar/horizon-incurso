module.exports = {

  index : function(req,res) { res.redirect('/channel/view?channel='+req.session.channel._id); },
  
  //TODO 
  delete_file : function (req, res) {

  },
  download : function (req, res) {

  },

  edit : function (req, res) {
    if(!req.isPost()) {
      req.redirect('/material/view?channel='+req.session.channel._id+'&id='+req.query.id);
      return;
    }

    data = {
      name: req.body.name,
      description: req.body.description,
    };

    Material.update({_id:req.query.id},{$set:data},{multi:true}
      ,function(err,numAffected){
        if(err)
          req.flash('error','Ouve uma falha no banco');
        else if(numAffected > 0)
          req.flash('success','Elemento atualizado com sucesso');
        res.redirect('/material/view?channel='+req.session.channel._id+'&id='+req.query.id);
      }
    );
  },

  view : function (req,res) {
    Material.findOne({_id:req.query.id}).exec(function (err,material){
      if(err) {
        req.flash('error','Material inexistente');
        res.redirect('/channel/view?channel='+req.session.channel._id);
      } else {
        res.render('material/view',{material:material});
      }
    });
  },

  add_file : function (req,res) {
    var fs = require('fs');
    fs.readFile(req.files.file1.path, function (err, data) {
      filename = Utils.dateToFilename()+'-'+req.files.file1.name.replace(/ /g,'');
      name_orig = req.files.file1.name;
      var newPath = "./app/uploads/"+filename;
      fs.writeFile(newPath, data, function (err) {
        if(err) { 
          req.flash('error','Arquivos não encontrado');
          res.redirect('/channel/view?channel='+req.session.channel._id);
        } else {

          Material.findOne({_id:req.query.id}).exec(function (err,material){
            if(err) {
              req.flash('error','Material inexistente');
              res.redirect('/channel/view?channel='+req.session.channel._id);
            } else {
              material.files.push({name:name_orig,path:filename});
              material.save(function (err2) {
                if(err2)
                  req.flash('error','Não foi possível adicionar o arquivo');
                else
                  req.flash('success','Arquivo adicionando');
                res.redirect('/material/view?channel='+req.session.channel._id+'&id='+material._id);
              });
            }
          });

        }
      });
    });
  },

  create : function (req, res) {
    var fs = require('fs');
    fs.readFile(req.files.file1.path, function (err, data) {
      filename = Utils.dateToFilename()+'-'+req.files.file1.name.replace(/ /g,'');
      name_orig = req.files.file1.name;
      var newPath = "./app/uploads/"+filename;
      fs.writeFile(newPath, data, function (err) {
        if(err) { 
          req.flash('error','Arquivos não encontrado');
          res.redirect('/channel/view?channel='+req.session.channel._id);
        } else {
          Material({
            name: req.body.name,
            description: req.body.description,
            files: [{name: name_orig, path: filename}],
            _channel: req.session.channel._id
          })
          .save(function (err2) {
            if(err2) {
              req.flash('error','Existem campos inválidos');
              res.redirect('/channel/view?channel='+req.session.channel._id);
            } else {
              req.flash('success','Material criado');
              Material.findOne({name:req.body.name,description:req.body.description}).sort({_id:-1}).exec(function (err,mat){
                if(err) {
                  req.flash('error','Não foi possível encontrar o material');
                  res.redirect('/channel/view?channel='+req.session.channel._id);
                } else {
                  res.redirect('/material/view?channel='+req.session.channel._id+'&id='+mat._id);
                }
              });
            }
          });
        }
      });
    });
  },

  delete : function(req,res) {
    Channel.remove({_id:req.query.id},function(err){
      if(err)
        req.flash('error','Houve um erro no banco!');
      else
        req.flash('success','Material removido com sucesso');
      res.redirect('/channel/view?channel='+req.session.channel._id);
    });
  },

};