'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.createResolver = createResolver;
exports.createSpecialKeyResolver = createSpecialKeyResolver;
exports.createChain = createChain;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var ResolverChain = (function () {
  function ResolverChain(resolvers) {
    _classCallCheck(this, ResolverChain);

    this.resolvers = resolvers;
  }

  _createClass(ResolverChain, [{
    key: '_getResolverFor',
    value: function _getResolverFor(key) {
      return this.resolvers.reduce(function (pickedResolver, current) {
        if (pickedResolver) {
          return pickedResolver;
        } else if (current.canApply(key)) {
          return current;
        } else {
          return null;
        }
      }, null);
    }
  }, {
    key: 'resolve',
    value: function resolve(key) {
      var resolver = this._getResolverFor(key);
      return resolver.resolve(key, this.resolve.bind(this));
    }
  }, {
    key: 'validate',
    value: function validate(key) {
      var resolver = this._getResolverFor(key);
      return resolver !== null ? resolver.validate(key, this.validate.bind(this)) : false;
    }
  }]);

  return ResolverChain;
})();

function createResolver(canApply, resolve, validate, name) {
  return {
    canApply: canApply,
    resolve: resolve,
    validate: validate,
    name: name
  };
}

function createSpecialKeyResolver(specialKey, resolveRest, validateRest, name) {
  var keyword = '$' + specialKey;

  function restOfKey(key) {
    return key.substr(keyword.length);
  }

  return createResolver(function (key) {
    return _lodash2['default'].isString(key) && _lodash2['default'].startsWith(key, keyword);
  }, function (key, defer) {
    return resolveRest(restOfKey(key));
  }, function (key, defer) {
    return validateRest(restOfKey(key));
  }, name);
}

var propertyResolver = createResolver(function (key) {
  return _lodash2['default'].isString(key) && key.indexOf(':') >= 0;
}, function (key, defer) {
  var _key$split = key.split(':');

  var _key$split2 = _slicedToArray(_key$split, 2);

  var realKey = _key$split2[0];
  var propertyPath = _key$split2[1];

  return propertyPath.split('.').reduce(function (o, prop) {
    return o[prop];
  }, defer(realKey));
}, function (key, defer) {
  var realKey = key.split(':')[0];
  return defer(realKey);
}, 'property');

exports.propertyResolver = propertyResolver;
var objectResolver = createResolver(function (key) {
  return _lodash2['default'].isPlainObject(key);
}, function (key, defer) {
  return _lodash2['default'].mapValues(key, defer);
}, function (key, defer) {
  return _lodash2['default'].values(key).every(defer);
}, 'object');

exports.objectResolver = objectResolver;
var arrayResolver = createResolver(function (key) {
  return _lodash2['default'].isArray(key);
}, function (key, defer) {
  return key.map(defer);
}, function (key, defer) {
  return key.every(defer);
}, 'array');

exports.arrayResolver = arrayResolver;
var booleanResolver = createResolver(function (key) {
  return typeof key === 'boolean';
}, function (key) {
  return key;
}, function (key) {
  return true;
}, 'boolean');

exports.booleanResolver = booleanResolver;
var numberResolver = createResolver(function (key) {
  return typeof key === 'number';
}, function (key) {
  return key;
}, function (key) {
  return true;
}, 'number');

exports.numberResolver = numberResolver;
var stringResolver = createSpecialKeyResolver('str:', function (keyRest) {
  return keyRest;
}, function () {
  return true;
}, 'string');

exports.stringResolver = stringResolver;

function createChain(resolvers) {
  return new ResolverChain(resolvers);
}
