import {
  find,
  findLast,
  filter,
  forEach,
  get,
  isEmpty,
  isNull,
  includes,
  isFunction,
  isString,
  kebabCase,
  last,
  map,
  split,
  toLower,
  trim,
} from 'lodash';
import { waterfall, parallel } from 'async';
import {
  compact,
  mergeObjects,
  pkg,
  uniq,
  sortedUniq,
} from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import mongoose from 'mongoose';

/**
 * @name SCHEMA_OPTIONS
 * @constant SCHEMA_OPTIONS
 * @description Common options to set on schema
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { SCHEMA_OPTIONS } from '@lykmapipo/mongoose-connection';
 * //=> { timestamps: true, ... }
 */
export const SCHEMA_OPTIONS = {
  id: false,
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
  emitIndexErrors: true,
};

/**
 * @name SUB_SCHEMA_OPTIONS
 * @constant SUB_SCHEMA_OPTIONS
 * @description Common options to set on sub doc schema
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * import { SUB_SCHEMA_OPTIONS } from '@lykmapipo/mongoose-connection';
 * //=> { timestamps: false, ... }
 */
export const SUB_SCHEMA_OPTIONS = {
  _id: false,
  id: false,
  timestamps: false,
  emitIndexErrors: true,
};

/**
 * @function enableDebug
 * @name enableDebug
 * @description Enable internal debug option
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * enableDebug();
 */
export const enableDebug = () => {
  mongoose.set('debug', true);
};

/**
 * @function disableDebug
 * @name disableDebug
 * @description Disable internal debug option
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * disableDebug();
 */
export const disableDebug = () => {
  mongoose.set('debug', false);
};

/**
 * @function isConnection
 * @name isConnection
 * @description Check value is valid connection instance
 * @param {object} connection value to check
 * @returns {boolean} whether value is connection instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isConnection('a');
 * // => false
 *
 * isConnection(null);
 * // => false
 */
export const isConnection = (connection) => {
  return connection instanceof mongoose.Connection;
};

/**
 * @function isConnected
 * @name isConnected
 * @description Check value is valid connection instance and is connected
 * @param {object} connection value to check
 * @returns {boolean} whether value is connection instance and is connected
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isConnected('a');
 * // => false
 *
 * isConnected(null);
 * // => false
 */
export const isConnected = (connection) => {
  return isConnection(connection) && connection.readyState === 1;
};

/**
 * @function isSchema
 * @name isSchema
 * @description Check value is valid schema instance
 * @param {object} schema value to check
 * @returns {boolean} whether value is schema instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isSchema('a');
 * // => false
 *
 * isSchema(schema);
 * // => true
 */
export const isSchema = (schema) => {
  return schema instanceof mongoose.Schema;
};

/**
 * @function isModel
 * @name isModel
 * @description Check value is valid model
 * @param {object} model value to check
 * @returns {boolean} whether value is model instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isModel('a');
 * // => false
 *
 * isModel(model);
 * // => true
 */
export const isModel = (model) => {
  return !!model && model.prototype instanceof mongoose.Model;
};

/**
 * @function isQuery
 * @name isQuery
 * @description Check value is valid query instance
 * @param {object} query value to check
 * @returns {boolean} whether value is query instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isQuery('a');
 * // => false
 *
 * isQuery(query);
 * // => true
 */
export const isQuery = (query) => {
  return query instanceof mongoose.Query;
};

/**
 * @function isAggregate
 * @name isAggregate
 * @description Check value is valid aggregate instance
 * @param {object} aggregate value to check
 * @returns {boolean} whether value is aggregate instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isAggregate('a');
 * // => false
 *
 * isAggregate(aggregate);
 * // => true
 */
export const isAggregate = (aggregate) => {
  return aggregate instanceof mongoose.Aggregate;
};

/**
 * @function isInstance
 * @name isInstance
 * @description Check value is valid model instance
 * @param {object} instance value to check
 * @returns {boolean} whether value is model instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * isInstance('a');
 * // => false
 *
 * isInstance(instance);
 * // => true
 */
export const isInstance = (instance) => {
  if (instance) {
    const isValidInstance =
      isFunction(get(instance, 'toObject', null)) &&
      !isNull(get(instance, '$__', null));
    return isValidInstance;
  }
  return false;
};

/**
 * @function modelNames
 * @name modelNames
 * @description Obtain registered model names
 * @param {object} [connection] valid connection
 * @returns {string[]} set of register model names
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * modelNames();
 * //=> ['User', ... ]
 *
 * modelNames(connection);
 * //=> ['User', ... ]
 */
export const modelNames = (connection) => {
  // ensure connection
  const localConnection = isConnection(connection)
    ? connection
    : mongoose.connection;

  // obtain connection models
  const registeredModelNames = sortedUniq(
    [].concat(localConnection.modelNames())
  );

  // return
  return registeredModelNames;
};

/**
 * @function createSubSchema
 * @name createSubSchema
 * @description Create sub schema with sensible defaults
 * @param {object} definition valid sub schema definition
 * @param {object} [optns] valid schema options
 * @returns {object} valid sub schema instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * createSubSchema({ name: { type: String } });
 * // => Schema{ ... }
 *
 * createSubSchema({ name: { type: String } }, { timestamps: true });
 * // => Schema{ ... }
 */
export const createSubSchema = (definition, optns) => {
  // ensure sub schema definition
  const schemaDefinition = mergeObjects(definition);

  // ensure sub schema options
  const schemaOptions = mergeObjects(SUB_SCHEMA_OPTIONS, optns);

  // create sub schema
  const subSchema = new mongoose.Schema(schemaDefinition, schemaOptions);

  // return created sub schema
  return subSchema;
};

/**
 * @function createSchema
 * @name createSchema
 * @description Create schema with sensible default options and plugins
 * @param {object} definition valid model schema definition
 * @param {object} [optns] valid schema options
 * @param {...Function} [plugins] valid plugins to apply
 * @returns {object} valid schema instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * createSchema({ name: { type: String } });
 * // => Schema{ ... }
 *
 * createSchema({ name: { type: String } }, { timestamps: false });
 * // => Schema{ ... }
 */
export const createSchema = (definition, optns, ...plugins) => {
  // ensure schema definition
  const schemaDefinition = mergeObjects(definition);

  // ensure schema options
  const schemaOptions = mergeObjects(SCHEMA_OPTIONS, optns);

  // create schema
  const schema = new mongoose.Schema(schemaDefinition, schemaOptions);

  // apply schema plugins with model options
  // TODO: plugin jsonSchema, error, seed, path
  forEach([...plugins], (plugin) => {
    schema.plugin(plugin, schemaOptions);
  });

  // return created schema
  return schema;
};

/**
 * @function model
 * @name model
 * @description Obtain existing or register new model safely
 * @param {string} [modelName] valid model name
 * @param {object} [schema] valid schema instance
 * @param {object} [connection] valid database connection or default
 * @returns {object|undefined} model or undefined
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * model('User');
 * // => User{ ... }
 *
 * model('User', schema);
 * // => User{ ... }
 *
 * model(null)
 * //=> undefined
 */
export const model = (modelName, schema, connection) => {
  // obtain modelName or random name
  let localModelName = new mongoose.Types.ObjectId().toString();
  localModelName = isString(modelName) ? modelName : localModelName;

  // obtain schema
  const localSchema = isSchema(modelName) ? modelName : schema;

  // ensure connection or use default connection
  // TODO: refactor getConnection
  let localConnection = isConnection(modelName) ? modelName : schema;
  localConnection = isConnection(localConnection)
    ? localConnection
    : connection;
  localConnection = isConnection(localConnection)
    ? localConnection
    : mongoose.connection;

  // check if modelName already registered
  const localModelNames = modelNames(localConnection);
  const modelExists = includes(localModelNames, localModelName);

  // try obtain model or new register model
  try {
    const foundModel = modelExists
      ? localConnection.model(localModelName)
      : localConnection.model(localModelName, localSchema);
    return foundModel;
  } catch (error) {
    // catch error & return no model
    return undefined;
  }
};

/**
 * @function deleteModels
 * @name deleteModels
 * @description Safe delete given models
 * @param {object} [connection] valid connection or default
 * @param {...string} [models] models or model names to remove
 * @returns {object} model connection or default
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * deleteModels('User', 'Invoice');
 * //=> delete given models
 *
 * deleteModels(User, Invoice);
 * //=> delete given models
 *
 * deleteModels();
 * //=> remove all models
 */

export const deleteModels = (connection, ...models) => {
  // ensure connection
  let localConnection = find([connection, ...models], (modelName) => {
    return isConnection(modelName);
  });
  localConnection = localConnection || mongoose.connection;

  // ensure valid model names
  let localModelNames = filter([connection, ...models], (modelName) => {
    return isString(modelName) || isModel(modelName);
  });
  localModelNames = uniq([...localModelNames]);

  // use all models is non provided
  if (isEmpty(localModelNames)) {
    localModelNames = uniq([
      ...localModelNames,
      ...modelNames(localConnection),
    ]);
  }

  // delete each model safely
  forEach(localModelNames, (modelName) => {
    // ensure model name if model provided
    const localModelName = isModel(modelName) ? modelName.modelName : modelName;

    // delete model safely
    try {
      localConnection.deleteModel(localModelName);
    } catch (error) {
      /* ignore */
    }
  });

  // return connection
  return localConnection;
};

/**
 * @function createModel
 * @name createModel
 * @description Create schema with sensible default options and plugins
 * @param {object} schema valid model schema definition
 * @param {object} options valid model schema options
 * @param {string} options.modelName valid model name
 * @param {object} [connection] valid connection or default
 * @param {...Function} [plugins] list of valid plugins to apply
 * @returns {object} valid model instance
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * createModel({ name: { type: String } }, { modelName: 'User' });
 * // => User{ ... }
 *
 * createModel({ name: { type: String } }, { modelName: 'User' }, autopopulate);
 * // => User{ ... }
 */
export const createModel = (schema, options, connection, ...plugins) => {
  // ensure model schema definition
  const schemaDefinition = mergeObjects(schema);

  // ensure model options with defaults
  const modelOptions = mergeObjects(options, SCHEMA_OPTIONS);

  // obtain connection if provided
  const localConnection = find([connection, ...plugins], (plugin) => {
    return isConnection(plugin);
  });

  // ensure valid plugins
  const allowedPlugins = compact(
    filter([connection, ...plugins], (plugin) => {
      return !isConnection(plugin);
    })
  );

  // create model schema
  const modelSchema = createSchema(
    schemaDefinition,
    modelOptions,
    ...allowedPlugins // TODO: plugin common global plugins
  );

  // register model
  const { modelName } = modelOptions;
  const registeredModel = model(modelName, modelSchema, localConnection);

  // return registered model
  return registeredModel;
};

// TODO return default connection
// TODO return created connection
// TODO create new connection

/**
 * @function connect
 * @name connect
 * @description Open default mongoose connection
 * @param {string} [url] valid connection string. If not provided it
 * will be obtained from process.env.MONGODB_URI or package name prefixed with
 * current execution environment name
 * @param {Function} [done] a callback to invoke on success or failure
 * @returns {object|Error} mongoose instance or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * connect((error) => { ... });
 *
 * connect(url, (error) => { ... });
 */
export const connect = (url, done) => {
  // obtain current node runtime environment
  const NODE_ENV = getString('NODE_ENV', 'development');

  // ensure database name using environment and package
  let DB_NAME = NODE_ENV;
  try {
    DB_NAME = get(pkg(), 'name', NODE_ENV);
    DB_NAME = toLower(last(split(DB_NAME, '/')));
    DB_NAME = DB_NAME === NODE_ENV ? DB_NAME : `${DB_NAME} ${NODE_ENV}`;
    DB_NAME = kebabCase(DB_NAME);
  } catch (error) {
    /* ignore */
  }
  DB_NAME = `mongodb://localhost/${DB_NAME}`;

  // ensure database uri from environment
  const MONGODB_URI = trim(getString('MONGODB_URI', DB_NAME));

  // normalize arguments
  let uri = isFunction(url) ? MONGODB_URI : url;
  const cb = isFunction(url) ? url : done;

  // connection options
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  // establish connection
  uri = trim(uri);
  return mongoose.connect(uri, options, cb);
};

/**
 * @function disconnect
 * @name disconnect
 * @description Close all connections
 * @param {object} [connection] valid connection or default
 * @param {Function} [done] a callback to invoke on success or failure
 * @returns {null|Error} null or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * disconnect((error) => { ... });
 *
 */
export const disconnect = (connection, done) => {
  // normalize arguments
  const localConnection = isConnection(connection) ? connection : undefined;
  const cb = !isConnection(connection) ? connection : done;

  // disconnect
  if (localConnection) {
    return localConnection.close(cb);
  }
  return mongoose.disconnect(cb);
};

/**
 * @function clear
 * @name clear
 * @description Clear provided models or all if none give
 * @param {object} [connection] valid connection or default
 * @param {...string} [models] model names to remove or default to all
 * @returns {null|Error} null or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * clear(done);
 * clear('User', done);
 * clear('User', 'Profile', done);
 *
 * clear(connection, done);
 * clear(connection, 'User', done);
 *
 */
export const clear = (connection, ...models) => {
  // ensure connection
  let localConnection = find([connection, ...models], (modelName) => {
    return isConnection(modelName);
  });
  localConnection = localConnection || mongoose.connection;

  // ensure callback
  const cb = findLast([connection, ...models], (modelName) => {
    return isFunction(modelName);
  });

  // ensure valid model names
  // TODO: preserve model clear order
  // TODO: prevent double clear from model instance & modelName
  let localModelNames = filter([connection, ...models], (modelName) => {
    return isString(modelName) || isModel(modelName);
  });
  localModelNames = uniq([...localModelNames]);

  // use all models is non provided
  if (isEmpty(localModelNames)) {
    localModelNames = uniq([
      ...localModelNames,
      ...modelNames(localConnection),
    ]);
  }

  // ensure connection
  const connected = isConnected(localConnection);

  // clear model
  const clearModel = (modelName) => {
    // obtain model
    const Model = isModel(modelName)
      ? modelName
      : model(modelName, localConnection);

    // prepare cleaner
    if (connected && Model && isFunction(Model.deleteMany)) {
      const clearModelData = (next) => {
        return Model.deleteMany((error) => {
          return next(error);
        });
      };
      return clearModelData;
    }

    // do nothing
    return undefined;
  };

  // map modelNames to Model.deleteMany
  let deletes = map([...localModelNames], clearModel);
  deletes = compact([...deletes]);

  // run deletes
  return waterfall(deletes, cb);
};

/**
 * @function syncIndexes
 * @name syncIndexes
 * @description Sync indexes in MongoDB to match, indexes defined in schemas
 * @param {object} [connection] valid connection or default
 * @param {Function} done a callback to invoke on success or failure
 * @returns {null|Error} null or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * syncIndexes(done);
 *
 * syncIndexes(connection, done);
 *
 */
export const syncIndexes = (connection, done) => {
  // normalize arguments
  const localConnection = isConnection(connection)
    ? connection
    : mongoose.connection;
  const cb = !isConnection(connection) ? connection : done;

  // ensure connected before sync
  const canSync = isConnected(localConnection);
  if (!canSync) {
    return cb();
  }

  // re-run syn index safely
  const cleanIndexesOf = (Model, next) => {
    return Model.cleanIndexes((error) => next(error));
  };
  const createIndexesOf = (Model, next) => {
    return Model.createIndexes((error) => next(error));
  };
  const safeSyncIndexesOf = (Model, next) => {
    return waterfall(
      [
        (then) => cleanIndexesOf(Model, then),
        (then) => createIndexesOf(Model, then),
      ],
      next
    );
  };

  // safe sync indexes of a given model
  const syncIndexesOf = (Model) => (next) => {
    const canModelSync = Model && isFunction(Model.syncIndexes);
    if (canModelSync) {
      return Model.syncIndexes({}, (error) => {
        // handle collection exists
        if (error && error.codeName === 'NamespaceExists') {
          return safeSyncIndexesOf(Model, next);
        }
        // otherwise unknown error
        return next(error);
      });
    }
    return undefined;
  };

  // obtain available connection models
  const localModelNames = modelNames(localConnection);
  const Models = map(localModelNames, (modelName) => {
    return model(modelName);
  });

  // build indexes sync tasks
  let syncs = map(Models, (Model) => {
    return syncIndexesOf(Model);
  });

  // do syncing
  syncs = compact([...syncs]);
  return parallel(syncs, (error) => cb(error));
};

/**
 * @function drop
 * @name drop
 * @description Delete the given database, including all collections,
 * documents, and indexes
 * @param {object} [connection] valid connection or default
 * @param {Function} [done] a callback to invoke on success or failure
 * @returns {null|Error} null or error
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.2.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * drop((error) => { ... });
 *
 */
export const drop = (connection, done) => {
  // normalize arguments
  const localConnection = isConnection(connection)
    ? connection
    : mongoose.connection;
  const cb = !isConnection(connection) ? connection : done;

  // drop database if connection available
  let canDrop = isConnected(localConnection);
  canDrop = canDrop && localConnection.dropDatabase;
  if (canDrop) {
    const afterDropDatabase = (error) => {
      // back-off on error
      if (error) {
        return cb(error);
      }
      // disconnect
      return disconnect(localConnection, cb);
    };
    return localConnection.dropDatabase(afterDropDatabase);
  }

  // continue to disconnect
  return disconnect(localConnection, cb);
};
