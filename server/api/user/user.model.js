'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var text = "don't be so smart",key = 'DAM DAM';

var UserSchema = new Schema({
  fname: { type: String, required: false},
  lname: { type: String, required: false},
  name: { type: String,required: false},
  email: { type: String, lowercase: false,required: false },
  // role: {
  //   type: String,
  //   default: 'user'
  // },
  role  : { type: String,Enum:['user','admin'], required: false },
  verification_token: { type: String,required: false},
  verified: { type: Boolean,required: true,default:true},
  last_login_date: { type: Date,default: new Date()},
  hashedPassword: { type: String, required: false, },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
},
{
  timestamps: true
},{
  toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
}
);

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

  UserSchema.set('fullname', 'This is full name');


  UserSchema
.virtual('fullname')
.get(function () {
  return "thisasdhf sdsfsdf";
})




// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
// UserSchema
//   .pre('save', function(next) {
//     if (!this.isNew) return next();
//     if (authTypes.indexOf(this.provider) !== -1) return true;
//     var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     var token = '';
//     for (var i = 128; i > 0; --i) {
//       token += chars[Math.round(Math.random() * (chars.length - 1))];
//     }
//     if (authTypes.indexOf(this.provider) === -1) 
//       UserSchema.verification_token = token;
//       UserSchema.verified = false;
//     if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
//       next(new Error('Invalid password'));
//     else
//       next();
//   });
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    this.verification_token = crypto.createHmac('sha1', key).update(text).digest('hex');
    console.log(this.verification_token);
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64,'SHA512').toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
