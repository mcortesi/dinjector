'use strict';


class SomeClass {
  constructor(theFunction) {
    this.theFunction = theFunction;
  }

}

function someFunction(arg1, arg2) {
  return [arg1, arg2];
}
module.exports = {
  SomeClass: SomeClass,
  someFunction: someFunction
};

