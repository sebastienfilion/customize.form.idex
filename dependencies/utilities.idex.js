    if (!idex.hasOwnProperty('render')) {
        /**
         *
         * @param s {string}
         * @param o {object}
         * @returns {DOM element}
         *
         */
        idex.render = function(s, o) {
            return window.Mustache.render(s, o);
        };
    }

    if (!idex.hasOwnProperty('addClass')) {
        idex.addClass = function(es, c) {
            function p(e) {
                if (!idex.hasClass(e, c)) {
                    e.className = e.className + " " + c;
                }
            }

            if (es.hasOwnProperty('length')) {
                for (var i = 0; i < es.length; i++) {
                    p(es[i]);
                }
            } else {
                p(es);
            }
        };
    }

    if (!idex.hasOwnProperty('removeClass')) {
        idex.removeClass = function(es, c) {
            function p(e) {
                e.className = e.className.replace(
                    new RegExp('(^|\\s+)' + c + '(\\s+|$)', 'g'),
                    '$1'
                );
            }

            if (es.length) {
                for (var i = 0; i < es.length; i++) {
                    p(es[i]);
                }
            } else {
                p(es);
            }
        };
    }

    if (!idex.hasOwnProperty('hasClass')) {
        idex.hasClass = function(e, c) {
            var className = " " + c + " ",
                rclass = /[\t\r\n\f]/g;

            if ( e.nodeType === 1 && (" " + e.className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                return true;
            }

            return false;
        };
    }

    if (!idex.hasOwnProperty('on')) {
        idex.on = function(element, event, fn) {
            if (element.addEventListener) {
                element.addEventListener(event, fn, false);
            } else {
                element.attachEvent('on' + event, function() {
                    return(fn.call(element, window.event));
                });
            }
        };
    }

    if (!idex.hasOwnProperty('fire')) {
        idex.fire = function(element, event) {
            if (document.createEvent){
                // dispatch for firefox + others
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true ); // event type,bubbling,cancelable
                return !element.dispatchEvent(evt);
            }
            else{
                // dispatch for IE
                var evt = document.createEventObject();
                return element.fireEvent('on' + event, evt)

            }
        }
    }

    if (!idex.hasOwnProperty('preventDefault')) {
        idex.preventDefault = function(event) {
            // If preventDefault exists, run it on the original event
            if ( event.preventDefault ) {
                event.preventDefault();

                // Support: IE
                // Otherwise set the returnValue property of the original event to false
            } else {
                event.returnValue = false;
            }
        }
    }