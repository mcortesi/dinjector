'use strict';

import AbstractRequireType from './abstract_require_type';

/**
 * Function Mapping Type
 *
 * Expect a function from a module or module's property and
 * calls it with the given arguments.
 */
class FunctionType extends AbstractRequireType {

  constructor(basePath) {
    super(basePath, 'function');
  }

  _doCreateObject(fn, args, mapping) {
    return fn.apply(null, args);
  }
}

module.exports = FunctionType;
