'use strict';

/**
 * Validation Result of a Mapping
 *
 * @class ValidationResult
 * @member {Immutable.Set.<string>} extraKeys - mapping keys that are nor required nor optional
 * @member {Immutable.Set.<string>} missingKeys - required mapping keys that aren't present
 * @member {Immutable.Map.<object,string>} mapping - validated Mapping
 */
class ValidationResult {

  constructor(mapping, extraKeys = [], missingKeys = []) {
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
  isValid() {
    return this.extraKeys.isEmpty() && this.missingKeys.isEmpty();
  }

  /**
   * Returns an error message that indicates the error for the case the result isn't valid.
   *
   * @return {string} error message
   */
  errorMessage() {
    var msg = `Error with ${this.mapping.get('name')}: `;
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
}

module.exports = ValidationResult;
