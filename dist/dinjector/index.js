'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadContext = loadContext;
exports.loadTestContext = loadTestContext;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _argument_resolvers = require('./argument_resolvers');

var resolvers = _interopRequireWildcard(_argument_resolvers);

var _contextApp_context = require('./context/app_context');

var _contextApp_context2 = _interopRequireDefault(_contextApp_context);

var _contextTest_context = require('./context/test_context');

var _contextTest_context2 = _interopRequireDefault(_contextTest_context);

var BaseResolvers = [resolvers.arrayResolver, resolvers.objectResolver, resolvers.stringResolver, resolvers.numberResolver, resolvers.booleanResolver, resolvers.propertyResolver];

function loadContext(mappings, config) {
  var mappingTypes = [new _types2['default'].InlineType(), new _types2['default'].FunctionType(config.prefix), new _types2['default'].SingletonType(config.prefix), new _types2['default'].ModuleType(config.prefix)];

  return new _contextApp_context2['default'](mappings, mappingTypes, BaseResolvers);
}

function loadTestContext(mappings, config) {
  var mappingTypes = [new _types2['default'].InlineType(), new _types2['default'].FunctionType(config.prefix), new _types2['default'].SingletonType(config.prefix), new _types2['default'].ModuleType(config.prefix)];
  return new _contextTest_context2['default'](mappings, mappingTypes, BaseResolvers);
}
