global.$$exmoWS$$ = {};
require('./App/index');
require('./Helpers/Node')
require('./Helpers/index');
require('./App/subscribeObject');
require('./App/WSObject');
require('./App/PublicWS');
require('./App/PrivateWS');

module.exports = $$exmoWS$$;