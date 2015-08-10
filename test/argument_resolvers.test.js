import { expect, sinon } from './test_commons';
import * as resolvers from '../lib/argument_resolvers';

describe('Argument Resolvers', function() {
  var fail = x => { throw new Error(); };
  var returnFalse = x => false;

  describe('Number Resolver::', function() {

    it('should accept only numbers', function () {
      expect(resolvers.numberResolver.canApply(10)).to.be.true;
      expect(resolvers.numberResolver.canApply('10')).to.be.false;
    });

    it('should validate as true (assumes prior accept)', function () {
      expect(resolvers.numberResolver.validate(10, returnFalse)).to.be.true;
      expect(resolvers.numberResolver.validate('10', returnFalse)).to.be.true;
    });
    it('should resolve to the number itself', function () {
      expect(resolvers.numberResolver.resolve(10, fail)).to.eq(10);
    });
  });

  describe('Boolean Resolver::', function() {

    it('should accept only booleans', function () {
      expect(resolvers.booleanResolver.canApply(true)).to.be.true;
      expect(resolvers.booleanResolver.canApply(false)).to.be.true;
      expect(resolvers.booleanResolver.canApply('10')).to.be.false;
    });

    it('should validate as true (assumes prior accept)', function () {
      expect(resolvers.booleanResolver.validate(true, returnFalse)).to.be.true;
      expect(resolvers.booleanResolver.validate(false, returnFalse)).to.be.true;
      expect(resolvers.booleanResolver.validate('10', returnFalse)).to.be.true;
    });
    it('should resolve to the boolean itself', function () {
      expect(resolvers.booleanResolver.resolve(true, fail)).to.eq(true);
      expect(resolvers.booleanResolver.resolve(false, fail)).to.eq(false);
    });
  });

  describe('String Resolver::', function() {

    it('should accept string starting with $str:', function () {
      expect(resolvers.stringResolver.canApply('$str:hello')).to.be.true;
      expect(resolvers.stringResolver.canApply('$strhello')).to.be.false;
      expect(resolvers.stringResolver.canApply('hello')).to.be.false;
      expect(resolvers.stringResolver.canApply(10)).to.be.false;
      expect(resolvers.stringResolver.canApply([])).to.be.false;
    });

    it('should validate as true (assumes prior accept)', function () {
      expect(resolvers.stringResolver.validate('$str:hello', returnFalse)).to.be.true;
      expect(resolvers.stringResolver.validate('$strhello', returnFalse)).to.be.true;
    });
    it('should resolve to the string after "str:" itself', function () {
      expect(resolvers.stringResolver.resolve("$str:hello", fail)).to.eq("hello");
    });
  });


  describe('Property Resolver::', function() {

    it('should accept only strings with ":"', function () {
      expect(resolvers.propertyResolver.canApply('str:hello')).to.be.true;
      expect(resolvers.propertyResolver.canApply('strhello')).to.be.false;
      expect(resolvers.propertyResolver.canApply('10')).to.be.false;
      expect(resolvers.propertyResolver.canApply(10)).to.be.false;
      expect(resolvers.propertyResolver.canApply([])).to.be.false;
    });

    it('should defer validation upon base depencency', function () {
      var spy = sinon.spy((k) => true);
      expect(resolvers.propertyResolver.validate('str:hello', spy)).to.be.true;
      expect(spy).to.have.been.calledWith('str');

    });
    it('should use resolved base dependency and navigate properties of it', function () {
      var resolver = (k) => { return {a: {b: {c: 10 }}}; };
      expect(resolvers.propertyResolver.resolve("str:a.b.c", resolver)).to.eq(10);
    });
  });

  describe('Array Resolver::', function() {
    var chain = resolvers.createChain([resolvers.stringResolver, resolvers.numberResolver, resolvers.arrayResolver]);

    it('should accept only arrays', function () {
      expect(resolvers.arrayResolver.canApply([])).to.be.true;
      expect(resolvers.arrayResolver.canApply(['$strhello'])).to.be.true;
      expect(resolvers.arrayResolver.canApply('10')).to.be.false;
    });

    it('should validate as true if all arguments validates as true', function () {
      expect(chain.validate(['$str:hello', 5])).to.be.true;
      expect(chain.validate([])).to.be.true;
      expect(chain.validate([5, true])).to.be.false;
    });

    it('should resolve to the mapped array of resolved elements', function () {
      expect(chain.resolve(['$str:hello', 5])).to.be.eql(['hello', 5]);
      expect(chain.resolve(['$str:hello', [5]])).to.be.eql(['hello', [5]]);
    });
  });


  describe('Object Resolver::', function() {
    var chain = resolvers.createChain([resolvers.stringResolver, resolvers.numberResolver, resolvers.objectResolver]);

    it('should accept only objects', function () {
      expect(resolvers.objectResolver.canApply({a:1, b:2})).to.be.true;
      expect(resolvers.objectResolver.canApply([])).to.be.false;
      expect(resolvers.objectResolver.canApply('10')).to.be.false;
    });

    it('should validate as true if all arguments validates as true', function () {
      expect(chain.validate({a:1, b:2})).to.be.true;
      expect(chain.validate({})).to.be.true;
      expect(chain.validate({a:1, b: true})).to.be.false;
    });

    it('should resolve to the mapped array of resolved elements', function () {
      expect(chain.resolve({a: '$str:hello', b: 5})).to.be.eql({a: 'hello', b: 5});
      expect(chain.resolve({a: '$str:hello', b: { c:5 }})).to.be.eql({a: 'hello', b: { c:5 } });
    });
  });
});
