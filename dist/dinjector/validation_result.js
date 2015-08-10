
/**
 * Validation Result of a Mapping
 *
 * @class ValidationResult
 * @member {Immutable.Set.<string>} extraKeys - mapping keys that are nor required nor optional
 * @member {Immutable.Set.<string>} missingKeys - required mapping keys that aren't present
 * @member {Immutable.Map.<object,string>} mapping - validated Mapping
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationResult = (function () {
  function ValidationResult(mapping) {
    var extraKeys = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var missingKeys = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, ValidationResult);

    this.mapping = mapping;
    this.extraKeys = extraKeys;
    this.missingKeys = missingKeys;
  }

  /**
   * Indicates wether the validation result is valid or invalid.
   *
   * It's invalid when there are missingKeys or extraKeys.
   *
   * @return {boolean} valid or invalid
   */

  _createClass(ValidationResult, [{
    key: "isValid",
    value: function isValid() {
      return this.extraKeys.isEmpty() && this.missingKeys.isEmpty();
    }

    /**
     * Returns an error message that indicates the error for the case the result isn't valid.
     *
     * @return {string} error message
     */
  }, {
    key: "errorMessage",
    value: function errorMessage() {
      var msg = "Error with " + this.mapping.get('name') + ": ";
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
    }
  }]);

  return ValidationResult;
})();

exports["default"] = ValidationResult;
module.exports = exports["default"];
