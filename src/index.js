import { get, isNull, includes, isFunction, isString } from 'lodash';
import { sortedUniq } from '@lykmapipo/common';
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
 */
export const modelNames = (connection) => {
  // ensure connection
  const localConnection = isConnection(connection)
    ? connection
    : mongoose.connection;

  // obtain connection models
  const registeredModelNames = localConnection
    ? sortedUniq([].concat(localConnection.modelNames()))
    : [];

  // return
  return registeredModelNames;
};

/**
 * @function model
 * @name model
 * @description Obtain existing or register new model safely
 * @param {string} [modelName] valid model name
 * @param {object} [schema] valid schema instance
 * @param {object} [connection] valid database connection. If not provided
 * default connection will be used.
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
  // TODO: refactor modelNames(connection)?
  const modelExists = includes(localConnection.modelNames(), localModelName);

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