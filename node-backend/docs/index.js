const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const podcasts = require('./podcasts/index');
const avatars = require('./avatars/index');
const accessories = require('./accessories/index');
const payment = require('./payment/index');

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,

  // ...accessories,
  // ...avatars,

  // ...payment,
  ...podcasts,
};
