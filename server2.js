var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)
    if (path === '/index2.html') {//qq  JSONP
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`index2.html`)
        response.end()
    } else if (path === '/chao.js') {
        if (request.headers['referer'].indexOf('http://localhost:8989') === 0) {
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            const string = `window['{{xxx}}']({{data}})`.toString();//xxx函数
            console.log(query.functionName)
            // const string = `window.xxx={{data}}`.toString();//xxx变量
            // const string = fs.readFileSync('./db/chao.js').toString()
            const data = fs.readFileSync('./db/friends.json').toString()
            const string2 = string.replace('{{data}}', data).replace('{{xxx}}', query.callback)
            response.write(string2)
            response.end()
        } else {
            response.statusCode = 404
            response.end();
        }
    } else if (path === '/frank.js') {//CORS
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8989')
        const string = `{{data}}`.toString()
        const data = `[{"name": "张三"}]`.toString()
        const string2 = string.replace('{{data}}', data)
        response.write(string2)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`你输入的路径不存在对应的内容`)
        response.end()
    }

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

