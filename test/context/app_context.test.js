'use strict';

var Immutable = require('immutable');
var path = require('path');

var { expect } = require('../test_commons');
var {SingletonType, FunctionType, InlineType, ModuleType} = require('../../lib/types');
var { ValidationError, InvalidTypeError, InvalidArguments } = require('../../lib/errors');
var resolvers = require('../../lib/argument_resolvers');
var AppContext = require('../../lib/context/app_context');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe("AppContext", function() {
  var knownTypes = [
    new SingletonType(requirePrefix),
    new FunctionType(requirePrefix),
    new ModuleType(),
    new InlineType()
  ];

  var baseResolvers = [
    resolvers.arrayResolver,
    resolvers.objectResolver,
    resolvers.stringResolver,
    resolvers.numberResolver,
    resolvers.booleanResolver,
    resolvers.propertyResolver
  ];

  describe("new AppContext()", function() {

    it('should fail if it doesn\'t have a mappingType for a mapping', function() {
      expect(() => new AppContext({ invalid: {type: 'invalidType'} }, knownTypes))
        .to.throw(InvalidTypeError, /invalidType/);
    });

    it('should fail if a mapping doesn\'t validate to it\'s type', function() {
      var mappings = {
        invalidFunction: {
          type: 'function'
        }
      };
      expect(() => new AppContext(mappings, knownTypes))
        .to.throw(ValidationError, /invalidFunction/);
    });

    it('should fail if a mapping\'s argument refers to a non-existing mapping', function() {
      var mappings = {
        invalidFunction: {
          type: 'function',
          path: '/test/dummy/echoFunction',
          arguments: ['notExistentMapping']
        }
      };
      expect(() => new AppContext(mappings, knownTypes))
        .to.throw(InvalidArguments, /notExistentMapping/);
    });

    it('should assign type "singleton" if Mapping doesn\'t have a type', function() {
      var mappings = {
        withoutType: {
          path: '/test/dummy/serviceA',
          arguments: ['aFunction']
        },
        aFunction: {
          path: '/test/dummy/echoFunction',
          type: 'function'
        }
      };
      var ctx = new AppContext(mappings, knownTypes);
      expect(ctx.getMapping('withoutType').get('type')).to.eq('singleton');
    });
  });

  describe("#get()", function() {


    it('return the created object using the Mapping specification', function() {
      var mappings = {
        sumOfValues: {
          type: 'inline',
          arguments: ['config:valueA', 'config:valueB', 10],
          createFn(a, b, c) {
            return a + b + c;
          }
        },
        config: {
          type: 'inline',
          createFn() {
            return {
              valueA: 5,
              valueB: 15
            };
          }
        }
      };
      var ctx = new AppContext(mappings, knownTypes, baseResolvers);
      expect(ctx.get('sumOfValues')).to.eq(30);
    });

    it('cache the object if the mapping specifies so', function() {
      var nextValue = 0;
      var mappings = {
        getAndIncrement: {
          type: 'inline',
          cache: true,
          createFn() {
            nextValue +=1;
            return nextValue;
          }
        }
      };
      var ctx = new AppContext(mappings, knownTypes, baseResolvers);
      expect(ctx.get('getAndIncrement')).to.eq(1);
      expect(ctx.get('getAndIncrement')).to.eq(1);
      expect(ctx.get('getAndIncrement')).to.eq(1);
    });

  });
});

