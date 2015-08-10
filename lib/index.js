import MappingTypes from './types';
import * as resolvers from './argument_resolvers';
import AppContext from './context/app_context';
import TestContext from './context/test_context';

const BaseResolvers = [
  resolvers.arrayResolver,
  resolvers.objectResolver,
  resolvers.stringResolver,
  resolvers.numberResolver,
  resolvers.booleanResolver,
  resolvers.propertyResolver
];


export function loadContext(mappings, config) {
  const mappingTypes = [
    new MappingTypes.InlineType(),
    new MappingTypes.FunctionType(config.prefix),
    new MappingTypes.SingletonType(config.prefix),
    new MappingTypes.ModuleType(config.prefix)
  ];

  return new AppContext(mappings, mappingTypes, BaseResolvers);
}

export function loadTestContext(mappings, config) {
  const mappingTypes = [
    new MappingTypes.InlineType(),
    new MappingTypes.FunctionType(config.prefix),
    new MappingTypes.SingletonType(config.prefix),
    new MappingTypes.ModuleType(config.prefix)
  ];
  return new TestContext(mappings, mappingTypes, BaseResolvers);
}
