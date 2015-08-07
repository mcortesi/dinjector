"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Immutable = require("immutable");
var _ = require("lodash");

var ValidationResult = require("../validation_result");

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
    var requiredKeys = arguments[1] === undefined ? [] : arguments[1];
    var optionalKeys = arguments[2] === undefined ? [] : arguments[2];
    var defaultValues = arguments[3] === undefined ? {} : arguments[3];
    _classCallCheck(this, AbstractType);

    this.name = name;
    this.requiredKeys = Immutable.Set.of("type", "name").union(requiredKeys);
    this.optionalKeys = Immutable.Set.of("cache", "arguments").union(optionalKeys);
    this.defaultValues = Immutable.Map({ cache: false, arguments: [] }).merge(defaultValues);
    this.possibleKeys = this.requiredKeys.union(this.optionalKeys);
  }

  _prototypeProperties(AbstractType, null, {
    validate: {

      /**
       * Validates a Mapping.
       *
       * @param {Immutable.Map} mapping - Object mapping to validate
       * @return {ValidationResult} the result of the validation
       */
      value: function validate(mapping) {
        var mappingKeys = mapping.keySeq().toSet();
        var extraKeys = mappingKeys.subtract(this.possibleKeys);
        var missingKeys = this.requiredKeys.subtract(mappingKeys);

        return new ValidationResult(mapping, extraKeys, missingKeys);
      },
      writable: true,
      configurable: true
    },
    preprocess: {

      /**
       * Preprocess a Mapping
       *
       * @params {Immutable.Map} mapping - Object mapping to preprocess
       * @return {Immutable.Map} preprocessed mapping
       */
      value: function preprocess(mapping) {
        return this.defaultValues.merge(mapping);
      },
      writable: true,
      configurable: true
    },
    createObject: {

      /**
       * Creates an object using Mapping instructions
       *
       * @params {Immutable.Map} mapping - Object mapping to preprocess
       * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
       * @return {*} created object
       */
      value: function createObject(mapping, resolveArgument) {
        try {
          var objectCreator = this._resolveObjectCreator(mapping);
          var args = this._resolveArguments(mapping, resolveArgument);
          var createdObject = this._doCreateObject(objectCreator, args, mapping);
          if (_.isObject(createdObject) && !_.isArray(createdObject)) {
            createdObject.__contextKey = mapping.get("name");
          }

          return createdObject;
        } catch (error) {
          console.error("Error while resolving mapping: " + mapping.name);
          console.error(error);
          throw error;
        }
      },
      writable: true,
      configurable: true
    },
    _resolveArguments: {

      /**
       * Given a Mapping, resolve it's arguments using the configured argumentsResolver
       *
       * @instance
       * @params {Immutable.Map} mapping - Object mapping
       * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
       * @return {Array} the resolved arguments
       */
      value: function _resolveArguments(mapping, resolveArgument) {
        return mapping.get("arguments").map(resolveArgument);
      },
      writable: true,
      configurable: true
    },
    _resolveObjectCreator: {

      /**
       * Given a Mapping, it returns the object|function|any to be used to create the final object.
       *
       * @instance
       * @abstract
       * @params {Immutable.Map} mapping - Object mapping
       * @return {*} something to be used to create the final object (typically an Object or Function)
       */
      value: function _resolveObjectCreator(mapping) {
        throw new Error("abstract method: unimplemented");
      },
      writable: true,
      configurable: true
    },
    _doCreateObject: {

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
      value: function _doCreateObject(objectCreator, args, mapping) {
        throw new Error("abstract method: unimplemented");
      },
      writable: true,
      configurable: true
    }
  });

  return AbstractType;
})();

module.exports = AbstractType;