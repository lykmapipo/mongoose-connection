import { find } from 'lodash';
import { waterfall } from 'async';
import { expect } from '@lykmapipo/test-helpers';

import {
  connect,
  drop,
  disconnect,
  isConnection,
  isConnected,
  createModel,
  syncIndexes,
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

  it('should disconnect', (done) => {
    waterfall(
      [
        (next) => connect(MONGODB_URI, next),
        (instance, next) => disconnect(instance, next),
      ],
      (error, instance) => {
        expect(error).to.not.exist;
        expect(instance).to.exist;
        expect(isConnection(instance)).to.be.true;
        expect(isConnected(instance)).to.be.false;
        expect(instance.readyState).to.be.equal(0);
        expect(instance.name).to.be.equal('test');
        done(error, instance);
      }
    );
  });

  it('should sync indexes', (done) => {
    const User = createModel(
      {
        name: { type: String, index: true },
      },
      { autoIndex: false }
    );

    waterfall(
      [
        (next) => User.createCollection((error) => next(error)),
        (next) =>
          User.listIndexes((error, indexes) => {
            expect(find(indexes, { name: 'name_1' })).to.not.exist;
            next(error);
          }),
        (next) => syncIndexes((error) => next(error)),
        (next) => User.listIndexes(next),
      ],
      (error, indexes) => {
        expect(error).to.not.exist;
        expect(indexes).to.exist;
        expect(find(indexes, { name: 'name_1' })).to.exist;
        done(error, indexes);
      }
    );
  });

  it('should sync indexes without autoIndex option', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });

    waterfall(
      [
        (next) => syncIndexes((error) => next(error)),
        (next) => User.listIndexes(next),
      ],
      (error, indexes) => {
        expect(error).to.not.exist;
        expect(indexes).to.exist;
        expect(find(indexes, { name: 'name_1' })).to.exist;
        done(error, indexes);
      }
    );
  });

  it('should sync indexes with autoIndex option', (done) => {
    const User = createModel(
      {
        name: { type: String, index: true },
      },
      { autoIndex: false }
    );

    waterfall(
      [
        (next) => syncIndexes((error) => next(error)),
        (next) => User.listIndexes(next),
      ],
      (error, indexes) => {
        expect(error).to.not.exist;
        expect(indexes).to.exist;
        expect(find(indexes, { name: 'name_1' })).to.exist;
        done(error, indexes);
      }
    );
  });
});
