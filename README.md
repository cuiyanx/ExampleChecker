# TTFE
test tool for [webml-polyfill examples](https://github.com/intel/webml-polyfill/tree/master/examples)

## Prerequisites
* Installing Google Chrome Browser(65.x.xxx).
* Running TTFE with Google Chrome, need [chromedriver](http://chromedriver.storage.googleapis.com/index.html).

   ```sh
   chromedriver(2.37)  -->  google-chrome(65.x.xxx)
   ```

* Copy *chromedriver* to TTFE webdriver path `./lib/chromedriver/`.

## Install

```sh
$ npm install
```

## Start

```sh
$ npm test
```

## Set TTFE.config.json file

* `exampleURL`: URL of webml-polyfill examples.
* `chromium.flag`: As *false*, using `chrome`, As *true*, using `chromium`.
* `chromium.path`: Path of chromium browser.
* `image.flag`: As *false*, using default image, As *true*, using specified image of lib.
* `others`: Automatic setting

## Support platform

| Run Platform  | chrome |  chromium |
|     :---:     | :---:  |   :---:   |
| Ubuntu 16.04  |  pass  |    pass   |
|      Mac      |  pass  |    pass   |
