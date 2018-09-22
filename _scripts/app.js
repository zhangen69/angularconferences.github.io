(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.apollo = factory();
  }
})(window, function() {
  'use strict';
  var apollo = {};

  var hasClass, addClass, removeClass, toggleClass;

  var forEach = function(items, fn) {
    if (Object.prototype.toString.call(items) !== '[object Array]') {
      items = items.split(' ');
    }
    for (var i = 0; i < items.length; i++) {
      fn(items[i], i);
    }
  };

  if ('classList' in document.documentElement) {
    hasClass = function(elem, className) {
      return elem.classList.contains(className);
    };
    addClass = function(elem, className) {
      elem.classList.add(className);
    };
    removeClass = function(elem, className) {
      elem.classList.remove(className);
    };
    toggleClass = function(elem, className) {
      elem.classList.toggle(className);
    };
  } else {
    hasClass = function(elem, className) {
      return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
    };
    addClass = function(elem, className) {
      if (!hasClass(elem, className)) {
        elem.className += (elem.className ? ' ' : '') + className;
      }
    };
    removeClass = function(elem, className) {
      if (hasClass(elem, className)) {
        elem.className = elem.className.replace(
          new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'),
          ''
        );
      }
    };
    toggleClass = function(elem, className) {
      (hasClass(elem, className) ? removeClass : addClass)(elem, className);
    };
  }

  apollo.hasClass = function(elem, className) {
    return hasClass(elem, className);
  };

  apollo.addClass = function(elem, classes) {
    forEach(classes, function(className) {
      addClass(elem, className);
    });
  };

  apollo.removeClass = function(elem, classes) {
    forEach(classes, function(className) {
      removeClass(elem, className);
    });
  };

  apollo.toggleClass = function(elem, classes) {
    forEach(classes, function(className) {
      toggleClass(elem, className);
    });
  };

  return apollo;
});

((window, document, undefined) => {
  const $ = document.querySelector.bind(document);
  const $$ = (selector, scope = document) =>
    Array.prototype.slice.call(scope.querySelectorAll(selector));

  const members = $$('.ac-conf');

  function bindFilters(item) {
    const filter = item.querySelector('.ac-conf-filters');
    const VISIBILITY = 'data-visibility';
    const EVENT_TYPE = 'data-event-type';

    filter.addEventListener(
      'click',
      function(event) {
        event.preventDefault();
        const { target } = event;
        const value = target.getAttribute(`${VISIBILITY}`);
        const buttons = $$(`[${VISIBILITY}]`, target.parentNode);
        const confs = $$(`[${EVENT_TYPE}]`, item);

        buttons.map(button => apollo.removeClass(button, 'active'));
        apollo.addClass(target, 'active');

        switch (value) {
          case 'all': {
            confs.map(conf => apollo.addClass(conf, 'active'));
            break;
          }
          case 'conference':
          case 'meetup': {
            confs.map(conf => {
              if (conf.getAttribute(`${EVENT_TYPE}`) === value) {
                apollo.addClass(conf, 'active');
              } else {
                apollo.removeClass(conf, 'active');
              }
            });
            break;
          }
        }
      },
      false
    );
  }

  function initMembers(item) {
    const items = $$('.toggle-modal', item);
    const modals = $$('.modal', item);
    const overlay = document.querySelector('.overlay');
    const main = document.querySelector('.main');

    const CLASSES = {
      MODAL: 'modal--open',
      OVERLAY: 'overlay--open',
      BODY: 'modal--is-open',
      MAIN: 'main--open',
    };

    function cleanUp() {
      apollo.removeClass(overlay, CLASSES.OVERLAY);
      apollo.removeClass(document.body, CLASSES.BODY);
      apollo.removeClass(main, CLASSES.MAIN);
      modals.map(modal => apollo.removeClass(modal, CLASSES.MODAL));
    }

    overlay.addEventListener(
      'click',
      function(event) {
        cleanUp();
      },
      false
    );

    document.addEventListener(
      'keyup',
      function(event) {
        if (event.keyCode === 27) {
          event.preventDefault();
          cleanUp();
        }
      },
      true
    );

    function bindMemberEvents(member, index) {
      member.addEventListener(
        'click',
        function(event) {
          event.preventDefault();
          modals.map(modal => apollo.removeClass(modal, CLASSES.MODAL));
          const idx = modals[index];
          if (idx) {
            apollo.toggleClass(idx, CLASSES.MODAL);
          }
          apollo.toggleClass(overlay, CLASSES.OVERLAY);
          apollo.toggleClass(document.body, CLASSES.BODY);
          apollo.toggleClass(main, CLASSES.MAIN);
        },
        false
      );
    }

    items.map(bindMemberEvents);
  }

  if (members) {
    members.map(initMembers);
    members.map(bindFilters);
  }
})(window, document);
