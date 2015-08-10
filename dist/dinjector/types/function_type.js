"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

import AbstractRequireType from './abstract_require_type';

/**
 * Function Mapping Type
 *
 * Expect a function from a module or module's property and
 * calls it with the given arguments.
 */
var FunctionType = (function (AbstractRequireType) {
  function FunctionType(basePath) {
    _classCallCheck(this, FunctionType);

    _get(Object.getPrototypeOf(FunctionType.prototype), "constructor", this).call(this, basePath, "function");
  }

  _inherits(FunctionType, AbstractRequireType);

  _prototypeProperties(FunctionType, null, {
    _doCreateObject: {
      value: function _doCreateObject(fn, args, mapping) {
        return fn.apply(null, args);
      },
      writable: true,
      configurable: true
    }
  });

  return FunctionType;
})(AbstractRequireType);

module.exports = FunctionType;