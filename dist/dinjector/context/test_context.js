"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Immutable = require("immutable");
var AppContext = require("./app_context");

/**
 * Application Context for tests.
 *
 * It adds support to reset the context
 * and to override a definition.
 */
var TestContext = (function (AppContext) {
  function TestContext(mappings, mappingTypes) {
    var argumentResolvers = arguments[2] === undefined ? [] : arguments[2];
    _classCallCheck(this, TestContext);

    _get(Object.getPrototypeOf(TestContext.prototype), "constructor", this).call(this, mappings, mappingTypes, argumentResolvers);
  }

  _inherits(TestContext, AppContext);

  _prototypeProperties(TestContext, null, {
    reset: {
      value: function reset() {
        this.cache = Immutable.Map();
      },
      writable: true,
      configurable: true
    },
    set: {
      value: function set(key, object) {
        if (this.mappings.has(key)) {
          this.cache = this.cache.set(key, object);
        } else {
          throw new Error("Configuration for " + key + " is not defined");
        }
      },
      writable: true,
      configurable: true
    }
  });

  return TestContext;
})(AppContext);

module.exports = TestContext;