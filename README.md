# ExampleChecker
This is test tool for [webml-polyfill examples](https://github.com/intel/webml-polyfill/tree/master/examples)

## Install

```sh
$ npm install
```

## Start

```sh
$ npm test
```

## Set ExampleChecker.json file

* `exampleURL`: URL of webml-polyfill examples.
* `platform`: the test platform.
* `chromium.flag`: As *false*, using `chrome`, As *true*, using `chromium`.
* `chromium.path`: Path of browser.
* `image.flag`: As *false*, using default image, As *true*, using specified image of lib.
* `others`: Automatic setting

## Support

#### platform

|  Linux  |   Mac   |  Android  |  Windows  |
|  :---:  |  :---:  |   :---:   |   :---:   |
|  PASS   |   PASS  |    PASS   |    PASS   |

#### browser

|  chrome  |   chromium   |
|  :---:   |     :---:    |
|  PASS    |     PASS     |
