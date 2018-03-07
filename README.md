# mongoose-connection

[![Build Status](https://travis-ci.org/lykmapipo/mongoose-connection.svg?branch=master)](https://travis-ci.org/lykmapipo/mongoose-connection)
[![Dependency Status](https://img.shields.io/david/lykmapipo/mongoose-connection.svg?style=flat)](https://david-dm.org/lykmapipo/mongoose-connection)
[![npm version](https://badge.fury.io/js/%40lykmapipo%2Fmongoose-connection.svg)](https://badge.fury.io/js/@lykmapipo/mongoose-connection)


simplified mongoose connection setup. 
 
It parse `process.env.MONGODB_URI` or `process.env.MONGODB_URL` to obtain 
connection options if none specified.

## Requirements

- NodeJS v9.3.0+
- mongoose v5.0.9+

## Install
```sh
$ npm install --save @lykmapipo/mongoose-connection
```

## Usage

```javascript
const mongoose = require('@lykmapipo/mongoose-connection');

mongoose.loadModels();

mongoose.open(uri);

```

## API

### `open([uri:String],[options:Object],[done:Function])`
Establish mongoose connection

Options
- `uri:String` - valid mongodb connection uri. Default to `process.env.MONGODB_URI`
or `process.env.MONGODB_URL`
- `options:Object` - valid mongoose connection options
- `done:Function` - a callback to invoke on success or error


## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```
* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## Licence
The MIT License (MIT)

Copyright (c) 2018 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 