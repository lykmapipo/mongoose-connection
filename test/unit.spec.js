import { spy, expect, faker } from '@lykmapipo/test-helpers';
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
  model,
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

  it('should get registered model names', () => {
    const modelName = faker.random.uuid();
    model(modelName, new mongoose.Schema({ name: String }));

    expect(modelNames).to.exist;
    expect(modelNames).to.be.a('function');
    expect(modelNames).to.have.length(1);
    expect(modelNames()).to.include(modelName);
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

    User = model('User', new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.be.equal('User');

    const Profile = model('Profile');
    expect(Profile).to.not.exist;

    User = model(new mongoose.Schema({ name: String }));
    expect(User).to.exist;
    expect(User.modelName).to.exist;
    expect(User.modelName).to.not.be.equal('User');
  });
});
