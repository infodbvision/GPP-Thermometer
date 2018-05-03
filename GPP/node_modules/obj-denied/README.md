# obj-denied #
Check if the required properties are set, the easy way!

[![Build Status](https://travis-ci.org/Geexteam/obj-denied.svg?branch=master)](https://travis-ci.org/Geexteam/obj-denied)
[![Dependency Status](https://gemnasium.com/badges/github.com/Geexteam/obj-denied.svg)](https://gemnasium.com/github.com/Geexteam/obj-denied)
[![NSP Status](https://nodesecurity.io/orgs/geex-team/projects/00e3904b-d933-4ac3-b865-44584dd62b4e/badge)](https://nodesecurity.io/orgs/geex-team/projects/00e3904b-d933-4ac3-b865-44584dd62b4e)

## Requirements ##
To use this module, the following is required:

+ An env that accepts ES6' const and let

## Installation ##
You can install this module with NPM:

    npm install --save obj-denied

## Usage ##
#### Require the library ####
```ES6
    const denied = require('obj-denied');
```

#### Define an Object (or get one) ####
```ES6
    const obj = {
        foo: 'bar',
        baz: 'qux',
        nope: null,
        sub_obj: {exists: 'Yes!'},
        sub_arr: ['element']
    }
```
#### Start checking! ####
Success!
```ES6
    if(denied(obj, ['foo', 'baz'])) {
        return 'Not all required props are given';
    }

    // Go on with life
```

Oops!
```ES6
    if(denied(obj, ['nope', 'non-existend'])) {
        return 'Not all required props are given';
    }

    // Nothing going on here, debug the part above, because denied returned true
```
