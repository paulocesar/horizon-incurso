module.exports = {
  
  SessionController : {
    logout : 'auth'
  },
  
  UserController : {
    index : 'auth_admin',
    create : 'auth_admin',
    edit : 'auth_admin',
    delete : 'auth_admin'
  },
  
  ChannelController : {
    index : 'auth',
    view : 'auth_channel_view',
    create : 'auth_manager',
    edit : 'auth_manager',
    delete : 'auth_channel_delete'
  },

  ChannelUserController : {
    invite : 'auth_channel_edit',
    uninvite : 'auth_channel_edit'
  },

  MaterialController : {
    index : 'auth_channel_view',
    view : 'auth_channel_view',
    create : 'auth_channel_edit',
    edit : 'auth_channel_edit',
    delete : 'auth_channel_delete',
  }

};