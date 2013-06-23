module.exports = {

  create : function (req, res) {
    var fs = require('fs');
    fs.readFile(req.files.file1.path, function (err, data) {
      filename = Utils.dateToFilename()+'-'+req.files.file1.name;
      var newPath = "./app/uploads/"+filename;
      console.log(newPath);
      console.log(data);
      fs.writeFile(newPath, data, function (err) {
        if(err) {
          console.log(err);
          req.flash('error','Arquivo não encontrado');
          res.redirect('/channel/view?channel='+req.session.channel._id);
        } else {
          Material({
            name: req.body.name,
            files: [{path:filename}],
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

  // index : function(req,res) { res.redirect('/'); },
  // view : function(req,res) { res.redirect('/'); },
  // create : function(req,res) { res.redirect('/'); },
  // edit : function(req,res) { res.redirect('/'); },
  // delete : function(req,res) { res.redirect('/'); },

};