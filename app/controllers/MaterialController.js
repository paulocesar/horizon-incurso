module.exports = {

  index : function(req,res) { res.redirect('/channel/view?channel='+req.session.channel._id); },
  // edit : function(req,res) { res.redirect('/'); },
  // delete : function(req,res) { res.redirect('/'); },

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
      filename = Utils.dateToFilename()+'-'+req.files.file1.name;
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
      filename = Utils.dateToFilename()+'-'+req.files.file1.name;
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
            if(err2)
              req.flash('error','Existem campos inválidos');
            else
              req.flash('success','Material criado');
            res.redirect('/channel/view?channel='+req.session.channel._id);
          });
        }
      });
    });
  },

};