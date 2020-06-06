import { get, isNull, isFunction } from 'lodash';
import mongoose from 'mongoose';

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
