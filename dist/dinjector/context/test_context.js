'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var AppContext = require('./app_context');

/**
 * Application Context for tests.
 *
 * It adds support to reset the context
 * and to override a definition.
 */

var TestContext = (function (_AppContext) {
  _inherits(TestContext, _AppContext);

  function TestContext(mappings, mappingTypes) {
    var argumentResolvers = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    _classCallCheck(this, TestContext);

    _get(Object.getPrototypeOf(TestContext.prototype), 'constructor', this).call(this, mappings, mappingTypes, argumentResolvers);
  }

  _createClass(TestContext, [{
    key: 'reset',
    value: function reset() {
      var _this = this;

      var whiteList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var oldCache = this.cache;
      this.cache = _immutable2['default'].Map();
      whiteList.forEach(function (key) {
        if (oldCache.has(key)) {
          _this.cache = _this.cache.set(key, oldCache.get(key));
        }
      });
    }
  }, {
    key: 'set',
    value: function set(key, object) {
      this.cache = this.cache.set(key, object);
    }
  }]);

  return TestContext;
})(AppContext);

module.exports = TestContext;
