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
    if (path === '/') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`<!DOCTYPE html>
        <h1>这是一段H1文字,并请求了一个style.css</h1>
        <link rel='stylesheet' href='/style.css'></link>`)
        response.end()
    } else if (path === '/index.html') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        let string = `<!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
        <h1>index.html</h1>
        <div id='myName'></div>
        <button id='requestCSS'>getCSS</button>
        <button id='requestJS'>getJS</button>
        <button id='requestHTML'>getHTML</button>
        <button id='requestXML'>getXML</button>
        <button id='requestJSON'>getJSON</button>
        <button id='requestPage'>getPage</button>
        <script src="main.js"></script></body>
        {{page1}}
        </html>`;
        const page1 = fs.readFileSync('db/page1.json')
        const array = JSON.parse(page1);

        string = string.replace('{{page1}}', page1)
        response.write(string)
        response.end()
    } else if (path === '/main.js') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(`
        requestCSS.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','/style.css')
            request.onload = () =>{
                const style = document.createElement('style')
                style.innerHTML = request.response
                document.head.appendChild(style)
            }
            request.send();
        }

        requestJS.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','/main2.js')
            request.onload = ()=>{
                const script = document.createElement('script')
                script.innerHTML = request.response
                document.body.appendChild(script)
            }
            request.send();
        }
        requestHTML.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','/index2.html')
            request.onreadystatechange = ()=>{
                if(request.readyState === 4){//查看
                    if(request.status>=200 && request.status<300){//查看状态码
                        const div = document.createElement('div')
                        div.innerHTML = request.response
                        document.body.appendChild(div)        
                    }else{
                        console.log('错误')
                    }
                }
            }
            request.send();
        }
        requestXML.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','4.xml')
            request.onreadystatechange = ()=>{
                if(request.readyState ===4 && request.status >= 200 && request.status<300){
                    const dom = request.responseXML
                    const text = dom.getElementsByTamName('warning')[0].textContent
                    console.log(text.trim())
                }
            }
            request.send();
        }
        requestJSON.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','5.json')
            request.onreadystatechange = ()=>{
                if(request.readyState ===4 && request.status >= 200 && request.status<300){
                    const object = JSON.parse(request.response)
                    myName.textContent = object.name
                    //JSON.parse    JSON=>JS
                    //JSON.stringify    JS=>JSON
                    //失败会抛出Error对象
                    //用try catch捕获
                }
            }
            request.send();
        }
        let n=1;
        requestPage.onclick = ()=>{
            const request = new XMLHttpRequest()
            request.open('GET','/page'+(n+1))
            request.onreadystatechange = ()=>{
                if(request.readyState ===4 && request.status >= 200 && request.status<300){
                    const array = JSON.parse(request.response)
                    array.forEach(item=>{
                        const li = document.createElement('li')
                        li.textContent = item.id
                        document.body.appendChild(li)
                    })
                    n+=1;
                }
            }
            request.send();
        }
        `)
        response.end()
    } else if (path === '/style.css') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/css;charset=utf-8')
        response.write(`h1{
            color:red;
        }`)
        response.end()
    } else if (path === '/main2.js') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
        response.write(`console.log('main2.js')
        `)
        response.end()
    } else if (path === '/index2.html') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(`<!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
        <h1>index2.html</h1>
        </html>
        `)
        response.end()
    } else if (path === '/4.xml') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/xml;charset=utf-8')
        response.write(`<?xml version="1.0" encoding="UTF-8"?>
        <message>
            <warning>
                 Hello World
            </warning>
        </message>`)
        response.end()
    } else if (path === '/5.json') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        response.write(`{"name":"chao","age":20}`)
        response.end()
    } else if (path === '/page2') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        response.write(fs.readFileSync('db/page2.json'))
        response.end()
    } else if (path === '/page3') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8')
        response.write(fs.readFileSync('db/page3.json'))
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

