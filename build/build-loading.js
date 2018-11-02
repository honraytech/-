var fs = require('fs')
var ORIGIN_URL = './loading.svg'
var DIST_URL = './dist/loading.svg'
fs.readFile(ORIGIN_URL, function (err, buf) {
  fs.writeFile(DIST_URL, buf, function (err) {
    if (err) {
      console.log(err)
    }
  })
})