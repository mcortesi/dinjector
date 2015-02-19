"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Immutable = require("immutable");
var AbstractType = require("./abstract_type");

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
var AbstractRequireType = (function (AbstractType) {
  function AbstractRequireType(basePath, name) {
    var requiredKeys = arguments[2] === undefined ? [] : arguments[2];
    var optionalKeys = arguments[3] === undefined ? [] : arguments[3];
    var defaultValues = arguments[4] === undefined ? {} : arguments[4];
    _classCallCheck(this, AbstractRequireType);

    _get(Object.getPrototypeOf(AbstractRequireType.prototype), "constructor", this).call(this, name, Immutable.Set.of("path").union(requiredKeys), Immutable.Set.of("property").union(requiredKeys), defaultValues);
    this.basePath = basePath;
  }

  _inherits(AbstractRequireType, AbstractType);

  _prototypeProperties(AbstractRequireType, null, {
    _resolveObjectCreator: {
      value: function _resolveObjectCreator(mapping) {
        var keyObject;

        var requirePath;
        if (mapping.get("path").startsWith("/")) {
          requirePath = this.basePath + mapping.get("path");
        } else {
          requirePath = mapping.get("path");
        }

        var moduleObj = require(requirePath);

        if (mapping.has("property")) {
          keyObject = moduleObj[mapping.get("property")];
        } else {
          keyObject = moduleObj;
        }
        return keyObject;
      },
      writable: true,
      configurable: true
    }
  });

  return AbstractRequireType;
})(AbstractType);

module.exports = AbstractRequireType;