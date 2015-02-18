'use strict';

var Immutable = require('immutable');
var { ValidationError, InvalidTypeError, InvalidArguments } = require('../errors');
var resolvers = require('../argument_resolvers');

/**
 * Application Context
 *
 * Expects a mapping for objects to be created using the context.
 */
class AppContext {
  constructor(mappings, mappingTypes, argumentResolvers = []) {
    this.cache = Immutable.Map();

    this.mappingTypes = Immutable.Map(mappingTypes.map( mt => [mt.name, mt]));

    this._createArgumentResolverChain(argumentResolvers);
    this._preprocessMappings(mappings);
    this._validate();
  }

  _preprocessMappings(mappings) {
    var objectToMapping = (name, objMapping) => {
      objMapping.name = name;
      objMapping.type = objMapping.type || 'singleton';
      var mappingType = this.mappingTypes.get(objMapping.type);
      if (mappingType === undefined) {
        throw new InvalidTypeError(name, objMapping.type);
      }
      return this.mappingTypes.get(objMapping.type).preprocess(Immutable.Map(objMapping));
    };

    this.mappings = Immutable.Map(mappings).mapEntries( ([k,v]) => [k, objectToMapping(k, v)]);
  }

  _createArgumentResolverChain(argumentResolvers) {
    var getCtxResolver = resolvers.createSpecialKeyResolver('ctx',
      (key) => this,
      (key) => true
    );

    var getDependencyResolver = resolvers.createResolver(
      () => true,
      (key) => this.get(key),
      (key) => this.has(key)
    );

    this.resolver = resolvers.createChain(
      argumentResolvers.concat([getCtxResolver, getDependencyResolver])
    );
  }

  _validate() {
    var badResults = this.mappings.valueSeq()
      .map( m => this._getTypeFor(m).validate(m) )
      .filter( vr => !vr.isValid() )
      .toArray();


    if (badResults.length > 0) {
      throw new ValidationError(badResults);
    }

    var badArgumentsPairs = this.mappings.valueSeq()
      .flatMap( m =>
        m.get('arguments')
          .filter( argKey => !this.resolver.validate(argKey) )
          .map( argKey => [m.get('name'), argKey])
    ).toArray();

    if (badArgumentsPairs.length > 0) {
      throw new InvalidArguments(badArgumentsPairs);
    }
  }

  _getTypeFor(mapping) {
    return this.mappingTypes.get(mapping.get('type'));
  }

  getMapping(key) {
    return this.mappings.get(key);
  }

  has(key) {
    return this.mappings.has(key);
  }

  get(key) {
    if (this.mappings.has(key)) {
      var mapping = this.mappings.get(key);
      if (this.cache.has(key)) {
        return this.cache.get(key);
      } else {
        var mappingType = this._getTypeFor(mapping);
        var mappedObj = mappingType.createObject(mapping, (k) => this.resolver.resolve(k) );

        if (mapping.get('cache')) {
          this.cache = this.cache.set(key, mappedObj);
        }

        return mappedObj;
      }
    } else {
      throw new Error(`Configuration for ${key} is not defined`);
    }
  }

}

module.exports = AppContext;
