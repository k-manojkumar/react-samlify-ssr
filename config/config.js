module.exports = {
  development: {
    app: {
      port: process.env.PORT || 1234,
    },
    samlify: {
      saml: {
        callbackUrl:
          process.env.SAML_CALLBACK_URL || "https://localhost:8081/sp/acs",
        entityID: process.env.SAML_ENTITY || "react-samlify",
        metadata:
          process.env.METADATA ||
          "../adMetadata/react-samlifyFederationMetadata.xml",
      },
    },
  },
};
