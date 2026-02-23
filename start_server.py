import http.server
import socketserver
import sys

try:
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"服务器启动成功！监听端口: {PORT}")
        print(f"访问URL: http://localhost:{PORT}")
        httpd.serve_forever()
except Exception as e:
    print(f"服务器启动失败: {e}")
    sys.exit(1)