'use strict';

// Development specific configuration
// ==================================
module.exports = {
  version:'0.0.1',
  // MongoDB connection options
  mongo: {
    // uri: 'mongodb://localhost:27017/timesheet',
    uri: 'mongodb://test:test@ds143738.mlab.com:43738/timesheet1231',
  },
  email:{
    host    : 'mail.vstglobal.com',
    user    : 'no-reply@vstglobal.com',
    password  : 'vstglobal',
    sender    : 'VstGlobal <vstglobal.com>'
  },
};
