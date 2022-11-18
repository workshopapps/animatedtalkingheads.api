const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const podcasts = require('./podcasts');
const avatars = require('./avatars');
const accessories = require('./accessories');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...podcasts,
  ...accessories,
  ...avatars,
};
