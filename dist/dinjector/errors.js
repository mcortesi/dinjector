"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationError = (function (_Error) {
  _inherits(ValidationError, _Error);

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

  return ValidationError;
})(Error);

exports.ValidationError = ValidationError;

ValidationError.prototype.name = 'ValidationError';

var InvalidTypeError = (function (_Error2) {
  _inherits(InvalidTypeError, _Error2);

  function InvalidTypeError(name, mappingType) {
    _classCallCheck(this, InvalidTypeError);

    _get(Object.getPrototypeOf(InvalidTypeError.prototype), "constructor", this).call(this);
    this.mappingName = name;
    this.mappingType = mappingType;
    this.message = "Couldn't find a MappingType for Mapping '" + this.mappingName + "' with type '" + this.mappingType + "'";
  }

  return InvalidTypeError;
})(Error);

exports.InvalidTypeError = InvalidTypeError;

InvalidTypeError.prototype.name = 'InvalidTypeError';

var InvalidArguments = (function (_Error3) {
  _inherits(InvalidArguments, _Error3);

  function InvalidArguments(pairs) {
    _classCallCheck(this, InvalidArguments);

    _get(Object.getPrototypeOf(InvalidArguments.prototype), "constructor", this).call(this);
    this.pairs = pairs;
    this.message = 'Mappings with unresolvable arguments: [';
    this.message += this.pairs.map(function (p) {
      return "'" + p[0] + "' -> '" + p[1] + "'";
    }).join(',');
    this.message += "]";
  }

  return InvalidArguments;
})(Error);

exports.InvalidArguments = InvalidArguments;

InvalidArguments.prototype.name = 'InvalidArguments';
