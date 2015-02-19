"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Immutable = require("immutable");
var AbstractRequireType = require("./abstract_require_type");

/**
 * Singleton Type
 *
 * Mapping type that creates objects based on an exported module's class.
 *
 * By default they are cached.
 */
var SingletonType = (function (AbstractRequireType) {
  function SingletonType(basePath) {
    _classCallCheck(this, SingletonType);

    _get(Object.getPrototypeOf(SingletonType.prototype), "constructor", this).call(this, basePath, "singleton", [], [], { cache: true });
  }

  _inherits(SingletonType, AbstractRequireType);

  _prototypeProperties(SingletonType, null, {
    _doCreateObject: {
      value: function _doCreateObject(Class, args, mapping) {
        var instance = Object.create(Class.prototype);
        Class.apply(instance, args);
        return instance;
      },
      writable: true,
      configurable: true
    }
  });

  return SingletonType;
})(AbstractRequireType);

module.exports = SingletonType;