'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _abstract_type = require('./abstract_type');

var _abstract_type2 = _interopRequireDefault(_abstract_type);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Abstract Mapping type with require() support.
 *
 * It handles the _resolveObjectCreator() method by
 * doing a require() to a given path.
 *
 * It supports absolute path and relative paths. Relative paths are prefixed by the given basePath
 * in the constructor.
 *
 * If mapping has a property key, it uses it to retrieve such property from the require result.
 *
 * Additional Keys:
 *  - path: [required] - path to the module to require
 *  - property: [optional] - name of the module's property to return
 */

var AbstractRequireType = (function (_AbstractType) {
  _inherits(AbstractRequireType, _AbstractType);

  function AbstractRequireType(basePath, name) {
    var requiredKeys = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
    var optionalKeys = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
    var defaultValues = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

    _classCallCheck(this, AbstractRequireType);

    _get(Object.getPrototypeOf(AbstractRequireType.prototype), 'constructor', this).call(this, name, _immutable2['default'].Set.of('path').union(requiredKeys), _immutable2['default'].Set.of('property').union(requiredKeys), defaultValues);
    this.basePath = basePath;
  }

  _createClass(AbstractRequireType, [{
    key: '_resolveObjectCreator',
    value: function _resolveObjectCreator(mapping) {
      var keyObject = undefined,
          requirePath = undefined;

      if (_lodash2['default'].startsWith(mapping.get('path'), '/')) {
        requirePath = this.basePath + mapping.get('path');
      } else {
        requirePath = mapping.get('path');
      }

      var moduleObj = require(requirePath);

      if (mapping.has('property')) {
        keyObject = moduleObj[mapping.get('property')];
      } else {
        keyObject = moduleObj;
      }
      return keyObject;
    }
  }]);

  return AbstractRequireType;
})(_abstract_type2['default']);

module.exports = AbstractRequireType;
