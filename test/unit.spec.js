import { spy, expect, faker } from '@lykmapipo/test-helpers';
import mongoose from 'mongoose';

import {
  enableDebug,
  disableDebug,
  isConnection,
  isConnected,
  isSchema,
  isModel,
  isQuery,
  isAggregate,
} from '../src/index';

describe('unit', () => {
  let testModelName;
  let testSchema;
  let testModel;
  let testQuery;
  let testAggregate;

  beforeEach(() => {
    testModelName = faker.random.uuid();
    testSchema = new mongoose.Schema({ name: String });
    testModel = mongoose.model(testModelName, testSchema);
    testQuery = testModel.find();
    testAggregate = testModel.aggregate();
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

  it('should enable mongoose degugging', () => {
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
  });

  it('should check if connected', () => {
    expect(isConnected).to.exist;
    expect(isConnected).to.be.a('function');
    expect(isConnected).to.have.length(1);

    expect(isConnected()).to.be.false;
    expect(isConnected(new mongoose.Connection())).to.be.false;
    expect(isConnected('123')).to.be.false;
  });

  it('should check if value is Schema', () => {
    expect(isSchema).to.exist;
    expect(isSchema).to.be.a('function');
    expect(isSchema).to.have.length(1);

    expect(isSchema(testSchema)).to.be.true;
    expect(isSchema('123')).to.be.false;
  });

  it('should check if value is Model', () => {
    expect(isModel).to.exist;
    expect(isModel).to.be.a('function');
    expect(isModel).to.have.length(1);

    expect(isModel(testModel)).to.be.true;
    expect(isModel(testSchema)).to.be.false;
    expect(isModel('123')).to.be.false;
  });

  it('should check if value is Query', () => {
    expect(isQuery).to.exist;
    expect(isQuery).to.be.a('function');
    expect(isQuery).to.have.length(1);

    expect(isQuery(testQuery)).to.be.true;
    expect(isQuery('124')).to.be.false;
  });

  it('should check if value is Aggregate', () => {
    expect(isAggregate).to.exist;
    expect(isAggregate).to.be.a('function');
    expect(isAggregate).to.have.length(1);

    expect(isAggregate(testAggregate)).to.be.true;
    expect(isAggregate('124')).to.be.false;
  });
});
