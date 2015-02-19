"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _ = require("lodash");

var ResolverChain = (function () {
  function ResolverChain(resolvers) {
    _classCallCheck(this, ResolverChain);

    this.resolvers = resolvers;
  }

  _prototypeProperties(ResolverChain, null, {
    _getResolverFor: {
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
      },
      writable: true,
      configurable: true
    },
    resolve: {
      value: function resolve(key) {
        var resolver = this._getResolverFor(key);
        return resolver.resolve(key, this.resolve.bind(this));
      },
      writable: true,
      configurable: true
    },
    validate: {
      value: function validate(key) {
        var resolver = this._getResolverFor(key);
        return resolver !== null ? resolver.validate(key, this.validate.bind(this)) : false;

      },
      writable: true,
      configurable: true
    }
  });

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
  var keyword = "$" + specialKey;

  function restOfKey(key) {
    return key.substr(keyword.length);
  }

  return createResolver(function (key) {
    return _.isString(key) && _.startsWith(key, keyword);
  }, function (key, defer) {
    return resolveRest(restOfKey(key));
  }, function (key, defer) {
    return validateRest(restOfKey(key));
  }, name);
}



var propertyResolver = createResolver(function (key) {
  return _.isString(key) && key.indexOf(":") >= 0;
}, function (key, defer) {
  var _key$split = key.split(":");

  var _key$split2 = _slicedToArray(_key$split, 2);

  var realKey = _key$split2[0];
  var propertyPath = _key$split2[1];
  return propertyPath.split(".").reduce(function (o, prop) {
    return o[prop];
  }, defer(realKey));
}, function (key, defer) {
  var _key$split = key.split(":");

  var _key$split2 = _slicedToArray(_key$split, 2);

  var realKey = _key$split2[0];
  var propertyPath = _key$split2[1];
  return defer(realKey);
}, "property");

var objectResolver = createResolver(function (key) {
  return _.isPlainObject(key);
}, function (key, defer) {
  return _.mapValues(key, defer);
}, function (key, defer) {
  return _.values(key).every(defer);
}, "object");

var arrayResolver = createResolver(function (key) {
  return _.isArray(key);
}, function (key, defer) {
  return key.map(defer);
}, function (key, defer) {
  return key.every(defer);
}, "array");

var booleanResolver = createResolver(function (key) {
  return typeof key === "boolean";
}, function (key) {
  return key;
}, function (key) {
  return true;
}, "boolean");

var numberResolver = createResolver(function (key) {
  return typeof key === "number";
}, function (key) {
  return key;
}, function (key) {
  return true;
}, "number");

var stringResolver = createSpecialKeyResolver("str:", function (keyRest) {
  return keyRest;
}, function () {
  return true;
}, "string");

module.exports = {
  stringResolver: stringResolver,
  propertyResolver: propertyResolver,
  numberResolver: numberResolver,
  booleanResolver: booleanResolver,
  arrayResolver: arrayResolver,
  objectResolver: objectResolver,
  createSpecialKeyResolver: createSpecialKeyResolver,
  createResolver: createResolver,
  createChain: function (resolvers) {
    return new ResolverChain(resolvers);
  }
};