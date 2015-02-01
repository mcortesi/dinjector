'use strict';

var chai = require('chai');
var expect = chai.expect;

var Injector = require('../lib/index');

describe('Dummy', function() {

  it('should work', function() {
    var injector = new Injector('hola');
    expect(injector.pepe).to.eql('hola');
  });
});

