import { mock, spy, stub, expect, faker } from '@lykmapipo/test-helpers';
import mongoose from 'mongoose';

import {
  SCHEMA_OPTIONS,
  SUB_SCHEMA_OPTIONS,
  enableDebug,
  disableDebug,
  isConnection,
  isConnected,
  isSchema,
  isModel,
  isQuery,
  isAggregate,
  isInstance,
  modelNames,
  createSubSchema,
  createSchema,
  model,
  collectionNameOf,
  createModel,
  deleteModels,
  connect,
  disconnect,
  clear,
  syncIndexes,
  drop,
} from '../src/index';

describe('unit', () => {
  let testModelName;
  let testSchema;
  let TestModel;
  let testQuery;
  let testAggregate;

  beforeEach(() => {
    testModelName = faker.random.uuid();
    testSchema = new mongoose.Schema({ name: String });
    TestModel = mongoose.model(testModelName, testSchema);
    testQuery = TestModel.find();
    testAggregate = TestModel.aggregate();
  });

  it('should provide default schema options', () => {
    expect(SCHEMA_OPTIONS).to.exist;
    expect(SCHEMA_OPTIONS).to.be.an('object');
    expect(SCHEMA_OPTIONS).to.be.eql({
      id: false,
      timestamps: true,
      toJSON: { getters: true },
      toObject: { getters: true },
      emitIndexErrors: true,
    });
  });

  it('should provide default sub schema options', () => {
    expect(SUB_SCHEMA_OPTIONS).to.exist;
    expect(SUB_SCHEMA_OPTIONS).to.be.an('object');
    expect(SUB_SCHEMA_OPTIONS).to.be.eql({
      _id: false,
      id: false,
      timestamps: false,
      emitIndexErrors: true,
    });
  });

  it('should enable mongoose degugging', () => {
    expect(enableDebug).to.exist;
    expect(enableDebug).to.be.a('function');
    expect(enableDebug).to.have.length(0);

    const set = spy(mongoose, 'set');

    enableDebug();

    expect(set).to.have.been.calledOnce;
    expect(set).to.have.been.calledWith('debug', true);

    set.restore();
  });

  it('should disable mongoose degugging', () => {
    expect(disableDebug).to.exist;
    expect(disableDebug).to.be.a('function');
    expect(disableDebug).to.have.length(0);

    const set = spy(mongoose, 'set');

    disableDebug();

    expect(set).to.have.been.calledOnce;
    expect(set).to.have.been.calledWith('debug', false);

    set.restore();
  });

  it('should check if value is a Connection', () => {
    expect(isConnection).to.exist;
    expect(isConnection).to.be.a('function');
    expect(isConnection).to.have.length(1);

    expect(isConnection(new mongoose.Connection())).to.be.true;
    expect(isConnection('123')).to.be.false;
    expect(isConnection()).to.be.false;
  });

  it('should check if connected', () => {
    expect(isConnected).to.exist;
    expect(isConnected).to.be.a('function');
    expect(isConnected).to.have.length(1);

    expect(isConnected(new mongoose.Connection())).to.be.false;
    expect(isConnected('123')).to.be.false;
    expect(isConnected()).to.be.false;
  });

  it('should check if value is Schema', () => {
    expect(isSchema).to.exist;
    expect(isSchema).to.be.a('function');
    expect(isSchema).to.have.length(1);

    expect(isSchema(testSchema)).to.be.true;
    expect(isSchema('123')).to.be.false;
    expect(isSchema()).to.be.false;
  });

  it('should check if value is Model', () => {
    expect(isModel).to.exist;
    expect(isModel).to.be.a('function');
    expect(isModel).to.have.length(1);

    expect(isModel(TestModel)).to.be.true;
    expect(isModel(testSchema)).to.be.false;
    expect(isModel('123')).to.be.false;
    expect(isModel()).to.be.false;
  });

  it('should check if value is Query', () => {
    expect(isQuery).to.exist;
    expect(isQuery).to.be.a('function');
    expect(isQuery).to.have.length(1);

    expect(isQuery(testQuery)).to.be.true;
    expect(isQuery('123')).to.be.false;
    expect(isQuery()).to.be.false;
  });

  it('should check if value is Aggregate', () => {
    expect(isAggregate).to.exist;
    expect(isAggregate).to.be.a('function');
    expect(isAggregate).to.have.length(1);

    expect(isAggregate(testAggregate)).to.be.true;
    expect(isAggregate('123')).to.be.false;
    expect(isAggregate()).to.be.false;
  });

  it('should check if value is a model instance', () => {
    expect(isInstance).to.exist;
    expect(isInstance).to.be.a('function');
    expect(isInstance).to.have.length(1);

    expect(isInstance(new TestModel())).to.be.true;
    expect(isInstance('123')).to.be.false;
    expect(isInstance()).to.be.false;
  });

  it('should create sub schema', () => {
    const subSchema = createSubSchema({ name: { type: String } });

    expect(subSchema).to.exist;
    expect(isSchema(subSchema)).to.be.true;
    expect(subSchema.options._id).to.be.false;
    expect(subSchema.options.id).to.be.false;
    expect(subSchema.options.timestamps).to.be.false;
    expect(subSchema.options.emitIndexErrors).to.be.true;
  });

  it('should create schema', () => {
    const schema = createSchema({ name: { type: String } });

    expect(schema).to.exist;
    expect(isSchema(schema)).to.be.true;
    expect(schema.options._id).to.be.true;
    expect(schema.options.id).to.be.false;
    expect(schema.options.timestamps).to.be.true;
    expect(schema.options.emitIndexErrors).to.be.true;
  });

  it('should create schema with plugins', () => {
    const schema = createSchema({ name: { type: String } }, {}, (def) => {
      def.static('withTest', function withTest() {});
    });

    expect(schema).to.exist;
    expect(schema.base).to.exist;
    expect(isSchema(schema)).to.be.true;
    expect(schema.path('name')).to.exist;
    expect(schema.statics.withTest).to.exist.and.to.be.a('function');
  });

  it('should get registered model names', () => {
    const modelName = faker.random.uuid();
    model(modelName, new mongoose.Schema({ name: String }));

    expect(modelNames).to.exist;
    expect(modelNames).to.be.a('function');
    expect(modelNames).to.have.length(1);
    expect(modelNames()).to.include(modelName);
    expect(modelNames(mongoose.connection)).to.include(modelName);
    expect(modelNames(null)).to.include(modelName);
  });

  it('should get or register model silent', () => {
    expect(model).to.exist;
    expect(model).to.be.a('function');
    expect(model.length).to.be.equal(3);

    let User = model('User', new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    User = model('User');
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    User = model('User', mongoose.connection);
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    User = model('User', new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    User = model(
      'User',
      new mongoose.Schema({ name: String }),
      mongoose.connection
    );
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    const Profile = model('Profile');
    expect(Profile).to.not.exist;

    User = model(new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.exist;
    expect(User.modelName).to.not.be.equal('User');

    User = model(mongoose.connection, new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.exist;
    expect(User.modelName).to.not.be.equal('User');
  });

  it('should get collection name of registered model', () => {
    const modelName = 'Edge';
    const Edge = model(modelName, new mongoose.Schema({ name: String }));

    expect(collectionNameOf(modelName)).to.be.equal('edges');
    expect(collectionNameOf(Edge)).to.be.equal('edges');
  });

  it('should get collection name of non registered model', () => {
    expect(collectionNameOf('Pet')).to.be.equal('pets');
  });

  it('should delete models', () => {
    const modelName = faker.random.uuid();
    const User = createModel({ name: { type: String } }, { modelName });
    expect(User).to.exist;
    expect(User.modelName).to.exist.and.be.equal(modelName);
    expect(User.base).to.exist;

    deleteModels(User);
    expect(model(modelName)).to.not.exist;

    deleteModels(modelName);
    expect(model(modelName)).to.not.exist;

    deleteModels(mongoose.connection, modelName);
    expect(model(modelName)).to.not.exist;

    deleteModels();
    expect(model(modelName)).to.not.exist;

    deleteModels(mongoose.connection);
    expect(model(modelName)).to.not.exist;
  });

  it('should create model', () => {
    const modelName = faker.random.uuid();
    const User = createModel({ name: { type: String } }, { modelName });
    expect(User).to.exist;
    expect(User.modelName).to.exist.and.be.equal(modelName);
    expect(User.base).to.exist;
    // expect(User.path('name')).to.exist;
  });

  it('should create model with plugins', () => {
    const modelName = faker.random.uuid();
    const User = createModel(
      { name: { type: String } },
      { modelName },
      (def) => {
        def.static('withTest', function withTest() {});
      }
    );
    expect(User).to.exist;
    expect(User.modelName).to.exist.and.be.equal(modelName);
    expect(User.base).to.exist;
    // expect(User.path('name')).to.exist;
    expect(User.withTest).to.exist.and.to.be.a('function');
  });

  it('should connect successfully', (done) => {
    expect(connect).to.exist;
    expect(connect).to.be.a('function');
    expect(connect.length).to.be.equal(2);

    const mockoose = mock(mongoose);
    const open = mockoose.expects('connect').yields(null, mongoose);

    connect((error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.not.exist;
      expect(instance).to.exist;
      expect(open).to.have.been.calledOnce;
      expect(open).to.have.been.calledWith(
        'mongodb://localhost/mongoose-connection-test'
      );

      done(error, instance);
    });
  });

  it('should connect use given url', (done) => {
    const MONGODB_URI = 'mongodb://localhost/test';

    const mockoose = mock(mongoose);
    const open = mockoose.expects('connect').yields(null, mongoose);

    connect(MONGODB_URI, (error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.not.exist;
      expect(instance).to.exist;
      expect(open).to.have.been.calledOnce;
      expect(open).to.have.been.calledWith(MONGODB_URI);

      done(error, instance);
    });
  });

  it('should connect use process.env.MONGODB_URI', (done) => {
    const MONGODB_URI = 'mongodb://localhost/test';
    process.env.MONGODB_URI = MONGODB_URI;

    const mockoose = mock(mongoose);
    const open = mockoose.expects('connect').yields(null, mongoose);

    connect((error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.not.exist;
      expect(instance).to.exist;
      expect(open).to.have.been.calledOnce;
      expect(open).to.have.been.calledWith(MONGODB_URI);
      delete process.env.MONGODB_URI;

      done(error, instance);
    });
  });

  it('should handle connect error', (done) => {
    expect(connect).to.exist;
    expect(connect).to.be.a('function');
    expect(connect.length).to.be.equal(2);

    const mockoose = mock(mongoose);
    const open = mockoose.expects('connect').yields(new Error('Failed'));

    connect((error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.exist;
      expect(instance).to.not.exist;
      expect(open).to.have.been.calledOnce;
      expect(open).to.have.been.calledWith(
        'mongodb://localhost/mongoose-connection-test'
      );

      done();
    });
  });

  it('should disconnect successfully', (done) => {
    expect(disconnect).to.exist;
    expect(disconnect).to.be.a('function');
    expect(disconnect.length).to.be.equal(2);

    const mockoose = mock(mongoose);
    const close = mockoose.expects('disconnect').yields(null, null);

    disconnect((error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.not.exist;
      expect(instance).to.be.equal(null);
      expect(close).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should disconnect specific connection', (done) => {
    expect(disconnect).to.exist;
    expect(disconnect).to.be.a('function');
    expect(disconnect.length).to.be.equal(2);

    const mockoose = mock(mongoose.connection);
    const close = mockoose.expects('close').yields(null, null);

    disconnect(mongoose.connection, (error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.not.exist;
      expect(instance).to.be.equal(null);
      expect(close).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should handle disconnect error', (done) => {
    expect(disconnect).to.exist;
    expect(disconnect).to.be.a('function');
    expect(disconnect.length).to.be.equal(2);

    const mockoose = mock(mongoose);
    const close = mockoose.expects('disconnect').yields(new Error('Failed'));

    disconnect((error, instance) => {
      mockoose.verify();
      mockoose.restore();

      expect(error).to.exist;
      expect(instance).to.not.exist;
      expect(close).to.have.been.calledOnce;

      done();
    });
  });

  it('should clear default connection', (done) => {
    expect(clear).to.exist;
    expect(clear).to.be.a('function');

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const mockoose = mock(TestModel);
    const deleteMany = mockoose.expects('deleteMany').yields(null, null);

    clear(TestModel, (error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(deleteMany).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should clear error', (done) => {
    expect(clear).to.exist;
    expect(clear).to.be.a('function');

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const mockoose = mock(TestModel);
    const deleteMany = mockoose
      .expects('deleteMany')
      .yields(new Error('Failed'));

    clear(testModelName, (error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.exist;
      expect(instance).to.not.exist;
      expect(deleteMany).to.have.been.calledOnce;

      done();
    });
  });

  it('should not clear unknown model', (done) => {
    expect(clear).to.exist;
    expect(clear).to.be.a('function');

    const readyState = stub(mongoose.connection, 'readyState').value(1);

    clear('Unknown', (error, instance) => {
      readyState.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;

      done(error, instance);
    });
  });

  it('should sync indexes of default connection', (done) => {
    expect(syncIndexes).to.exist;
    expect(syncIndexes).to.be.a('function');

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const testModelNames = stub(mongoose.connection, 'modelNames').returns([
      testModelName,
    ]);
    const mockoose = mock(TestModel);
    const syncIndeces = mockoose.expects('syncIndexes').yields(null, null);

    syncIndexes((error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();
      testModelNames.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(syncIndeces).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should handle sync indexes error', (done) => {
    expect(syncIndexes).to.exist;
    expect(syncIndexes).to.be.a('function');

    const syncError = Error('NamespaceExists');
    syncError.codeName = 'NamespaceExists';

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const testModelNames = stub(mongoose.connection, 'modelNames').returns([
      testModelName,
    ]);
    const mockoose = mock(TestModel);
    const syncIndeces = mockoose.expects('syncIndexes').yields(syncError);
    const cleanIndeces = mockoose.expects('cleanIndexes').yields(null, null);
    const createIndeces = mockoose.expects('createIndexes').yields(null, null);

    syncIndexes((error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();
      testModelNames.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(syncIndeces).to.have.been.calledOnce;
      expect(cleanIndeces).to.have.been.calledOnce;
      expect(createIndeces).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should sync indexes of given connection', (done) => {
    expect(syncIndexes).to.exist;
    expect(syncIndexes).to.be.a('function');

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const testModelNames = stub(mongoose.connection, 'modelNames').returns([
      testModelName,
    ]);
    const mockoose = mock(TestModel);
    const syncIndeces = mockoose.expects('syncIndexes').yields(null, null);

    syncIndexes(mongoose.connection, (error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();
      testModelNames.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(syncIndeces).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should drop default connection', (done) => {
    expect(drop).to.exist;
    expect(drop).to.be.a('function');
    expect(drop.length).to.be.equal(2);

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const mockoose = mock(mongoose.connection);
    const dropDb = mockoose.expects('dropDatabase').yields(null, null);
    const close = mockoose.expects('close').yields(null, null);

    drop((error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(dropDb).to.have.been.calledOnce;
      expect(close).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should drop given connection', (done) => {
    expect(drop).to.exist;
    expect(drop).to.be.a('function');
    expect(drop.length).to.be.equal(2);

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const mockoose = mock(mongoose.connection);
    const dropDb = mockoose.expects('dropDatabase').yields(null, null);
    const close = mockoose.expects('close').yields(null, null);

    drop(mongoose.connection, (error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(dropDb).to.have.been.calledOnce;
      expect(close).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should not drop if connection not ready', (done) => {
    expect(drop).to.exist;
    expect(drop).to.be.a('function');
    expect(drop.length).to.be.equal(2);

    const readyState = stub(mongoose.connection, 'readyState').value(0);
    const mockoose = mock(mongoose.connection);
    const close = mockoose.expects('close').yields(null, null);

    drop((error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.not.exist;
      expect(instance).to.not.exist;
      expect(close).to.have.been.calledOnce;

      done(error, instance);
    });
  });

  it('should handle drop error', (done) => {
    expect(drop).to.exist;
    expect(drop).to.be.a('function');
    expect(drop.length).to.be.equal(2);

    const readyState = stub(mongoose.connection, 'readyState').value(1);
    const mockoose = mock(mongoose.connection);
    const dropDb = mockoose.expects('dropDatabase').yields(new Error('Failed'));

    drop((error, instance) => {
      mockoose.verify();
      mockoose.restore();
      readyState.restore();

      expect(error).to.exist;
      expect(instance).to.not.exist;
      expect(dropDb).to.have.been.calledOnce;

      done();
    });
  });
});
