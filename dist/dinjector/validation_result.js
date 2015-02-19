"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Validation Result of a Mapping
 *
 * @class ValidationResult
 * @member {Immutable.Set.<string>} extraKeys - mapping keys that are nor required nor optional
 * @member {Immutable.Set.<string>} missingKeys - required mapping keys that aren't present
 * @member {Immutable.Map.<object,string>} mapping - validated Mapping
 */
var ValidationResult = (function () {
  function ValidationResult(mapping) {
    var extraKeys = arguments[1] === undefined ? [] : arguments[1];
    var missingKeys = arguments[2] === undefined ? [] : arguments[2];
    _classCallCheck(this, ValidationResult);

    this.mapping = mapping;
    this.extraKeys = extraKeys;
    this.missingKeys = missingKeys;
  }

  _prototypeProperties(ValidationResult, null, {
    isValid: {


      /**
       * Indicates wether the validation result is valid or invalid.
       *
       * It's invalid when there are missingKeys or extraKeys.
       * 
       * @return {boolean} valid or invalid
       */
      value: function isValid() {
        return this.extraKeys.isEmpty() && this.missingKeys.isEmpty();
      },
      writable: true,
      configurable: true
    },
    errorMessage: {

      /**
       * Returns an error message that indicates the error for the case the result isn't valid.
       *
       * @return {string} error message
       */
      value: function errorMessage() {
        var msg = "Error with " + this.mapping.get("name") + ": ";
        if (this.missingKeys.count() > 0) {
          msg += "missingKeys (";
          msg += this.missingKeys.join(",");
          msg += ") ";
        }
        if (this.extraKeys.count() > 0) {
          msg += "extraKeys (";
          msg += this.extraKeys.join(",");
          msg += ") ";
        }
        return msg;
      },
      writable: true,
      configurable: true
    }
  });

  return ValidationResult;
})();

module.exports = ValidationResult;