const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
const should = chai.should();

global.chai = chai;
global.should = should;
global.expect = expect;

chai.use(chaiHttp);
