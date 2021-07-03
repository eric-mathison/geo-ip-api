const location = require('../services/reader');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send();
    });

    app.get('/location/', async (req, res) => {
        const locationObj = await location(
            req.ip,
            req.headers['accept-language']
        );
        res.send(locationObj);
    });

    app.get('/location/:ipAddress', async (req, res) => {
        const { ipAddress } = req.params;
        const locationObj = await location(
            ipAddress,
            req.headers['accept-language']
        );
        res.send(locationObj);
    });
};
