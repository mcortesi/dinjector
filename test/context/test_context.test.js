'use strict';

var Immutable = require('immutable');
var path = require('path');

var { expect } = require('../test_commons');
var {SingletonType, FunctionType, InlineType, ModuleType} = require('../../lib/types');
var { ValidationError, InvalidTypeError, InvalidArguments } = require('../../lib/errors');
var resolvers = require('../../lib/argument_resolvers');
var TestContext = require('../../lib/context/test_context');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe("TestContext", function() {
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


  describe("#reset()", function() {

    it('should clear object cache', function() {
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
      var ctx = new TestContext(mappings, knownTypes, baseResolvers);
      expect(ctx.get('getAndIncrement')).to.eq(1);
      expect(ctx.get('getAndIncrement')).to.eq(1);
      ctx.reset();
      expect(ctx.get('getAndIncrement')).to.eq(2);
    });

  });


  describe("#set()", function() {

    it('should override an existing cache entry', function() {
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
      var ctx = new TestContext(mappings, knownTypes, baseResolvers);
      expect(ctx.get('getAndIncrement')).to.eq(1);
      ctx.set('getAndIncrement', 5);
      expect(ctx.get('getAndIncrement')).to.eq(5);
    });

    it('should allow to set an unexistent mapping', function() {
      var ctx = new TestContext({}, knownTypes, baseResolvers);
      ctx.set('dummy', 5);
      expect(ctx.get('dummy')).to.eq(5);
    });
  });
});

