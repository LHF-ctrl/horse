#!/usr/bin/env python3
"""
马年新春贺词生成器后端服务器
使用 Python 3 和 Flask 框架
"""

from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

# API 配置
API_CONFIG = {
    'endpoint': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    'apiKey': 'sk-156a6786ce8545548561ac2b188cfc5c',
    'modelText': 'qwen-flash',
    'modelImage': 'qwen-image-max'
}

@app.route('/api/generate-message', methods=['POST'])
def generate_message():
    """生成贺词"""
    try:
        data = request.json
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
        response = requests.post(
            chat_completions_url,
            json=request_data,
            headers=headers
        )
        
        print(f"API 响应状态: {response.status_code}")
        print(f"API 响应数据: {response.json()}")
        
        # 返回响应
        return jsonify(response.json())
        
    except Exception as e:
        print(f"服务器错误: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    """生成图片"""
    try:
        data = request.json
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
        response = requests.post(
            images_generations_url,
            json=request_data,
            headers=headers
        )
        
        print(f"API 响应状态: {response.status_code}")
        print(f"API 响应数据: {response.json()}")
        
        # 返回响应
        return jsonify(response.json())
        
    except Exception as e:
        print(f"服务器错误: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({'status': 'ok'})

if __name__ == "__main__":
    print(f"马年新春贺词生成器后端服务器启动中...")
    print(f"端口: 3000")
    print(f"可用端点:")
    print(f"- POST /api/generate-message - 生成贺词")
    print(f"- POST /api/generate-image - 生成图片")
    print(f"- GET /health - 健康检查")
    
    # 启动服务器
    app.run(host='0.0.0.0', port=3000, debug=True)
