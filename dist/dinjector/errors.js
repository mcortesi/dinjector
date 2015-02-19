"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ValidationError = (function (Error) {
  function ValidationError(validationResults) {
    _classCallCheck(this, ValidationError);

    _get(Object.getPrototypeOf(ValidationError.prototype), "constructor", this).call(this);
    this.validations = validationResults;

    if (this.validations.length === 1) {
      this.message = this.validations[0].errorMessage();
    } else {
      var msg = "Several Validation Errors: [";
      msg += this.validations.map(function (v) {
        return v.errorMessage();
      }).join("], [");
      msg += "]";
      this.message = msg;
    }
  }

  _inherits(ValidationError, Error);

  return ValidationError;
})(Error);

ValidationError.prototype.name = "ValidationError";

var InvalidTypeError = (function (Error) {
  function InvalidTypeError(name, mappingType) {
    _classCallCheck(this, InvalidTypeError);

    _get(Object.getPrototypeOf(InvalidTypeError.prototype), "constructor", this).call(this);
    this.mappingName = name;
    this.mappingType = mappingType;
    this.message = "Couldn't find a MappingType for Mapping '" + this.mappingName + "' with type '" + this.mappingType + "'";
  }

  _inherits(InvalidTypeError, Error);

  return InvalidTypeError;
})(Error);

InvalidTypeError.prototype.name = "InvalidTypeError";

var InvalidArguments = (function (Error) {
  function InvalidArguments(pairs) {
    _classCallCheck(this, InvalidArguments);

    _get(Object.getPrototypeOf(InvalidArguments.prototype), "constructor", this).call(this);
    this.pairs = pairs;
    this.message = "Mappings with unresolvable arguments: [";
    this.message += this.pairs.map(function (p) {
      return "'" + p[0] + "' -> '" + p[1] + "'";
    }).join(",");
    this.message += "]";
  }

  _inherits(InvalidArguments, Error);

  return InvalidArguments;
})(Error);

InvalidArguments.prototype.name = "InvalidArguments";

module.exports = {
  ValidationError: ValidationError,
  InvalidTypeError: InvalidTypeError,
  InvalidArguments: InvalidArguments
};