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

  reset(whiteList = []) {
    var oldCache = this.cache;
    this.cache = Immutable.Map();
    whiteList.forEach( (key) => {
      if (oldCache.has(key)) {
        this.cache = this.cache.set(key, oldCache.get(key));
      }
    });
  }

  set(key, object) {
    this.cache = this.cache.set(key, object);
  }

}

module.exports = TestContext;
