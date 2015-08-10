'use strict';
/*jshint -W030 */

import Immutable from 'immutable';
var path = require('path');

var { expect } = require('../test_commons');
var InlineType = require('../../lib/types/inline_type');

var requirePrefix = path.resolve(path.join(__dirname, "../.."));

describe('InlineType', function() {
  var mappingType = null;

  beforeEach(function () {
    mappingType = new InlineType(requirePrefix);
  });

  describe('#createObject()', function() {

    it('should return the result of calling createFn with the resolved arguments', function() {
      var result = mappingType.createObject(
        mappingType.preprocess(Immutable.Map({
          type: 'inline',
          arguments: [1,4,5],
          createFn: (x1,x2,x3) => x1 + x2 + x3
        })),
        x => x * 2);
      expect(result).to.be.eq(20);
    });

  });

});
