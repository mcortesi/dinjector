'use strict';

var Immutable = require('immutable');

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
class AbstractType {

  constructor(name, requiredKeys = [], optionalKeys = [], defaultValues = {}) {
    this.name = name;
    this.requiredKeys = Immutable.Set.of('type').union(requiredKeys);
    this.optionalKeys = Immutable.Set.of('cache', 'arguments').union(optionalKeys);
    this.defaultValues = Immutable.Map({cache: false, arguments: []}).merge(defaultValues);
    this.possibleKeys = this.requiredKeys.union(this.optionalKeys);
  }

  /**
   * Validates a Mapping.
   *
   * @param {Immutable.Map} mapping - Object mapping to validate
   * @return {ValidationResult} the result of the validation
   */
  validate(mapping) {
    var mappingKeys = mapping.keySeq().toSet();
    var extraKeys = mappingKeys.subtract(this.possibleKeys);
    var missingKeys = this.requiredKeys.subtract(mappingKeys);

    return new ValidationResult(mapping, extraKeys, missingKeys);
  }

  /**
   * Preprocess a Mapping
   *
   * @params {Immutable.Map} mapping - Object mapping to preprocess
   * @return {Immutable.Map} preprocessed mapping
   */
  preprocess(mapping) {
    return this.defaultValues.merge(mapping);
  }

  /**
   * Creates an object using Mapping instructions
   *
   * @params {Immutable.Map} mapping - Object mapping to preprocess
   * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
   * @return {*} created object
   */
  createObject(mapping, resolveArgument) {
    var objectCreator = this._resolveObjectCreator(mapping);
    var args = this._resolveArguments(mapping, resolveArgument);
    return this._doCreateObject(objectCreator, args, mapping);
  }

  /**
   * Given a Mapping, resolve it's arguments using the configured argumentsResolver
   *
   * @instance
   * @params {Immutable.Map} mapping - Object mapping
   * @param {AbstractType~argumentsResolver} argumentsResolver - function to resolve arguments (dependencies)
   * @return {Array} the resolved arguments
   */
  _resolveArguments(mapping, resolveArgument) {
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
  _resolveObjectCreator(mapping) {
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
  _doCreateObject(objectCreator, args, mapping) {
    throw new Error('abstract method: unimplemented');
  }

}

module.exports = AbstractType;
