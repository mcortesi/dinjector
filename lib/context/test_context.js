'use strict';

var Immutable = require('immutable');
var AppContext = require('./app_context');

/**
 * Application Context for tests.
 *
 * It adds support to reset the context
 * and to override a definition.
 */
class TestContext extends AppContext {
  constructor(mappings, mappingTypes, argumentResolvers = []) {
    super(mappings, mappingTypes, argumentResolvers);
  }

  reset() {
    this.cache = Immutable.Map();
  }

  set(key, object) {
    if (this.mappings.has(key)) {
      this.cache = this.cache.set(key, object);
    } else {
      throw new Error(`Configuration for ${key} is not defined`);
    }
  }

}

module.exports = TestContext;
