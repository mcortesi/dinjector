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

  constructor(mapping, extraKeys, missingKeys) {
    this.mapping = mapping;
    this.extraKeys = extraKeys;
    this.missingKeys = missingKeys;
  }


  /**
   * Indicates wether the validation result is valid or invalid.
   *
   * It's invalid when there are missingKeys or extraKeys.
   * 
   * @return {boolean} - valid or invalid
   */
  isValid() {
    return this.extraKeys.isEmpty() && this.missingKeys.isEmpty();
  }
}

module.exports = ValidationResult;
