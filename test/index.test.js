const app = require('../src/index');

describe('Get /', () => {
    it('should return a status code of 200', (done) => {
        chai.request(app)
            .get('/')
            .end(() => {
                done();
            });
    });
});
