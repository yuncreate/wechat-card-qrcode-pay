/**
 * Created by mengkeys on 16-8-30.
 * 网络爬虫，爬取为新错误码信息
 */


var async = require('async');
var _ = require('underscore');
var remote = 'http://wxpay.weixin.qq.com/errcode/index.php';
var request = require('request');
var fs = require('fs');
var path = require('path');

var pages = [1,2,3,4,5,6,7,8,9];

// 使用async
async.map(pages, getPage, function (err, result) {
    if(err) {
        console.error(err);
        process.exit();
    }

    var list = [];
    result.forEach(function (item, index) {
        list = list.concat(item);
    });
    console.log(list.length);   // 总的记录条数
    fs.writeFileSync(path.join(__dirname,'..','data','error_code.json'), JSON.stringify(list));
    //console.log(JSON.parse(result));
});


function getPage(pageCode, callback) {
    request(remote+'?page='+pageCode, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // 此处处理页面提取信息
            //splitHtml(body);

            var bodyStart = '<tbody>';
            var bodyEnd = '</tbody>';
            var trEnd = '</tr><tr>';
            var tdEnd = '</td><td>';

            var codes = [];

            // 首先从html中提取出tbody内的数据
            var trList = body.substring(body.indexOf(bodyStart)+7, body.indexOf(bodyEnd));
            // 提取tr数组

            trList = trList.replace(/(^\s+)|(\s+$)/g, ""); //去除所有的空格

            // 去掉头尾的<tr>以及</tr>
            trList = trList.substring(4, trList.length-5);

            var tdList = trList.split(trEnd);

            tdList.forEach(function (item) {
                var data = item.substring(4, item.length -5).split(tdEnd);
                var obj = {};
                obj['商户类型'] = data[0];
                obj['接口名'] = data[1];
                obj['接口说明'] = data[2];
                obj['问题类型'] = data[3];
                obj['错误码'] = data[4];
                obj['错误原因'] = data[5];
                obj['原因'] = data[6];
                obj['解决方案'] = data[7];
                codes.push(obj);
            });
            callback(null, codes);
        }
    })
}