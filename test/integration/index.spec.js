import { find } from 'lodash';
import { waterfall } from 'async';
import { expect, faker } from '@lykmapipo/test-helpers';

import mongoose from 'mongoose';

import {
  connect,
  drop,
  disconnect,
  isConnection,
  isConnected,
  model,
  createModel,
  syncIndexes,
  create,
  clear,
} from '../../src/index';

describe('integration', () => {
  const MONGODB_URI = 'mongodb://localhost/test';

  beforeEach((done) => connect(done));
  afterEach((done) => drop(done));
  afterEach((done) => disconnect(done));

  it('should register new model', () => {
    const User = model('User', new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');
  });

  it('should return already registered model', () => {
    const User = model('User');
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');
  });

  it('should return already registered model', () => {
    const User = model('User', new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');
  });

  it('should get non existing model silent', () => {
    const Profile = model('Profile');
    expect(Profile).to.not.exist;
  });

  it('should register a random model', () => {
    const User = model(new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.exist;
    expect(User.modelName).to.not.be.equal('User');
  });

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

  it('should save model instances', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });
    const a = new User({ name: faker.name.findName() });
    const b = new User({ name: faker.name.findName() });
    create(a, b, (error, results) => {
      const [c, d] = results;
      expect(error).to.not.exist;
      expect(c).to.exist;
      expect(d).to.exist;
      done(error, results);
    });
  });

  it('should save model instances', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });
    const a = new User({ name: faker.name.findName() });
    const b = new User({ name: faker.name.findName() });
    create([a, b], (error, results) => {
      const [c, d] = results;
      expect(error).to.not.exist;
      expect(c).to.exist;
      expect(d).to.exist;
      done(error, results);
    });
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

  it('should clear using models', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });
    const a = new User({ name: faker.name.findName() });

    waterfall(
      [
        (next) => create(a, (error) => next(error)),
        (next) => clear(User, next),
        (next) => User.countDocuments(next),
      ],
      (error, counts) => {
        expect(counts).to.equal(0);
        done(error, counts);
      }
    );
  });

  it('should clear using model names', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });
    const a = new User({ name: faker.name.findName() });

    waterfall(
      [
        (next) => create(a, (error) => next(error)),
        (next) => clear(User.modelName, next),
        (next) => User.countDocuments(next),
      ],
      (error, counts) => {
        expect(counts).to.equal(0);
        done(error, counts);
      }
    );
  });

  it('should clear all models', (done) => {
    const User = createModel({
      name: { type: String, index: true },
    });
    const a = new User({ name: faker.name.findName() });

    waterfall(
      [
        (next) => create(a, (error) => next(error)),
        (next) => clear(next),
        (next) => User.countDocuments(next),
      ],
      (error, counts) => {
        expect(counts).to.equal(0);
        done(error, counts);
      }
    );
  });
});
