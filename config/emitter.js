'use strict';

/**
 * This module exports a singleton event emitter to use throughout the app
 */

var EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
var emitter = new MyEmitter();

module.exports = emitter;