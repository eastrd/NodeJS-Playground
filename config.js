// Container for all the environments
const environments = {};

// Default
environments.staging = {
  port: 3000,
  name: "staging",
};


environments.production = {
  port: 5000,
  name: "prod",
};

const currentEnv = process.env.NODE_ENV;
const envExport = environments[currentEnv] ?? environments.staging;

module.exports = envExport;