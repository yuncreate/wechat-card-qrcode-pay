/**
 * Created by mengkeys on 16-8-30.
 * 接口错误码
 */

var fs = require('fs');
var path = require('path');

fs.createReadStream(path.join(__dirname, '..','data','error_code.json')).pipe(process);