var Horizon = {
  cmd : '#!',
  init : function (config) {
    // var hash = document.URL.substr(document.URL.indexOf('#')+1);
    link = document.URL.split(Horizon.cmd);
    if(link[1])
      Horizon.interpret(link[1]);

    $('a.horizon').click(function () {
      Horizon.click($(this),'href');
    });
    if(typeof config == 'function')
      window[config]();
  },
  interpret : function (hash) {
    var action = hash.split('&');
    var method = action[0];
    var params = {};
    for(i = 1; i < action.length; i++) {
      var variable = action[i].split('=');
      params[variable[0]] = variable[1];
    }
    window[method](params);
  },
  action : function (name,params) {
    var action = name;
    for(var i in params)
      action += '&' + i + '=' + params[i];
    action = action.replace(/ /g, '+');
    return action;
  },
  click : function (element,property) {
    action = element.prop(property).split(Horizon.cmd);
    if(action[1])
      Horizon.interpret(action[1]);
  }
};

