'use strict';
/*jshint -W030 */

var Immutable = require('immutable');
var path = require('path');

var { expect } = require('../test_commons');
var FunctionType = require('../../lib/types/function_type');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe('FunctionType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new FunctionType(requirePrefix);
  });

  describe('#createObject()', function() {

    it('should return the result of calling the function with arguments', function() {
      var result = mappingType.createObject(Immutable.Map({path: '/test/dummy/echoFunction', arguments: [21, 7]}), x => x);
      expect(result).to.be.eql("21 7");
    });

  });

});
