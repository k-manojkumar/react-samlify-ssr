
const samlify = require('samlify');
const fs = require('fs');
const path = require('path');

const validator = require('@authenio/samlify-node-xmllint');
var env = process.env.NODE_ENV || 'development';

const config = require('./config')[env];


const binding = samlify.Constants.namespace.binding;

samlify.setSchemaValidator(validator);

// configure Azure idp
const idp = samlify.IdentityProvider({
  metadata: fs.readFileSync( path.resolve(__dirname, config.samlify.saml.metadata)),
  wantLogoutRequestSigned: true
});



// configure service provider (application)
const sp = samlify.ServiceProvider({
  entityID: config.samlify.saml.entityID,
  authnRequestsSigned: false,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutResponseSigned: true,
  wantLogoutRequestSigned: true,
  isAssertionEncrypted: false,
  assertionConsumerService: [{
    Binding: binding.post,
    Location: config.samlify.saml.callbackUrl,
  }]
});





module.exports = function assignEntity(req, res, next) {

  req.idp = idp;
  req.sp = sp;


  return next();

};