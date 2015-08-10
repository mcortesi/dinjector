
export class ValidationError extends Error {

  constructor(validationResults) {
    super();
    this.validations = validationResults;

    if (this.validations.length === 1) {
      this.message = this.validations[0].errorMessage();
    } else {
      var msg = "Several Validation Errors: [";
      msg += this.validations.map( v => v.errorMessage()).join("], [");
      msg += "]";
      this.message = msg;
    }
  }
}
ValidationError.prototype.name = 'ValidationError';

export class InvalidTypeError extends Error {

  constructor(name, mappingType) {
    super();
    this.mappingName = name;
    this.mappingType = mappingType;
    this.message = `Couldn\'t find a MappingType for Mapping '${this.mappingName}' with type '${this.mappingType}'`;
  }
}
InvalidTypeError.prototype.name = 'InvalidTypeError';

export class InvalidArguments extends Error {

  constructor(pairs) {
    super();
    this.pairs = pairs;
    this.message = 'Mappings with unresolvable arguments: [';
    this.message += this.pairs.map( p => `'${p[0]}' -> '${p[1]}'`).join(',');
    this.message += "]";
  }
}

InvalidArguments.prototype.name = 'InvalidArguments';
