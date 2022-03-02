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
    if (path === '/index3.html') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`
        <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
        <h1>hei</h1>
        <div id='myName'></div>
        <script src="main3.js"></script></body>
        <script src="main4.js"></script></body>
        <script src="main.js"></script></body>
        </html>
        `)
        response.end()
    } else if (path === '/main.js') {//frank  JSONP
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(`
        function jsonp(url){
            return new Promise((resolve,reject)=>{
                const random = Math.random()
                window[random] = (data)=>{
                    resolve(data)
                }
                const script = document.createElement('script')
                script.src = url+'?callback='+random
                script.onload=()=>{
                    script.remove()//拿到数据就可以删了 不然会有很多script标签
                }
                script.onerror = ()=>{
                    reject();
                }
                document.body.appendChild(script)
            })
        }
        jsonp('http://localhost:8888/chao.js').then((data)=>{
            console.log(data)
        })
        // const random = Math.random()
        // window[random] = (data)=>{
        //     console.log(data)
        // }
        // const script = document.createElement('script')
        // script.src = 'http://localhost:8888/chao.js?functionName='+random
        // script.onload=()=>{
        //     console.log(window[random])
        //     script.remove()//拿到数据就可以删了 不然会有很多script标签
        // }
        // document.body.appendChild(script)
        `)
        response.end()
    } else if (path === '/main3.js') {//frank  CORS
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(`const request = new XMLHttpRequest()
        request.open('GET', 'http://localhost:8888/frank.js')
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status >= 200 && request.status < 300) {
                const script = document.createElement('script')
                script.innerHTML = request.response
                document.body.appendChild(script)
            } else {
                console.log('请求失败')
            }
        }
        request.send();
        `)
        response.end()

    } else if (path === '/main4.js') {//frank  CORS
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(`const request1 = new XMLHttpRequest()
        request1.open('GET', 'http://localhost:8888/frank2.json')
        request1.onreadystatechange = () => {
            console.log(request1.readyState)
            if (request1.readyState === 4 && request1.status >= 200 && request1.status < 300) {
                    const json = JSON.parse(request1.response)
                    for(let i in json){
                        myName.textContent += json[i].id
                    }
                }else{
                    console.log('请求失败1')
                }
            }
            request1.send();
        `)
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

