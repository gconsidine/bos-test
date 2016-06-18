var chai = require('chai'),
    sinon = require('sinon');

module.exports = {
    expect: chai.expect,
    should: chai.should(),
    assert: chai.assert,
    spy: sinon.spy,
    stub: sinon.stub,
    mock: sinon.mock,
    _: {
        chai: chai,
        sinon: sinon
    }
};
