'use strict';

var Immutable = require('immutable');
var AbstractType = require('./abstract_type');

/**
 * Inline Mapping Type
 *
 * Expects 'createFn' to be defined (and be a function),
 * and calls it with the resolved arguments.
 */
class InlineType extends AbstractType {

  constructor() {
    super('inline', ['createFn']);
  }

  _resolveObjectCreator(mapping) {
    return mapping.get('createFn');
  }

  _doCreateObject(fn, args, mapping) {
    return fn.apply(null, args);
  }
  
}

module.exports = InlineType;
