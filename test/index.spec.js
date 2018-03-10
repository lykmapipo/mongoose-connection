'use strict';


//ensure test environment
process.env.NODE_ENV = 'test';


//dependencies
const path = require('path');
const expect = require('chai').expect;
const mongoose = require(path.join(__dirname, '..'));


describe('parse', function () {

  afterEach(function (done) {
    if (mongoose.connection) {
      mongoose.connection.close(done);
    } else {
      done();
    }
  });

  it('should be a function', function () {
    expect(mongoose.parseUri).to.exist;
    expect(mongoose.parseUri).to.be.a('function');
    expect(mongoose.parseUri.length).to.be.equal(1);
  });

  it('should be able to parse provided mongodb uri', function () {
    const uri = 'mongodb://localhost/test';

    const details = mongoose.parseUri(uri);

    expect(details).to.exist;
    expect(details).to.be.an('object');
    expect(details.db).to.exist;
    expect(details.options).to.exist;
    expect(details.hosts).to.exist;
    expect(details.db).to.be.equal('test');
    expect(details.options).to.be.empty;
    expect(details.hosts).to.have.length(1);

  });

  it('should be able to parse provided mongodb uri', function () {
    const uri = 'mongodb://test:test@127.0.0.1:27190/test';

    const details = mongoose.parseUri(uri);

    expect(details).to.exist;
    expect(details).to.be.an('object');
    expect(details.db).to.exist;
    expect(details.options).to.exist;
    expect(details.hosts).to.exist;
    expect(details.auth).to.exist;
    expect(details.db).to.be.equal('test');
    expect(details.options).to.be.empty;
    expect(details.hosts).to.have.length(1);
    expect(details.auth.user).to.be.equal('test');
    expect(details.auth.pass).to.be.equal('test');

  });

  it('should be able to parse provided mongodb uri', function () {
    const uri =
      'mongodb://test:test@127.0.0.1:27190/test?preplicaSet=test&connectTimeoutMS=300000';

    const details = mongoose.parseUri(uri);

    expect(details).to.exist;
    expect(details).to.be.an('object');
    expect(details.db).to.exist;
    expect(details.options).to.exist;
    expect(details.hosts).to.exist;
    expect(details.auth).to.exist;
    expect(details.db).to.be.equal('test');
    expect(details.options.preplicaSet).to.be.equal('test');
    expect(details.options.connectTimeoutMS)
      .to.be.equal(300000);
    expect(details.hosts).to.have.length(1);
    expect(details.auth.user).to.be.equal('test');
    expect(details.auth.pass).to.be.equal('test');

  });

  it('should be able to parse provided mongodb uri', function () {
    process.env.MONGODB_URI = 'mongodb://localhost/test';

    const details = mongoose.parseUri();

    expect(details).to.exist;
    expect(details).to.be.an('object');
    expect(details.db).to.exist;
    expect(details.options).to.exist;
    expect(details.hosts).to.exist;
    expect(details.db).to.be.equal('test');
    expect(details.options).to.be.empty;
    expect(details.hosts).to.have.length(1);
    delete process.env.MONGODB_URI;

  });


  it('should be able to parse provided mongodb uri', function () {
    process.env.MONGODB_URL = 'mongodb://localhost/test';

    const details = mongoose.parseUri();

    expect(details).to.exist;
    expect(details).to.be.an('object');
    expect(details.db).to.exist;
    expect(details.options).to.exist;
    expect(details.hosts).to.exist;
    expect(details.db).to.be.equal('test');
    expect(details.options).to.be.empty;
    expect(details.hosts).to.have.length(1);
    delete process.env.MONGODB_URL;

  });

});


describe('loadModels', function () {

  it('should be a function', function () {
    expect(mongoose.loadModels).to.exist;
    expect(mongoose.loadModels).to.be.a('function');
    expect(mongoose.loadModels.length).to.be.equal(1);
  });

  it('should be able to load models', function () {
    const models = mongoose.loadModels({ cwd: __dirname, path: './fixtures' });
    expect(models).to.exist;
    expect(models).to.have.length(1);
  });

});


describe('uri builder', function () {

  it('should be a function', function () {
    expect(mongoose.buildUri).to.exist;
    expect(mongoose.buildUri).to.be.a('function');
    expect(mongoose.buildUri.length).to.be.equal(1);
  });

  it('should be able to build default uri', function () {
    const uri = mongoose.buildUri();
    expect(uri).to.exist;
    expect(uri).to.equal('mongodb://127.0.0.1:27017/admin');
  });

  it('should be able to build uri from options', function () {
    const uri = mongoose.buildUri({ database: 'test' });
    expect(uri).to.exist;
    expect(uri).to.equal('mongodb://127.0.0.1:27017/test');
  });

  it('should be able to build uri from options', function () {
    const uri = mongoose.buildUri({ host: 'localhost', database: 'test' });
    expect(uri).to.exist;
    expect(uri).to.equal('mongodb://localhost:27017/test');
  });

  it('should be able to build uri from options', function () {
    const uri = mongoose.buildUri({ username: 'user', password: 'pass' });
    expect(uri).to.exist;
    expect(uri).to.equal('mongodb://user:pass@127.0.0.1:27017/admin');
  });

  it('should be able to build uri from options', function () {
    const uri = mongoose.buildUri({
      username: 'user',
      password: 'pass',
      host: 'localhost',
      port: 37017,
      database: 'test'
    });
    expect(uri).to.exist;
    expect(uri).to.equal('mongodb://user:pass@localhost:37017/test');
  });

});


describe('open', function () {

  it('should be a function', function () {
    expect(mongoose.open).to.exist;
    expect(mongoose.open).to.be.a('function');
    expect(mongoose.open.length).to.be.equal(3);
  });


  it('should be able to establish without options', function () {
    const connection = mongoose.open();
    expect(mongoose._uri).to.exist;
    expect(mongoose._uri)
      .to.equal(
        'mongodb://127.0.0.1:27017/admin?keepAlive=true&autoReconnect=true&appname=mongoose'
      );
    expect(connection.constructor.name).to.be.equal('NativeConnection');
    expect(connection.host).to.be.equal('127.0.0.1');
    expect(connection.port).to.be.equal(27017);
    expect(connection.name).to.be.equal('admin');
  });

  it('should be able to establish without uri', function () {
    const connection = mongoose.open('mongodb://127.0.0.1:27017/test');
    expect(mongoose._uri).to.exist;
    expect(mongoose._uri)
      .to.equal(
        'mongodb://127.0.0.1:27017/test'
      );
    expect(connection.constructor.name).to.be.equal('NativeConnection');
    expect(connection.host).to.be.equal('127.0.0.1');
    expect(connection.port).to.be.equal(27017);
    expect(connection.name).to.be.equal('test');
  });

  it('should be able to establish without options', function () {
    const connection = mongoose.open({
      username: 'user',
      password: 'pass',
      host: 'localhost',
      port: 37017,
      database: 'test'
    });
    expect(mongoose._uri).to.exist;
    expect(mongoose._uri)
      .to.equal(
        'mongodb://user:pass@localhost:37017/test?keepAlive=true&autoReconnect=true&appname=mongoose'
      );
    expect(connection.constructor.name).to.be.equal('NativeConnection');
    expect(connection.host).to.be.equal('localhost');
    expect(connection.port).to.be.equal(37017);
    expect(connection.name).to.be.equal('test');
  });

  it('should be able to connect use MONGODB_URI', function () {
    process.env.MONGODB_URI = 'mongodb://localhost/test';

    const connection = mongoose.open('mongodb://127.0.0.1:27017/test');
    expect(mongoose._uri).to.exist;
    expect(mongoose._uri)
      .to.equal(
        'mongodb://127.0.0.1:27017/test'
      );
    expect(connection.constructor.name).to.be.equal('NativeConnection');
    expect(connection.host).to.be.equal('127.0.0.1');
    expect(connection.port).to.be.equal(27017);
    expect(connection.name).to.be.equal('test');
    delete process.env.MONGODB_URI;

  });

  it('should be able to connect use MONGODB_URL', function () {
    process.env.MONGODB_URL = 'mongodb://localhost/test';

    const connection = mongoose.open('mongodb://127.0.0.1:27017/test');
    expect(mongoose._uri).to.exist;
    expect(mongoose._uri)
      .to.equal(
        'mongodb://127.0.0.1:27017/test'
      );
    expect(connection.constructor.name).to.be.equal('NativeConnection');
    expect(connection.host).to.be.equal('127.0.0.1');
    expect(connection.port).to.be.equal(27017);
    expect(connection.name).to.be.equal('test');
    delete process.env.MONGODB_URL;

  });

});