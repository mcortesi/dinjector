'use strict';
/*jshint -W030 */

var Immutable = require('immutable');
var path = require('path');

var { expect, sinon } = require('../test_commons');
var AbstractRequireType = require('../../lib/types/abstract_require_type');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe('AbstractRequireType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new AbstractRequireType(requirePrefix, 'dummy');
  });

  describe('#validate()', function() {

    it('should check as invalid if path is missing', function () {
      var validationResult = mappingType.validate(Immutable.Map({type: 'dummy'}));
      expect(validationResult.isValid()).to.be.false();
      expect(validationResult.missingKeys.equals(Immutable.Set.of('path'))).to.be.true();
    });

    it('should check valid if optional \'property\' key is used', function () {
      var validationResult = mappingType.validate(Immutable.Map({path: 'apath', property: 'prop', type: 'dummy'}));
      expect(validationResult.isValid()).to.be.true();
      expect(validationResult.extraKeys.isEmpty()).to.be.true();
    });

  });

  describe('#createObject()', function() {

    class DummyType extends AbstractRequireType {
      constructor() {
        super(requirePrefix, 'dummy');
      }

      _doCreateObject(objectCreator, args, mapping) {
        return objectCreator;
      }
    }

    beforeEach(function() {
      mappingType = new DummyType();
    });

    it('should work with relative paths', function() {
      var result = mappingType.createObject(Immutable.Map({path: '/test/dummy/serviceA', arguments: []}), x => x);
      expect(result).to.be.eq(require("../dummy/serviceA"));
    });

    it('should call absolute paths', function() {
      var result = mappingType.createObject(Immutable.Map({path: 'immutable', arguments: []}), x => x);
      expect(result).to.be.eq(require("immutable"));
    });

    it('should work with property', function() {
      var result = mappingType.createObject(Immutable.Map({path: 'immutable', property: 'Map', arguments: []}), x => x);
      expect(result).to.be.eq(require("immutable").Map);
    });
  });

});
