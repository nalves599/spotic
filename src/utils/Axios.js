const axios = require('axios').default;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = axios;
