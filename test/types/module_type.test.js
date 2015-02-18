'use strict';
/*jshint -W030 */

var Immutable = require('immutable');
var path = require('path');

var { expect } = require('../test_commons');
var ModuleType = require('../../lib/types/module_type');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe('ModuleType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new ModuleType(requirePrefix);
  });

  describe('#createObject()', function() {

    it('should return the result doing a require over the module', function() {
      var result = mappingType.createObject(
        mappingType.preprocess(Immutable.Map({
          path: '/test/dummy/withProperty',
          property: 'someFunction'
        })),
        x => x);
      expect(result).to.be.eq(require('../dummy/withProperty').someFunction);
    });

  });

});
