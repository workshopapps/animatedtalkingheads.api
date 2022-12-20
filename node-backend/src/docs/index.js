const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const allDocs = require('./allDocs/index');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  

  ...allDocs,
};
