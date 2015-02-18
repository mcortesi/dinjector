'use strict';

var _ = require('lodash');

class ResolverChain {

  constructor(resolvers) {
    this.resolvers = resolvers;
  }

  _getResolverFor(key) {
    return this.resolvers.reduce( (pickedResolver, current) => {
      if (pickedResolver) {
        return pickedResolver;
      } else if (current.canApply(key)) {
        return current;
      } else {
        return null;
      }
    }, null);
  }

  resolve(key) {
    var resolver = this._getResolverFor(key);
    return resolver.resolve(key, this.resolve.bind(this));
  }

  validate(key) {
    var resolver = this._getResolverFor(key);
    return resolver !== null ? resolver.validate(key, this.validate.bind(this)) : false;


  }
}

function createResolver(canApply, resolve, validate, name) {
  return {
    canApply,
    resolve,
    validate,
    name
  };
}

function createSpecialKeyResolver(specialKey, resolveRest, validateRest, name) {
  var keyword = '$' + specialKey;

  function restOfKey(key) {
    return key.substr(keyword.length);
  }

  return createResolver(
    (key) => _.isString(key) && _.startsWith(key, keyword),
    (key, defer) => resolveRest(restOfKey(key)),
    (key, defer) => validateRest(restOfKey(key)),
    name
  );
}



var propertyResolver = createResolver(
  (key) => _.isString(key) && key.indexOf(':') >= 0,
  (key, defer) => {
    var [realKey, propertyPath] = key.split(':');
    return propertyPath.split('.')
      .reduce( (o, prop) => o[prop], defer(realKey));
  },
  (key, defer) => {
    var [realKey, propertyPath] = key.split(':');
    return defer(realKey);
  },
  'property'
);

var objectResolver = createResolver(
  (key) => _.isPlainObject(key),
  (key, defer) => _.mapValues(key, defer),
  (key, defer) => _.values(key).every(defer),
  'object'
);

var arrayResolver = createResolver(
  (key) => _.isArray(key),
  (key, defer) => key.map(defer),
  (key, defer) => key.every(defer),
  'array'
);

var booleanResolver = createResolver(
  (key) => typeof(key) === 'boolean',
  (key) => key,
  (key) => true,
  'boolean'
);

var numberResolver = createResolver(
  (key) => typeof(key) === 'number',
  (key) => key,
  (key) => true,
  'number'
);

var stringResolver = createSpecialKeyResolver(
  'str:',
  keyRest => keyRest,
  () => true,
  'string'
);

module.exports = {
  stringResolver: stringResolver,
  propertyResolver: propertyResolver,
  numberResolver: numberResolver,
  booleanResolver: booleanResolver,
  arrayResolver: arrayResolver,
  objectResolver: objectResolver,
  createSpecialKeyResolver: createSpecialKeyResolver,
  createResolver: createResolver,
  createChain: function(resolvers) {
    return new ResolverChain(resolvers);
  }
};
