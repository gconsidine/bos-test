![BlueOak Logo](https://github.com/BlueOakJS/blueoak-server/wiki/images/blueoak.png)

[![Build Status](https://travis-ci.org/gconsidine/bos-test.svg?branch=master)](https://travis-ci.org/gconsidine/bos-test)
[![Coverage Status](https://coveralls.io/repos/github/gconsidine/bos-test/badge.svg?branch=master)](https://coveralls.io/github/gconsidine/bos-test?branch=master)
[![Dependency Status](https://david-dm.org/gconsidine/bos-test.svg)](https://david-dm.org/gconsidine/bos-test)
[![Dev Dependency Status](https://david-dm.org/gconsidine/bos-test/dev-status.svg)](https://david-dm.org/gconsidine/bos-test#info=devDependencies)

A BlueOak Server project to help simplify your tests.

## Overview

**bo**s-**t**est (**bot**). Use **bot** to inject and configure your dependencies with a single call.

### Installation

`npm i -g bos-test`

### Configuration

Configure how **bot** should run in a `bot.config.js` file or create config objects in your tests.


```
module.exports = {
    includeByPath: [__dirname + '/services'],
    configs: [__dirname + '/config.one.json', __dirname + '/config.two.json'],
    logging: false
};
```

**includeByPath** `Array` - The path to any folder containing BlueOak services that are used in your tests


**config** `Array` - Paths to any configuration files that you\'d like to overlay on top of BlueOak's 
default configuration. The configuration file at `[n + 1]` always has precedence over `[n]`. If a config object 
is created in code and explicitly passed into the `inject` call, it will be applied on top of any config defined 
in file.

**logging** `Boolean` - All logging via BlueOak's logger service is silenced by default in the output of tests. To 
enable logging as usual, set this value to `true`.

Note:

  * Only absolute paths are supported in **bot** config objects

### Usage


**my-service.js**

```
var logger;

function init(_config_, _logger_) {
    logger = _logger_;      
    logger.info('I am a useless service');
}

function echo(msg) {
  return msg;
}

module.exports = {
    init: init,
    echo: echo
};
```

**test-my-service.js**
```
var bot = require('bos-test'),
    expect = bot.expect,
    botConfig = require('./bot.config');

 ...

bot.inject('my-service', botConfig).then(function (bos) {
    expect(bos.config).to.be.defined;
    expect(bos.logger).to.be.defined;
    expect(bos['my-service']).to.be.defined;

    expect(bos['my-service'].echo('hi')).to.equal('hi');

    done();
}).catch(done);

 ...

```

### API

  * `inject(serviceName [, botConfig [, overrideConfig]])`
     
    Inject a service and all its dependencies
     
  * `flush`

    Flush globally loaded services

  * `expose(pathToModule)`

    Requires and rewires a module to access private properties

  * `get(exposedModule, privateProperty`

    Returns a private property within a given rewired module

  * `set(exposedModule, privateProperty, value)`

    Assign a value to a private property of an exposed module


**Unaltered Chai interfaces**

  * `expect`
  * `should`
  * `assert`

**Unaltered Sinon interfaces**

  * `spy`
  * `stub`
  * `mock`

### Planned features

  * Optional and automatic spies for service methods
  * Optional and automatic stubbing of service methods
  * `rewire` services instead of `require` services for easy access to private properties

