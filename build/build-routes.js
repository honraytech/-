var fileName = 'route'
var fs = require('fs')
var _ = require('lodash')

var oldVersion = require('../src/oldVersion.js')
var count = 0
var code = ''

_(oldVersion).forEach((res) => {
  code += 'import ' + fileName + '_' + (count++) + ' from ' + '\'' + res + '\'\n'
})

code += 'var oldRoutes = []\n'

for (var i = 0; i < count; i++) {
  code += 'oldRoutes = oldRoutes.concat(route_' + i + ')\n'
}

code += 'export default oldRoutes\n'

fs.writeFile('./src/oldRoutes.js', code, function(err) {
  if (err) {
    throw err
  }
})
