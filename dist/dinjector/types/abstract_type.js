'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validation_result = require("../validation_result");

var _validation_result2 = _interopRequireDefault(_validation_result);

/**
 * @callback AbstractType~argumentsResolver
 * @params {string|Object|Array} key - specifies the argument
 * @returns {*} the resolved argument
 */

/**
 * Abstract Mapping Type.
 *
 * Base class for all Mapping Types. It's not supposed to be instantiated, but subclassed.
 *
 * Supports public methods of:
 *  - validate(mapping)
 *  - parse(mapping)
 *  - resolve(mapping) - to be implemented by subclasses
 *
 * @class AbstractType
 * @member {string} name
 * @member {Immutable.Set.<string>} requiredKeys - The set of required keys
 * @member {Immutable.Set.<string>} optionalKeys - The set of optional keys
 * @member {Immutable.Set.<string>} possibleKeys - The set of possible keys
 * @member {Immutable.Map.<string, object>} defaultValues - A map with default values for Mappings
 */

var AbstractType = (function () {
  function AbstractType(name) {
    var requiredKeys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var optionalKeys = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    var defaultValues = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, AbstractType);

    this.name = name;
    this.requiredKeys = _immutable2['default'].Set.of('type', 'name').union(requiredKeys);
    this.optionalKeys = _immutable2['default'].Set.of('cache', 'arguments', 'tags').union(optionalKeys);
    this.defaultValues = _immutable2['default'].Map({ cache: false, arguments: [] }).merge(defaultValues);
    this.possibleKeys = this.requiredKeys.union(this.optionalKeys);
  }

  /**
   * Validates a Mapping.
   *
   * @param {Immutable.Map} mapping - Object mapping to validate
   * @return {ValidationResult} the result of the validation
   */

  _createClass(AbstractType, [{
    key: 'validate',
    value: function validate(mapping) {
      var mappingKeys = mapping.keySeq().toSet();
      var extraKeys = mappingKeys.subtract(this.possibleKeys);
      var missingKeys = this.requiredKeys.subtract(mappingKeys);

      return new _validation_result2['default'](mapping, extraKeys, missingKeys);
    }

    /**
     * Preprocess a Mapping
     *
     * @params {Immutable.Map} mapping - Object mapping to preprocess
     * @return {Immutable.Map} preprocessed mapping
     */
  }, {
    key: 'preprocess',
    value: function preprocess(mapping) {
      return this.defaultValues.merge(mapping);
    }

    /**
     * Creates an object using Mapping instructions
     *
     * @params {Immutable.Map} mapping - Object mapping to preprocess
     * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
     * @return {*} created object
     */
  }, {
    key: 'createObject',
    value: function createObject(mapping, resolveArgument) {
      try {
        var objectCreator = this._resolveObjectCreator(mapping);
        var args = this._resolveArguments(mapping, resolveArgument);
        var createdObject = this._doCreateObject(objectCreator, args, mapping);
        if (_lodash2['default'].isObject(createdObject) && !_lodash2['default'].isArray(createdObject)) {
          createdObject.__contextKey = mapping.get('name');
        }

        return createdObject;
      } catch (error) {
        console.error('Error while resolving mapping: ' + mapping.name);
        console.error(error);
        throw error;
      }
    }

    /**
     * Given a Mapping, resolve it's arguments using the configured argumentsResolver
     *
     * @instance
     * @params {Immutable.Map} mapping - Object mapping
     * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
     * @return {Array} the resolved arguments
     */
  }, {
    key: '_resolveArguments',
    value: function _resolveArguments(mapping, resolveArgument) {
      return mapping.get('arguments').map(resolveArgument);
    }

    /**
     * Given a Mapping, it returns the object|function|any to be used to create the final object.
     *
     * @instance
     * @abstract
     * @params {Immutable.Map} mapping - Object mapping
     * @return {*} something to be used to create the final object (typically an Object or Function)
     */
  }, {
    key: '_resolveObjectCreator',
    value: function _resolveObjectCreator(mapping) {
      throw new Error('abstract method: unimplemented');
    }

    /**
     * Given the object creator and the resolved arguments, creates the final object.
     *
     * @instance
     * @abstract
     * @params {*} objectCreator - what's to be used to create the final object
     * @params {Array} args - array of resolved arguments
     * @params {Immutable.Map} mapping - Object mapping
     * @return {*} the created object
     */
  }, {
    key: '_doCreateObject',
    value: function _doCreateObject(objectCreator, args, mapping) {
      throw new Error('abstract method: unimplemented');
    }
  }]);

  return AbstractType;
})();

module.exports = AbstractType;
