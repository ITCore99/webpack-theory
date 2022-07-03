## Tabable

This is a simple module that will add tab-index attributes to your elements. [![Build Status](https://travis-ci.org/honeinc/tabable.svg?branch=master)](https://travis-ci.org/honeinc/tabable)

### Install

```
$ npm install tabable
```

### Usage

```javascript
tabable( element[, filter ] )
```

Given an element, tabable find all the inputs (or whatever you specify via the optional filter argument) within it an give them a tab-index. Eg:

```javascript
var tabable = require( 'tabable' );

// make all the inputs have a reasonable tab-index
tabable( document.getElementById( 'foo' ) );
```

Only want textareas to be tabable?

```javascript
var tabable = require( 'tabable' );

// only set tab-index on the textarea elements
tabable( document.getElementById( 'foo' ), 'textarea' );
```

##### Have an issue? report it in the issues tab.
