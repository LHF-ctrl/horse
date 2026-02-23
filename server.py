#!/usr/bin/env python3
"""
马年新春贺词生成器后端服务器
使用 Python 3 和内置的 http.server 模块
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import urllib.parse

PORT = 3000

# API 配置
API_CONFIG = {
    'endpoint': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    'apiKey': 'sk-156a6786ce8545548561ac2b188cfc5c',
    'modelText': 'qwen-flash',
    'modelImage': 'qwen-image-max'
}

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        """处理 POST 请求"""
        if self.path == '/api/generate-message':
            self.handle_generate_message()
        elif self.path == '/api/generate-image':
            self.handle_generate_image()
        else:
            self.send_error(404, 'Not Found')
    
    def handle_generate_message(self):
        """处理生成贺词请求"""
        try:
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            prompt = data.get('prompt', '')
            
            print(f"收到生成贺词请求: {prompt}")
            
            # 构建完整的 API 端点
            chat_completions_url = f"{API_CONFIG['endpoint']}/chat/completions"
            
            # 构建请求数据
            request_data = {
                'model': API_CONFIG['modelText'],
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 200,
                'temperature': 0.9,
                'top_p': 0.95,
                'stream': False
            }
            
            # 构建请求头
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {API_CONFIG['apiKey']}"
            }
            
            # 发起 API 请求
            req = urllib.request.Request(
                chat_completions_url,
                data=json.dumps(request_data).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                api_response = response.read()
                api_data = json.loads(api_response.decode('utf-8'))
                
                print(f"API 响应状态: {response.status}")
                print(f"API 响应数据: {api_data}")
                
                # 发送响应
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(api_data).encode('utf-8'))
                
        except Exception as e:
            print(f"服务器错误: {e}")
            self.send_error(500, f"Server Error: {str(e)}")
    
    def handle_generate_image(self):
        """处理生成图片请求"""
        try:
            # 读取请求体
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            prompt = data.get('prompt', '')
            
            print(f"收到生成图片请求: {prompt}")
            
            # 构建完整的 API 端点
            images_generations_url = f"{API_CONFIG['endpoint']}/images/generations"
            
            # 构建请求数据
            request_data = {
                'model': API_CONFIG['modelImage'],
                'prompt': prompt,
                'n': 1,
                'size': '1080x1920',
                'quality': 'hd'
            }
            
            # 构建请求头
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {API_CONFIG['apiKey']}"
            }
            
            # 发起 API 请求
            req = urllib.request.Request(
                images_generations_url,
                data=json.dumps(request_data).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                api_response = response.read()
                api_data = json.loads(api_response.decode('utf-8'))
                
                print(f"API 响应状态: {response.status}")
                print(f"API 响应数据: {api_data}")
                
                # 发送响应
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(api_data).encode('utf-8'))
                
        except Exception as e:
            print(f"服务器错误: {e}")
            self.send_error(500, f"Server Error: {str(e)}")
    
    def do_GET(self):
        """处理 GET 请求"""
        if self.path == '/health':
            # 健康检查端点
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode('utf-8'))
        else:
            # 对于其他 GET 请求，返回 404
            self.send_error(404, 'Not Found')

if __name__ == "__main__":
    print(f"马年新春贺词生成器后端服务器启动中...")
    print(f"端口: {PORT}")
    print(f"可用端点:")
    print(f"- POST /api/generate-message - 生成贺词")
    print(f"- POST /api/generate-image - 生成图片")
    print(f"- GET /health - 健康检查")
    
    # 启动服务器
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"服务器运行在 http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器正在关闭...")
            httpd.shutdown()
