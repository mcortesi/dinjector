'use strict';

var Immutable = require('immutable');
var AbstractRequireType = require("./abstract_require_type");

/**
 * Singleton Type
 *
 * Mapping type that creates objects based on an exported module's class.
 *
 * By default they are cached.
 */
class SingletonType extends AbstractRequireType {

  constructor(basePath) {
    super(basePath, 'singleton', [], [], {cache: true});
  }

  _doCreateObject(Class, args, mapping) {
    var instance = Object.create(Class.prototype);
    Class.apply(instance, args);
    return instance;
  }
}

module.exports = SingletonType;
