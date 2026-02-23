const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
    console.log('收到请求:', req.method, req.url);
    console.log('请求头:', req.headers);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Target-Url');
    
    if (req.method === 'OPTIONS') {
        console.log('处理OPTIONS预检请求');
        res.writeHead(200);
        res.end();
        return;
    }
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        console.log('请求体:', body);
        
        const targetUrl = req.headers['x-target-url'];
        console.log('目标URL:', targetUrl);
        
        if (!targetUrl) {
            console.error('缺少x-target-url请求头');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing x-target-url header' }));
            return;
        }
        
        const parsedUrl = url.parse(targetUrl);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.path,
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers['authorization'] || ''
            }
        };
        
        console.log('代理请求选项:', options);
        
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        const proxyReq = protocol.request(options, (proxyRes) => {
            console.log('代理响应状态:', proxyRes.statusCode);
            
            let responseData = '';
            
            proxyRes.on('data', chunk => {
                responseData += chunk;
            });
            
            proxyRes.on('end', () => {
                console.log('代理响应数据:', responseData.substring(0, 500));
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': 'application/json'
                });
                res.end(responseData);
            });
        });
        
        proxyReq.on('error', error => {
            console.error('代理请求错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });
        
        if (body) {
            proxyReq.write(body);
        }
        
        proxyReq.end();
    });
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`端口 ${PORT} 已被占用，请先关闭占用该端口的进程`);
        console.error('可以使用以下命令查找并终止进程:');
        console.error(`netstat -ano | findstr :${PORT}`);
        console.error('taskkill /F /PID <进程ID>');
    } else {
        console.error('服务器错误:', error);
    }
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`CORS代理服务器运行在 http://localhost:${PORT}`);
    console.log('使用方法：在请求头中添加 x-target-url 指定目标API地址');
    console.log('按 Ctrl+C 停止服务器');
});
