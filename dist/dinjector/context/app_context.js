"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Immutable = require("immutable");
var _require = require("../errors");

var ValidationError = _require.ValidationError;
var InvalidTypeError = _require.InvalidTypeError;
var InvalidArguments = _require.InvalidArguments;
var resolvers = require("../argument_resolvers");

/**
 * Application Context
 *
 * Expects a mapping for objects to be created using the context.
 */
var AppContext = (function () {
  function AppContext(mappings, mappingTypes) {
    var argumentResolvers = arguments[2] === undefined ? [] : arguments[2];
    _classCallCheck(this, AppContext);

    this.cache = Immutable.Map();

    this.mappingTypes = Immutable.Map(mappingTypes.map(function (mt) {
      return [mt.name, mt];
    }));

    this._createArgumentResolverChain(argumentResolvers);
    this._preprocessMappings(mappings);
    this._validate();
  }

  _prototypeProperties(AppContext, null, {
    _preprocessMappings: {
      value: function _preprocessMappings(mappings) {
        var _this = this;
        var objectToMapping = function (name, objMapping) {
          objMapping.name = name;
          objMapping.type = objMapping.type || "singleton";
          var mappingType = _this.mappingTypes.get(objMapping.type);
          if (mappingType === undefined) {
            throw new InvalidTypeError(name, objMapping.type);
          }
          return _this.mappingTypes.get(objMapping.type).preprocess(Immutable.Map(objMapping));
        };

        this.mappings = Immutable.Map(mappings).mapEntries(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var k = _ref2[0];
          var v = _ref2[1];
          return [k, objectToMapping(k, v)];
        });
      },
      writable: true,
      configurable: true
    },
    _createArgumentResolverChain: {
      value: function _createArgumentResolverChain(argumentResolvers) {
        var _this = this;
        var getCtxResolver = resolvers.createSpecialKeyResolver("ctx", function (key) {
          return _this;
        }, function (key) {
          return true;
        });

        var getDependencyResolver = resolvers.createResolver(function () {
          return true;
        }, function (key) {
          return _this.get(key);
        }, function (key) {
          return _this.has(key);
        });

        this.resolver = resolvers.createChain(argumentResolvers.concat([getCtxResolver, getDependencyResolver]));
      },
      writable: true,
      configurable: true
    },
    _validate: {
      value: function _validate() {
        var _this = this;
        var badResults = this.mappings.valueSeq().map(function (m) {
          return _this._getTypeFor(m).validate(m);
        }).filter(function (vr) {
          return !vr.isValid();
        }).toArray();


        if (badResults.length > 0) {
          throw new ValidationError(badResults);
        }

        var badArgumentsPairs = this.mappings.valueSeq().flatMap(function (m) {
          return m.get("arguments").filter(function (argKey) {
            return !_this.resolver.validate(argKey);
          }).map(function (argKey) {
            return [m.get("name"), argKey];
          });
        }).toArray();

        if (badArgumentsPairs.length > 0) {
          throw new InvalidArguments(badArgumentsPairs);
        }
      },
      writable: true,
      configurable: true
    },
    _getTypeFor: {
      value: function _getTypeFor(mapping) {
        return this.mappingTypes.get(mapping.get("type"));
      },
      writable: true,
      configurable: true
    },
    getMapping: {
      value: function getMapping(key) {
        return this.mappings.get(key);
      },
      writable: true,
      configurable: true
    },
    has: {
      value: function has(key) {
        return this.mappings.has(key);
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(key) {
        var _this = this;
        if (this.mappings.has(key)) {
          var mapping = this.mappings.get(key);
          if (this.cache.has(key)) {
            return this.cache.get(key);
          } else {
            var mappingType = this._getTypeFor(mapping);
            var mappedObj = mappingType.createObject(mapping, function (k) {
              return _this.resolver.resolve(k);
            });

            if (mapping.get("cache")) {
              this.cache = this.cache.set(key, mappedObj);
            }

            return mappedObj;
          }
        } else {
          throw new Error("Configuration for " + key + " is not defined");
        }
      },
      writable: true,
      configurable: true
    }
  });

  return AppContext;
})();

module.exports = AppContext;