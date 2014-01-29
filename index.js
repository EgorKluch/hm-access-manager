/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.01.14
 */

'use strict';

var AccessManager = function () {
  this.handlers = {
    'default': function (action, args, next) {
      next(null, true);
    }
  };
  this.prepareHandlers = {
    'default': function (action, args, next) {
      next(null, args);
    }
  };
};

AccessManager.prototype.prepareHandle = function (action, prepareHandler) {
  this._regHandler(action, prepareHandler, this.prepareHandlers);
};

AccessManager.prototype.handle = function (action, handler) {
  this._regHandler(action, handler, this.handlers);
};

AccessManager.prototype._regHandler = function (action, handler, container) {
  var self = this;

  if (action instanceof Array) {
    return action.forEach(function (act) {
      self._regHandler(act, handler, container);
    });
  }

  if (action instanceof Function) {
    handler = action;
    action = 'default';
  }

  if (!action) action = 'default';
  container[action] = handler;
};

AccessManager.prototype.hasAccess = function (action, args, next) {
  var self = this;

  var prepareAction = action;
  if (!this.prepareHandlers.hasOwnProperty(prepareAction)) {
    prepareAction = 'default';
  }

  this.prepareHandlers[prepareAction](action, args, function (err, args) {
    if (err) return next(err);

    if (!self.handlers.hasOwnProperty(action)) {
      action = 'default';
    }

    self.handlers[action](action, args, next);
  });
};


module.exports = AccessManager;
