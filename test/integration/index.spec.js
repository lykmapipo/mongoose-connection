import { expect } from '@lykmapipo/test-helpers';

import {
  connect,
  drop,
  disconnect,
  isConnection,
  isConnected,
} from '../../src/index';

describe('integration', () => {
  const MONGODB_URI = 'mongodb://localhost/test';

  beforeEach((done) => connect(done));
  afterEach((done) => drop(done));
  afterEach((done) => disconnect(done));

  it('should connect on given url', (done) => {
    connect(MONGODB_URI, (error, instance) => {
      expect(error).to.not.exist;
      expect(instance).to.exist;
      expect(isConnection(instance)).to.be.true;
      expect(isConnected(instance)).to.be.true;
      expect(instance.readyState).to.be.equal(1);
      expect(instance.name).to.be.equal('test');
      done(error, instance);
    });
  });

  it('should connect from process.env.MONGODB_URI', (done) => {
    process.env.MONGODB_URI = MONGODB_URI;
    connect((error, instance) => {
      expect(error).to.not.exist;
      expect(instance).to.exist;
      expect(isConnection(instance)).to.be.true;
      expect(isConnected(instance)).to.be.true;
      expect(instance.readyState).to.be.equal(1);
      expect(instance.name).to.be.equal('test');
      delete process.env.MONGODB_URI;
      done(error, instance);
    });
  });
});
