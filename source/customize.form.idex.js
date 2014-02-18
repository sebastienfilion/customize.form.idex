    /* global idex */

    // TODO Allow to not cutomize on name/type

    var templates, makers;

    templates = {
        box: '<div></div>',
        button: '<a href="" title="{{ value }}">{{ value }}</a>',
        select: '' +
            '<div class="select">' +
            '<div class="select-selected" data-element="selected">{{ selected }}</div>' +
            '<div class="select-dropdown" data-element="dropdown">' +
            '<ul>' +
            '{{ #options }}' +
            '<li data-value="{{ value }}" data-element="option"">{{ text }}</li>' +
            '{{ /options }}' +
            '</ul>' +
            '</div>' +
            '</div>'
    };

    /**
     *
     * @param element {DOM element} The element to use as reference.
     * @param options {object} [optional] The options to merge with the configs. See documentation.
     * @returns {Prototype}
     * @constructor
     *
     */
    function Prototype(element, options) {
        var configurations;

        configurations = {
            'callbacks': {},
            'template': '',
            'classes': {
                'active': 'active',
                'focus': 'focus',
                'hide': 'hide'
            },
            'attributes': ['name', 'id', 'class', 'value']
        };

        this.element = element;
        this.configs = configurations;

        this.configs = idex.merge(this.configs, options);

        return this;
    }

    Prototype.prototype = {
        /**
         *
         * @param callback [optional] Function to call after the initialization... You know a callback.
         * @param templateArgument [optional] Arguments to pass to the templating engine.
         * @returns {Prototype}
         *
         */
        'initialize': function() {
            var tempElement, templateArguments, callback;

            for (var argument in arguments) {
                var currentArgument = arguments[argument];

                if (currentArgument instanceof Function) {
                    callback = currentArgument;
                } else if (currentArgument instanceof Object) {
                    templateArguments = currentArgument;
                }
            }

            if (!templateArguments) {
                templateArguments = {};
            }

            // Create a temporary element
            tempElement = document.createElement('div');

            // Append the rendered template to the temporary element
            tempElement.innerHTML = idex.render(this.configs.template, templateArguments);

            // Loop through the attribute of the element to add them to the new element
            for (var attribute in this.configs.attributes) {
                var currentAttribute = this.configs.attributes[attribute];

                if (currentAttribute === 'class' && this.element.className !== "") {
                    tempElement.childNodes[0].className = this.element.className;
                } else if (this.element.hasAttribute(currentAttribute)) {
                    tempElement.childNodes[0].setAttribute('data-' + currentAttribute, this.element[currentAttribute]);
                }
            }

            // Store the new custom element to the object
            this.customElement = tempElement.childNodes[0];

            // Append the new custom element next to the original element
            this.element.parentNode.insertBefore(this.customElement, this.element.nextSibling);

            // Hide the original element from the document flow
            // Allows it to still be tabable, not it's not a word...
            this.element.style.position = "absolute";
            this.element.style.left = "-9999px";

            if (callback) callback.apply(this);

            return this;
        }
    };

    // The makers object will help to create easily more custom object
    // TODO Think of building a function idex.customize.addMaker();
    makers = window.makers || {};

    // RADIO AND CHECKBOXES
    makers.box = function(options) {
        if (!options.hasOwnProperty('template')) {
            options.template = templates.box;
        }

        var element, p;

        element = this;

        //console.log(this);

        p = new Prototype(element, options);

        p.initialize(function() {
            // Add the type to the class to the element
            idex.addClass(this.customElement, this.element.type);

            // Handle when the element change
            idex.on(this.element, 'change', function() {
                // Apply user callback
                if (p.configs.callbacks.hasOwnProperty('beforechange')) p.configs.callbacks.beforechange.apply(p.element);

                if (element.type === 'radio') {
                    var siblings = document.querySelectorAll('[data-name="' + element.name + '"]');

                    if (siblings.length) {
                        for (var index = 0; index < siblings.length; index++) {
                            idex.removeClass(siblings[index], p.configs.classes.active);
                        }
                    }
                }

                if (p.element.checked) {
                    idex.addClass(p.customElement, p.configs.classes.active);
                } else {
                    idex.removeClass(p.customElement, p.configs.classes.active);
                }

                // Apply user callback
                if (p.configs.callbacks.hasOwnProperty('afterchange')) p.configs.callbacks.afterchange.apply(p.element);
            });
            // Handle when the element is focused
            idex.on(this.element, 'focus', function() {
                idex.addClass(p.customElement, p.configs.classes.focus);
            });
            // Handle when the element is blured
            idex.on(this.element, 'blur', function() {
                idex.removeClass(p.customElement, p.configs.classes.focus);
            });
            // Handle when the custom element is clicked
            idex.on(this.customElement, 'click', function() {
                if (idex.hasClass(p.customElement, p.configs.classes.active)) {
                    p.element.checked = false;
                } else {
                    p.element.checked = true;
                }

                idex.fire(p.element, 'change');
            });
        });
    };

    // SUBMIT BUTTON
    makers.submit = function(options) {
        if (!options.hasOwnProperty('template')) {
            options.template = templates.button;
        }

        var element, p;

        element = this;

        p = new Prototype(element, options);

        //var value;

        value = this.value;

        p.initialize({ value: value }, function() {
            // Handle when the custom element is clicked
            idex.on(this.customElement, 'click', function(event) {
                idex.preventDefault(event);

                idex.fire(p.element, 'click');
            });

        });
    };

    // SELECT MENU
    makers.select = function(options) {
        if (!options.hasOwnProperty('template')) {
            // selected: element where the selected element text can be entered
            // dropdown: the object that is the dropdown
            // option: element where the option text goes with the value...

            options.template = templates.select;
        }

        var element, p;

        element = this;

        p = new Prototype(element, options);

        var optionsProperties, selected;

        optionsProperties = [];

        for (var index = 0; index < element.length; index++) {
            var text/*, value*/;

            text = element[index].textContent || element[index].text;
            value = element[index].value;

            if (element[index].selected) {
                selected = element[index].text || element[index].textContent;
            }

            optionsProperties.push({
                'text': text,
                'value': value
            });
        }

        p.initialize({
            'selected': selected,
            'options': optionsProperties
        }, function() {
            var selectedCustomElement, dropdownCustomElement, optionsCustomElements;

            selectedCustomElement = this.customElement.querySelector('[data-element="selected"]');
            dropdownCustomElement = this.customElement.querySelector('[data-element="dropdown"]');
            optionsCustomElements = this.customElement.querySelectorAll('[data-element="option"]');

            function openDrodown() {
                idex.removeClass(dropdownCustomElement, p.configs.classes.hide);
            }

            function closeDropdown() {
                window.setTimeout(function() {
                    idex.addClass(dropdownCustomElement, p.configs.classes.hide);
                }, 200);
            }

            function toggleDropdown() {
                if (idex.hasClass(dropdownCustomElement, p.configs.classes.hide)) {
                    openDrodown();
                } else {
                    closeDropdown();
                }
            }

            function retrieveIndex(value) {
                for (var index = 0; index < p.element.length; index++) {
                    if (p.element[index].value === value) {
                        return index;
                    }
                }
            }

            function handleClickOnOptions(event) {
                var value;

                value = event.currentTarget.getAttribute('data-value');

                p.element.selectedIndex = retrieveIndex(value);

                idex.fire(p.element, 'change');
            }

            // Handle when the element change
            idex.on(this.element, 'change', function() {
                // Apply user callback
                if (p.configs.callbacks.hasOwnProperty('beforechange')) p.configs.callbacks.beforechange.apply(p.element);

                var selectedIndex, selectedOptionCustomElement;

                selectedIndex = p.element.selectedIndex;

                selectedOptionCustomElement = optionsCustomElements[p.element.selectedIndex];

                idex.removeClass(optionsCustomElements, p.configs.classes.active);
                idex.addClass(selectedOptionCustomElement, p.configs.classes.active);

                selectedCustomElement.innerText = p.element[selectedIndex].text || p.element[selectedIndex].textContent;

                // Apply user callback
                if (p.configs.callbacks.hasOwnProperty('afterchange')) p.configs.callbacks.afterchange.apply(p.element);
            });

            // Handle when the element is focused
            idex.on(this.element, 'focus', function() {
                idex.addClass(p.customElement, p.configs.classes.focus);
                openDrodown();
            });
            // Handle when the element is blured
            idex.on(this.element, 'blur', function() {
                idex.removeClass(p.customElement, p.configs.classes.focus);
                closeDropdown();
            });
            // Handle when the custom element is clicked
            if (selectedCustomElement) {
                idex.on(selectedCustomElement, 'click', function() {
                    p.element.focus();
                });

            }

            // Loop through the custom option elements to bind a click
            for (var index = 0; index < optionsCustomElements.length; index++) {
                idex.on(optionsCustomElements[index], 'click', handleClickOnOptions);

            }

            closeDropdown();
        });
    };

    /**
     *
     * @param elements The elements to customize. See documentation.
     * @param options [optional] The options for the element group. See documentation.
     * @returns {Prototype}
     *
     */
    idex.customize = function(elements, options) {
        if (!elements)
            throw new Error("No element was submitted...");

        function process(element, opts) {
            var p, value;

            // Sometime if a user pass a form as a jQuery object, the form will be sent instead of its children...
            if (element.tagName === 'FORM') {
                idex.customize(element, options);
            }

            if (element.tagName === 'INPUT') {
                // Slightly repetitive but allows to easily add more input elements
                if (element.type !== 'radio' && element.type !== 'checkbox' && element.type !== 'submit' && element.type !== 'button') {
                    return false;
                }

                if (element.type === 'radio' || element.type === 'checkbox') {
                    makers.box.call(element, [opts]);
                } else if (element.type === 'submit' || element.type === 'button') {
                    makers.submit.call(element, [opts]);
                }
            } else if (element.tagName === 'SELECT' ) {
                makers.select.call(element, [opts]);
            }

            //return p;
        }

        if (elements.length) {
            for (var index = 0; index < elements.length; index++) {
                var opt, optName, optType;

                opt = {};

                // Check if there's options specific to the name
                if (options && options.hasOwnProperty(elements[index].name)) {
                    optName = options[elements[index].name];

                    opt = idex.merge(opt, optName);
                }

                // Check if there's options specific to the type
                if (options && options.hasOwnProperty(elements[index].type)) {
                    optType = options[elements[index].type];

                    opt = idex.merge(opt, optType);
                }

                process(elements[index], opt);
            }
        } else {
            process(elements, options);
        }

        return elements;
    };