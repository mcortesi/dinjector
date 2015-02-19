"use strict";

var MappingTypes = require("./types");
var resolvers = require("./argument_resolvers");
var AppContext = require("./context/app_context");
var TestContext = require("./context/test_context");

var baseResolvers = [resolvers.arrayResolver, resolvers.objectResolver, resolvers.stringResolver, resolvers.numberResolver, resolvers.booleanResolver, resolvers.propertyResolver];

module.exports = {
  loadContext: function loadContext(mappings, config) {
    var mappingTypes = [new MappingTypes.InlineType(), new MappingTypes.FunctionType(config.prefix), new MappingTypes.SingletonType(config.prefix), new MappingTypes.ModuleType(config.prefix)];

    return new AppContext(mappings, mappingTypes, baseResolvers);
  },

  loadTestContext: function loadTestContext(mappings, config) {
    var mappingTypes = [new MappingTypes.InlineType(), new MappingTypes.FunctionType(config.prefix), new MappingTypes.SingletonType(config.prefix), new MappingTypes.ModuleType(config.prefix)];
    return new TestContext(mappings, mappingTypes, baseResolvers);
  }
};