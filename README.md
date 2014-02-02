### IDEX
# Customize form element

> Tested on Safari 7.0.1, Chrome 32, Firefox 26 and IExplorer 9

This simple library allows to easily customize form elements like radio buttons, checkboxes and select menu. It is easy to configure and will look exactly like you want it. Oh and it is accessible!

**[DEMO](http://demo.idesignexperiences.com/customize-form)**


## Usage

### Very basic usage

```js
var form = document.getElementsByTagName('form');

idex.customize(form);
```

Voilà! That was easy. With this simple code, all the customizable elements of your form has been replaced by a simple HTML structure that will be easy to stylize in CSS...

Ok, let's do more!

The ```idex.customize``` function takes two arguments an ```elemen [DOM element or jQuery]``` and the ```options [object]```. And here's the magic.

* * *

### The options

#### Callbacks ```[object function]```

First, there's the callbacks. The callbacks option takes an object with two properties (both optional): ```beforechange``` and ```afterchange```. Like their name suggest, the first one is called before the value of the form element is changes, the second is called after.

```js
var form = document.getElementsByTagName('form');

idex.customize(form, {
    callbacks: {
        beforechange: function() {
            // this is the element targeted
            console.log("The current value is " + this.value);
        },
        afterchange: function() {
            console.log("The new value is " + this.value);
        }
    }
});
```

#### Template ```[string]```

Here's the biggest part of the fun. Every elements can be supplied with a template to represent it.

By the default, the element will be served one of three template:

##### Box

```html
<div></div>
```
*Used for radiobuttons and checkboxes*

##### Button

```html
<a href="" title="{{ value }}">{{ value }}</a>
```
*Used for button and submit type inputs*

##### Select

```html
<div class="select">
    <div class="select-selected" data-element="selected">{{ selected }}</div>
    <div class="select-dropdown" data-element="dropdown">
        <ul>
            {{ #options }}
            <li data-value="{{ value }}" data-element="option"">{{ text }}</li>
            {{ /options }}
        </ul>
    </div>
</div>
```

*Used for select menus*

Now... That's no fun, so let's jazz it up with the template option along with the selector option... :P

```js
var form = document.getElementsByTagName('form');

idex.customize(form, {
    select: { // The selector option let you select an element by name or by tagName
        template: '' +
            '<div class="select">' +
            '<div class="select-selected" data-element="selected">' +
            '<div class="select-selected-text">{{ selected }}</div>' +
            '<div class="select-selected-icon">&nbsp;</div>' +
            '</div>' +
            '<div class="select-dropdown" data-element="dropdown">' +
            '{{ #options }}' +
            '<div data-value="{{ value }}" data-element="option">&nbsp;{{ text }}</div>' +
            '{{ /options }}' +
            '</div>' +
            '</div>'
    }
});
```

You could also keep your structure apart like this:

```html
<script id="select-template" type="template/text">
    <div class="select">
        <div class="select-selected" data-element="selected">
            <div class="select-selected-text">{{ selected }}</div>
            <div class="select-selected-icon">&nbsp;</div>
        </div>
        <div class="select-dropdown" data-element="dropdown">
            {{ #options }}
            <div data-value="{{ value }}" data-element="option">&nbsp;{{ text }}</div>
            {{ /options }}
        </div>
    </div>
</script>
```

```js
var form = document.getElementsByTagName('form');

idex.customize(form, {
    select: { // The selector option let you select an element by name or by tagName
        template: document.getElementById('select-template').innerHTML
    }
});
```

##### The ```data-element``` attribute

You'll notice on the select menu structure the presence of the ```data-element``` attribute. This attribute help identify the different part of more complex structure.

The select menu structure has three:
* ```selected```: The box where the currently selected text is displayed.
* ```dropdown```: The dropdown part of the menu, normally the part that toggle show/hide.
* ```option```: The option element, normally the one that is looped over.

Can be pretty powerful eh?

#### Render ```idex.render(template [string], options [object])```

Ok now you probably noticed the handle bar style ```{{ }}``` template? By default, the IDeX library use [```mustache.js```](https://github.com/janl/mustache.js) as a dependency.

But that can be easily replaced if needed. If by example, you want to use [```underscore.js```](https://github.com/jashkenas/underscore) instead:

```html
<script src="underscore.js"></script>
<script src="customize.form.idex.js"></script>
<script src="app.js"></script>
```

```js
idex.render = function(template, options) {
    var template = _.template(template);
    return template(options);
}
```

And tadam, no more extra dependency! *Quick disclaimer: if you change de render function chances are that you will also have to change the templates*`

### Classes ```[object]```

The last important option is the ```classes``` option. It allows you to change the state classes applied on the elements.

```js
var form = document.getElementsByTagName('form');

idex.customize(form, {
    classes: {
        active: 'active', // Mainly used on radiobuttons and checkboxes
        focus: 'focus', // Used on every elements when it come into focus
        hide: 'hide' // Only used on the dropdown part of the select menu
    }
});
```
