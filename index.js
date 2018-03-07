'use strict';


/**
 * @name connection
 * @description simplified mongoose connection setup.
 *              It will parse `MONGODB_URI` or `MONGODB_URL` to obtain connection
 *              options if non specified.
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 * @example
 * const mongoose = require('mongoose-connection');
 * 
 * mongoose.loadModels();
 *
 * mongoose.open([uri], [options], function(error){
 *   ...handle connection error
 * });
 */


//dependencies
const path = require('path');
const _ = require('lodash');
const parse = require('muri');
const build = require('mongo-uri-builder');
const load = require('require-all');
const mongoose = require('mongoose');


//setups
mongoose.Promise = mongoose.Promise ? mongoose.Promise : global.Promise;


/**
 * @name parseUri
 * @description parse specified mongodb uri string to object
 * @param  {String} [uri] valid mongodb uri
 * @return {Object} object representation of parsed mongodb uri
 * @see  {@link docs.mongodb.org/manual/reference/connection-string/}
 * @see  {@link https://github.com/aheckmann/muri}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
mongoose.parseUri = function (uri) {

  //ensure mongodb uri
  const defaultUri = (process.env.MONGODB_URI || process.env.MONGODB_URL);

  let mongodbUri = _.clone(uri || defaultUri);
  mongodbUri = parse(mongodbUri);

  return mongodbUri;

};


/**
 * @name buildUri
 * @description build mongodb uri from specified options
 * @param  {Object} [optns] valid mongodb uri builder options
 * @return {Object} object representation of parsed mongodb uri
 * @see  {@link docs.mongodb.org/manual/reference/connection-string/}
 * @see  {@link https://github.com/lmammino/mongo-uri-builder}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
mongoose.buildUri = function (optns) {

  //default options
  const defaults = {
    database: 'admin',
    host: '127.0.0.1',
    port: 27017,
    username: '',
    password: '',
    // replicas: [],
    // options: {}
  };

  //merge options
  const options = _.merge({}, defaults, optns);

  //build uri
  const mongodbUri = build(options);

  return mongodbUri;

};


/**
 * @name load
 * @description load mongoose models
 * @param  {Object} [optns] valid `require-all` options
 * @param  {String} [optns.cwd] current working directory. Default to `process.cwd()`
 * @param  {String|[String]} [optns.paths] model paths relative to current working directory
 * @param  {String|[String]} [optns.excludes] model paths relative exludes
 * @param  {String} [optns.suffix] model file suffix used to detect. Default to
 *                                 _model e.g user_model.js
 * @return {Object} object representation of parsed mongodb uri
 * @author lally elias <lallyelias87@mail.com>
 * @see  {@link https://github.com/felixge/node-require-all}
 * @since  0.1.0
 * @version 0.1.0
 */
mongoose.loadModels = function (optns) {

  //merge default options
  const defaults = {
    cwd: process.cwd(),
    path: [process.cwd()],
    exclude: ['node_modules'],
    suffix: '_model',
    recursive: true
  };
  const options = _.merge({}, optns);
  options.cwd = !_.isEmpty(options.cwd) ? options.cwd : defaults.cwd;
  options.path = _.uniq(_.compact(_.concat([], defaults.path, options.cwd,
    options.path)));
  options.exclude = _.uniq(_.compact(_.concat([], defaults.exclude,
    options.exclude)));
  options.suffix = !_.isEmpty(options.suffix) ? options.suffix : defaults
    .suffix;
  options.recursive = options.recursive || defaults.recursive;

  //load models recuresively
  const modules = _.map(options.path, function (modelsPath) {
    const loadOptions = {
      dirname: path.resolve(options.cwd, modelsPath),
      filter: new RegExp(`(.+${options.suffix})\.js`),
      excludeDirs: new RegExp(`^\.|${options.exclude.join('|^')}`),
      recursive: options.recursive
    };
    return load(loadOptions);
  });

  return _.filter(modules, function (modul) { return !_.isEmpty(modul); });

};


/**
 * @name open
 * @description create mongoose(mongodb connection)
 * @param  {String} [mongodbUri] valid mongodb uri
 * @param  {Object} [options] valid mongodb connection options
 * @param {Function} done a callback to invoke on success or failure
 * @return {Object} object representation of parsed mongodb uri
 * @see  {@link docs.mongodb.org/manual/reference/connection-string/}
 * @see  {@link http://mongoosejs.com/docs/connections.html}
 * @see {@link http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html}
 * @author lally elias <lallyelias87@mail.com>
 * @since  0.1.0
 * @version 0.1.0
 */
mongoose.open = function (mongodbUri, optns, done) {

  //normalize arguments
  const defaultUri = (process.env.MONGODB_URI || process.env.MONGODB_URL);
  let uri = _.clone(_.isString(mongodbUri) ? mongodbUri : defaultUri);

  //options
  let options = _.isPlainObject(mongodbUri) ? mongodbUri : {};
  options = _.isPlainObject(optns) ? optns : options;

  //callback
  let callback = _.isFunction(mongodbUri) ? mongodbUri : undefined;
  callback = _.isFunction(optns) ? optns : callback;
  callback = _.isFunction(done) ? done : callback;

  //default options
  const defaults = {
    keepAlive: true,
    autoReconnect: true,
    appname: 'mongoose'
  };

  //prepare connection options
  const parsed = !_.isEmpty(uri) ? mongoose.parseUri(uri) : {};
  options.options = _.merge({}, defaults, parsed.options, options.options);

  //try build uri from options
  if (_.isEmpty(uri)) {
    const uriOptions = _.merge({}, {
      database: parsed.database || options.database,
      host: options.host,
      port: options.port,
      username: ((parsed.auth || {}).user || options.username),
      password: ((parsed.auth || {}).pass || options.password),
      replicas: parsed.hosts,
      options: options.options
    }, options);
    uri = mongoose.buildUri(uriOptions);
  }

  //remember uri
  mongoose._uri = uri;

  return mongoose.createConnection(uri, options.options, callback);

};



module.exports = exports = mongoose;