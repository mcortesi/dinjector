import _ from 'lodash';

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
    const resolver = this._getResolverFor(key);
    return resolver.resolve(key, this.resolve.bind(this));
  }

  validate(key) {
    const resolver = this._getResolverFor(key);
    return resolver !== null ? resolver.validate(key, this.validate.bind(this)) : false;


  }
}

export function createResolver(canApply, resolve, validate, name) {
  return {
    canApply,
    resolve,
    validate,
    name
  };
}

export function createSpecialKeyResolver(specialKey, resolveRest, validateRest, name) {
  const keyword = '$' + specialKey;

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

export const propertyResolver = createResolver(
  (key) => _.isString(key) && key.indexOf(':') >= 0,
  (key, defer) => {
    const [realKey, propertyPath] = key.split(':');
    return propertyPath.split('.')
      .reduce( (o, prop) => o[prop], defer(realKey));
  },
  (key, defer) => {
    let realKey = key.split(':')[0];
    return defer(realKey);
  },
  'property'
);

export const objectResolver = createResolver(
  (key) => _.isPlainObject(key),
  (key, defer) => _.mapValues(key, defer),
  (key, defer) => _.values(key).every(defer),
  'object'
);

export const arrayResolver = createResolver(
  (key) => _.isArray(key),
  (key, defer) => key.map(defer),
  (key, defer) => key.every(defer),
  'array'
);

export const booleanResolver = createResolver(
  (key) => typeof key === 'boolean',
  (key) => key,
  (key) => true,
  'boolean'
);

export const numberResolver = createResolver(
  (key) => typeof key === 'number',
  (key) => key,
  (key) => true,
  'number'
);

export const stringResolver = createSpecialKeyResolver(
  'str:',
  keyRest => keyRest,
  () => true,
  'string'
);

export function createChain(resolvers) {
  return new ResolverChain(resolvers);
}
