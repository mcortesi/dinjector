'use strict';

var Immutable = require('immutable');
var AbstractType = require('./abstract_type');
var _ = require('lodash');

/**
 * Abstract Mapping type with require() support.
 *
 * It handles the _resolveObjectCreator() method by
 * doing a require() to a given path.
 *
 * It supports absolute path and relative paths. Relative paths are prefixed by the given basePath
 * in the constructor.
 *
 * If mapping has a property key, it uses it to retrieve such property from the require result.
 *
 * Additional Keys:
 *  - path: [required] - path to the module to require
 *  - property: [optional] - name of the module's property to return
 */
class AbstractRequireType extends AbstractType {

  constructor(basePath, name, requiredKeys = [], optionalKeys = [], defaultValues = {}) {
    super(
      name,
      Immutable.Set.of('path').union(requiredKeys),
      Immutable.Set.of('property').union(requiredKeys),
      defaultValues
    );
    this.basePath = basePath;
  }

  _resolveObjectCreator(mapping) {
    var keyObject;

    var requirePath;
    if (_.startsWith(mapping.get('path'), '/')) {
      requirePath = this.basePath + mapping.get('path');
    } else {
      requirePath = mapping.get('path');
    }

    var moduleObj = require(requirePath);

    if (mapping.has('property')) {
      keyObject = moduleObj[mapping.get('property')];
    } else {
      keyObject = moduleObj;
    }
    return keyObject;
  }
}

module.exports = AbstractRequireType;
