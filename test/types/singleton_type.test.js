'use strict';
/*jshint -W030 */

import Immutable from 'immutable';
var path = require('path');

var { expect } = require('../test_commons');
var SingletonType = require('../../lib/types/singleton_type');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe('SingletonType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new SingletonType(requirePrefix);
  });

  describe('#createObject()', function() {

    it('should return a new instance of the object', function() {
      var result = mappingType.createObject(Immutable.Map({path: '/test/dummy/serviceA', arguments: [21, 7]}), x => x);
      expect(result.args).to.be.eql([21, 7]);
    });

  });

});
