import chai from 'chai';
import path from 'path';
import * as injector from '../lib';

const expect = chai.expect;
const requirePrefix = path.resolve(path.join(__dirname, ".."));

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
