'use strict';

var Immutable = require('immutable');
var path = require('path');

var { expect } = require('../test_commons');
var {SingletonType, FunctionType} = require('../../lib/types');
var { ValidationError, InvalidTypeError, InvalidArguments } = require('../../lib/errors');
var AppContext = require('../../lib/context/app_context');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe("AppContext", function() {
  var knownTypes = [
    new SingletonType(requirePrefix),
    new FunctionType(requirePrefix)
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

    it.skip('return the created object using the Mapping specification', function() {

    });

    it.skip('cache the object if the mapping specifies so', function() {

    });

    it.skip('resolve Mapping arguments to other mappings', function() {

    });
  });
});

