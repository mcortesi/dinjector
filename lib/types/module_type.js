'use strict';

import AbstractRequireType from './abstract_require_type';

/**
 * Module Mapping Type
 *
 * Resolves to a module or module's property
 */
class ModuleType extends AbstractRequireType {

  constructor(basePath) {
    super(basePath, 'module', [], [], {cache: true});
  }

  _doCreateObject(objectCreator, args, mapping) {
    return objectCreator;
  }
}


module.exports = ModuleType;
