// Container for all the environments
const environments = {};

// Default
environments.staging = {
  portHTTP: 3000,
  portHTTPS: 3001,
  name: "staging",
};


environments.production = {
  portHTTP: 5000,
  portHTTPS: 5001,
  name: "prod",
};

const currentEnv = process.env.NODE_ENV;
const envExport = environments[currentEnv] ?? environments.staging;

module.exports = envExport;