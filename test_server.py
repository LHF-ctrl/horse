#!/usr/bin/env python3
"""
简单的测试服务器
"""

import http.server
import socketserver

PORT = 3000

class TestHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"status": "ok"}')
        else:
            self.send_error(404, 'Not Found')

if __name__ == "__main__":
    print(f"测试服务器启动中...")
    print(f"端口: {PORT}")
    print(f"可用端点: /health")
    
    try:
        with socketserver.TCPServer(("", PORT), TestHTTPRequestHandler) as httpd:
            print(f"服务器运行在 http://localhost:{PORT}")
            httpd.serve_forever()
    except Exception as e:
        print(f"服务器启动失败: {e}")
