'use strict';
/*jshint -W030 */

var Immutable = require('immutable');

var { expect, sinon } = require('../test_commons');
var AbstractType = require('../../lib/types/abstract_type');

describe('AbstractType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new AbstractType('dummy', ['req1', 'req2'], ['opt1', 'opt2'], {opt1: 5});
  });

  describe('#validate()', function() {

    it('should check as valid when only all required keys are defined', function () {
      var validationResult = mappingType.validate(Immutable.Map({req1: 1, req2: 2, type: 'dummy', name: 'name'}));
      expect(validationResult.isValid()).to.be.true;
      expect(validationResult.missingKeys.isEmpty()).to.be.true;
      expect(validationResult.extraKeys.isEmpty()).to.be.true;
    });

    it('should check as invalid when missing a required key', function () {
      var validationResult = mappingType.validate(Immutable.Map({req1: 1, type: 'dummy', name: 'name'}));
      expect(validationResult.isValid()).to.be.false;
      expect(validationResult.extraKeys.isEmpty()).to.be.true;
      expect(validationResult.missingKeys.equals(Immutable.Set.of('req2'))).to.be.true;
    });

    it('should check as invalid when exists keys not in possibleKeys', function () {
      var validationResult = mappingType.validate(Immutable.Map({req1: 1, req2: 2, type: 'dummy', name: 'name', extra: 1}));
      expect(validationResult.isValid()).to.be.false;
      expect(validationResult.missingKeys.isEmpty()).to.be.true;
      expect(validationResult.extraKeys.equals(Immutable.Set.of('extra'))).to.be.true;
    });

    it('should check as valid when using required key + optional ones', function () {
      var validationResult = mappingType.validate(Immutable.Map({req1: 1, req2: 2, opt1:2, opt2: 3, type: 'dummy', name: 'name'}));
      expect(validationResult.isValid()).to.be.true;
      expect(validationResult.missingKeys.isEmpty()).to.be.true;
      expect(validationResult.extraKeys.isEmpty()).to.be.true;
    });

  });

  describe('#preprocess()', function() {

    it('should set default values if keys are missing', function () {
      var newMapping = mappingType.preprocess(Immutable.Map({req1: 1, req2: 2, type: 'dummy'}));
      expect(newMapping.get('opt1')).to.eq(5);
    });

    it('should set "arguments" to an empty array if it\'s missing', function () {
      var newMapping = mappingType.preprocess(Immutable.Map({req1: 1, req2: 2, type: 'dummy'}));
      expect(newMapping.get('arguments')).to.eql([]);
    });

    it('should set "cache" to false if it\'s missing', function () {
      var newMapping = mappingType.preprocess(Immutable.Map({req1: 1, req2: 2, type: 'dummy'}));
      expect(newMapping.get('cache')).to.eql(false);
    });

    it('should NOT set default values when a value exists for them', function () {
      var oldMapping = Immutable.Map({req1: 1, req2: 2, type: 'dummy', cache: true, arguments: [1,2,3], opt1: 3});
      var newMapping = mappingType.preprocess(oldMapping);
      expect(newMapping.equals(oldMapping)).to.be.true;
    });

  });

  describe('#createObject()', function() {

    class DummyType extends AbstractType {
      constructor() {
        super('dummy');
      }

      _resolveObjectCreator(mapping) {
        return function() {
          return Array.from(arguments);
        };
      }

      _doCreateObject(objectCreator, args, mapping) {
        return objectCreator.apply(null, args);
      }
    }

    beforeEach(function() {
      mappingType = new DummyType();
    });

    it('should call _resolveObjectCreator()', function() {
      var resolveObjectCreatorSpy = sinon.spy(mappingType, '_resolveObjectCreator');
      mappingType.createObject(Immutable.Map({arguments: []}), x => x);
      expect(resolveObjectCreatorSpy).to.be.calledOnce;
    });

    it('should call _doCreateObject()', function() {
      var doCreateObjectSpy = sinon.spy(mappingType, '_doCreateObject');
      mappingType.createObject(Immutable.Map({arguments: []}), x => x);
      expect(doCreateObjectSpy).to.be.calledOnce;
    });

    it('should return the created object', function() {
      var result = mappingType.createObject(Immutable.Map({arguments: [1,2,3]}), x => x + 1);
      expect(result).to.eql([2,3,4]);
    });
  });

});
