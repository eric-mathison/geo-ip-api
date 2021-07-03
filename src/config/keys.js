const prodKeys = require('./prod');
const devKeys = require('./dev');

if (process.env.NODE_ENV === 'production') {
    module.exports = prodKeys;
} else {
    module.exports = devKeys;
}
