# dinjector

A simple library to use dependency injection with your node code.

## Installation

Install using npm:

    npm install dinjector

## Basic Example

The dinjector package exposes two functions:
 - `loadContext(mappings, config)`: To load an application context
 - `loadTestContext(mappings, config)`: To load an application context for Testing purposes


A simple example:

```javascript
var ctx= injector.loadContext(
  {
    serviceB: {
      path: '/test/dummy/serviceB',
      type: 'singleton',
      arguments: ['serviceA']
    },
    serviceA: {
      path: '/test/dummy/serviceA',
      type: 'singleton',
      arguments: []
    }
  },
  {
      prefix: path.resolve(path.join(__dirname, "..")) // prefix to use when doing require()'s
  }
);

var serviceB = ctx.get('serviceB');
serviceB.doSomething();
```

## Usage & Configuration

To use dinjector in your project is really simple. Just define your object mappings an passed them to
`loadContext()` function.

The signature is `loadcontext(mappings, config)`.

Where `config` is just:

```javascript
{
  prefix: "prefix path to add to all relative requires"
}
```

and `mappings` is just an plain javascript object where each key represents a mapping name, and it's value the
configuration to create that object.

That is:

```javascript
{
 'objectA': {... },
 'objectB': {... },
 'objectC': {... },
 'objectD': {... }
}
```

A valid `mappings` is:

```javascript
{
  serviceB: {
    path: '/test/dummy/serviceB',
    type: 'singleton',
    arguments: ['serviceA']
  },
  serviceA: {
    path: '/test/dummy/serviceA',
    type: 'singleton',
    arguments: []
  }
}
```

where `serviceA` and `serviceB` are mapping names and their values the definition. There are several mapping
types and each has a different options. They are explained below


### Mappings

All mappings have a `type` property that specifies the mappingType for it. Also, is really simple to add new
mapping types to an AppContext in case you want to define some custom type.

Valid types are:

  * singleton
  * function
  * module
  * inline

Also, all mapping types can have a property `cache` that indicates wether the object creation result should
or shouldn't be cached. The default value is `false`, with the exception of the `singleton` type where is
`true` by default.

#### Type: singleton

For objects to be created with `new` keyword and cached afterward.

valid keys for `singleton` are:

 * path: [required] path to use when doing require() for module
 * property: [optional] name of the module's property that refers to the obj (optional)
 * arguments: [optional] array with paramenters and dependencies to inject on creation
 * cache: [optional, default=true] wether to cache the created object or not

Example:
```javascript
serviceB: {
  path: '/test/dummy/serviceB',
  type: 'singleton',
  arguments: ['serviceA']
}
```

where the `serviceB.js` modules looks like:
```javascript
class ServiceB {
  constructor(serviceA) {
  }
}
module.exports = ServiceB;
```

#### Type: function

When instead of creating and object with `new`, we create it by calling a function.

valid keys for `function` are:

 * path: [required] path to use when doing require() for module
 * property: [optional] name of the module's property that refers to the obj (optional)
 * arguments: [optional] array with paramenters and dependencies to inject on creation
 * cache: [optional, default=true] wether to cache the created object or not

Example:
```javascript
myFunction: {
  path: '/test/dummy/myFunction',
  type: 'function',
  arguments: ['serviceA']
}
```

where the `myfunction.js` modules looks like:
```javascript
module.exports = function(serviceA, arg2, arg3) {
 return //something
};
```

#### Type: module

When you need to access the module exports or a property within the exports.

valid keys for `module` are:

 * path: [required] path to use when doing require() for module
 * property: [optional] name of the module's property that refers to the obj (optional)
 * cache: [optional, default=true] wether to cache the created object or not

Example:
```javascript
myFunction: {
  type: 'module',
  path: '/test/dummy/myFunction'
}
```

where the `myfunction.js` modules looks like:
```javascript
module.exports = function(serviceA, arg2, arg3) {
 return //something
};
```

#### Type: inline

When we want to specify how to create an object with an inline function.

valid keys for `inline` are:

 * createFn: [required] a function that receive resolved arguments, and returns the created object.
 * arguments: [optional] array with paramenters and dependencies to inject on creation
 * cache: [optional, default=true] wether to cache the created object or not

Example:
```javascript
myFunction: {
  type: 'inline',
  cache: true,
  arguments: ['serviceA'],
  createFn: function(serviceA) {
    return some object;
  }
}
```

### Absolute vs. Relative requires

For all the mapping types that use the `path` property to specify what to require, you can choose wether to
do an absolute require or a relative require.

Relative is to be used to require a module within your project. The specified path must start with '/' and is
relative to the configure `prefix`.

Absolute path is to be used to require a module you have on your package.json dependencies.

Example of use absolute path to load environment config options:

```javascript
config: {
  type: 'module',
  path: 'config'

}
```

### Arguments Resolvers

Each member of the mapping's `arguments` array is resolved using an argument's resolver. There are several
types of argument's resolver, and only one will be applied to a given argument. The resolvers to be used are
defined by default, but you can change the list of resolvers to use, and create new ones.

The default conversion rules to apply are:

 * For `numbers` or `booleans`: the value is returned (no conversion takes places)
 * For a string of form `mappingName` where mappingName doesn't contain ':': resolves to a mapping
 * For a string of form `mappingName:property1.subprop2`: resolves to the properties of a mapping
 * For a string of form `$str:AString`: resolve to the string after the "$str:" prefix
 * For a `array`: resolves to an array where the members are resolved using the argumentsResolver
 * For an `object`: resolves to an object where the values are resolved using the argumentsResolver
 * For the string `$ctx`: resolves to the appContext instance

Some examples:
```javascript
arguments: [1,2,true, '$str:hello world'] // resolves to [1,2,true, 'hello world']
arguments: ['serviceA'] // resolves to [ctx.get('serviceA')]
arguments: ['config:redis.url'] // resolves to [ctx.ger('config').redis.url]
arguments: [{ url: 'config:redis.url', port: 'config:redis.port'}] // resolves to [{ url: ctx.get('config').redis.url, port: ctx.get('config').redis.port}]
arguments: [[1,2,'serviceA'], true] // resolves to [[1,2,ctx.get('serviceA')], true]
arguments: ['$ctx'] // resolves to [ctx]
```

### Testing

When testing it's useful to be able to override some mapping configuration, just to do the testing.
So, loadTestContext(), returns a context with some added features:

 - `reset()`: Resets the context's cache
 - `set(key, obj)`: Sets/Overrides a mapping, with the given object. The object is stored in the cache.
