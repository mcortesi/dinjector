'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _require = require('../errors');

var ValidationError = _require.ValidationError;
var InvalidTypeError = _require.InvalidTypeError;
var InvalidArguments = _require.InvalidArguments;

var resolvers = require('../argument_resolvers');

/**
 * Application Context
 *
 * Expects a mapping for objects to be created using the context.
 */

var AppContext = (function () {
  function AppContext(mappings, mappingTypes) {
    var argumentResolvers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, AppContext);

    this.cache = _immutable2['default'].Map();

    this.mappingTypes = _immutable2['default'].Map(mappingTypes.map(function (mt) {
      return [mt.name, mt];
    }));

    this._createArgumentResolverChain(argumentResolvers);
    this._preprocessMappings(mappings);
    this._validate();
  }

  _createClass(AppContext, [{
    key: '_preprocessMappings',
    value: function _preprocessMappings(mappings) {
      var _this = this;

      var objectToMapping = function objectToMapping(name, objMapping) {
        objMapping.name = name;
        objMapping.type = objMapping.type || 'singleton';
        var mappingType = _this.mappingTypes.get(objMapping.type);
        if (mappingType === undefined) {
          throw new InvalidTypeError(name, objMapping.type);
        }
        return _this.mappingTypes.get(objMapping.type).preprocess(_immutable2['default'].Map(objMapping));
      };

      this.mappings = _immutable2['default'].Map(mappings).mapEntries(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var k = _ref2[0];
        var v = _ref2[1];
        return [k, objectToMapping(k, v)];
      });
    }
  }, {
    key: '_createArgumentResolverChain',
    value: function _createArgumentResolverChain(argumentResolvers) {
      var _this2 = this;

      var getCtxResolver = resolvers.createSpecialKeyResolver('ctx', function (key) {
        return _this2;
      }, function (key) {
        return true;
      });

      var getDependencyResolver = resolvers.createResolver(function () {
        return true;
      }, function (key) {
        return _this2.get(key);
      }, function (key) {
        return _this2.has(key);
      });

      this.resolver = resolvers.createChain(argumentResolvers.concat([getCtxResolver, getDependencyResolver]));
    }
  }, {
    key: '_validate',
    value: function _validate() {
      var _this3 = this;

      var badResults = this.mappings.valueSeq().map(function (m) {
        return _this3._getTypeFor(m).validate(m);
      }).filter(function (vr) {
        return !vr.isValid();
      }).toArray();

      if (badResults.length > 0) {
        throw new ValidationError(badResults);
      }

      var badArgumentsPairs = this.mappings.valueSeq().flatMap(function (m) {
        return m.get('arguments').filter(function (argKey) {
          return !_this3.resolver.validate(argKey);
        }).map(function (argKey) {
          return [m.get('name'), argKey];
        });
      }).toArray();

      if (badArgumentsPairs.length > 0) {
        throw new InvalidArguments(badArgumentsPairs);
      }
    }
  }, {
    key: '_getTypeFor',
    value: function _getTypeFor(mapping) {
      return this.mappingTypes.get(mapping.get('type'));
    }
  }, {
    key: 'getMapping',
    value: function getMapping(key) {
      return this.mappings.get(key);
    }
  }, {
    key: 'has',
    value: function has(key) {
      return this.mappings.has(key);
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this4 = this;

      if (this.cache.has(key)) {
        return this.cache.get(key);
      } else {
        if (this.mappings.has(key)) {
          var mapping = this.mappings.get(key);
          var mappingType = this._getTypeFor(mapping);
          var mappedObj = mappingType.createObject(mapping, function (k) {
            return _this4.resolver.resolve(k);
          });

          if (mapping.get('cache')) {
            this.cache = this.cache.set(key, mappedObj);
          }

          return mappedObj;
        } else {
          throw new Error('Configuration for ' + key + ' is not defined');
        }
      }
    }

    /** Returns an array with all objects whose tags include all of the given tags **/
  }, {
    key: 'getWithTags',
    value: function getWithTags() {
      var _this5 = this;

      for (var _len = arguments.length, tags = Array(_len), _key = 0; _key < _len; _key++) {
        tags[_key] = arguments[_key];
      }

      var tagsSet = new _immutable2['default'].Set(tags);
      return this.mappings.filter(function (mapping) {
        return tagsSet.isSubset(mapping.get('tags', []));
      }).map(function (mapping) {
        return _this5.get(mapping.get('name'));
      }).toArray();
    }
  }]);

  return AppContext;
})();

module.exports = AppContext;
