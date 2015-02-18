'use strict';

var chai = require('chai');
var expect = chai.expect;

var path = require('path');

var injector = require('../lib');

var requirePrefix = path.resolve(path.join(__dirname, ".."));

describe('Injector', function() {


  describe('loadAppContext()', function () {
    it('an example', function () {
      var ctx = injector.loadContext(
        {
          serviceA: {
            path: '/test/dummy/serviceA',
            type: 'singleton',
            arguments: ['number9']
          },
          'number9': {
            type: 'function',
            arguments: ['$str:number', 9],
            path: '/test/dummy/echoFunction'
          }
        },
        {prefix: requirePrefix});

      var srvA = ctx.get('serviceA');
      expect(srvA.args[0]).to.eq('number 9');
    });
  });
});
