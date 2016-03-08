var fs = require('fs');

var script = fs.readFileSync('./preventBounceScroll.js') + '';
var wrap = fs.readFileSync('./wrap.js') + '';


var content = wrap.replace('${content}', script);

fs.writeFileSync('./dist/preventBounceScroll.js', content);