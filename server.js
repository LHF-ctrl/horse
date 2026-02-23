const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3000;

// 启用 CORS
app.use(cors());
// 解析 JSON 请求体
app.use(express.json());

// API 配置
const API_CONFIG = {
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-156a6786ce8545548561ac2b188cfc5c',
    modelText: 'qwen-flash',
    modelImage: 'qwen-image-max'
};

// 生成贺词的 API 端点
app.post('/api/generate-message', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        console.log('收到生成贺词请求:', prompt);
        
        // 构建完整的 API 端点
        const chatCompletionsUrl = API_CONFIG.endpoint + '/chat/completions';
        
        // 发起 API 请求
        const response = await fetch(chatCompletionsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.modelText,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.9,
                top_p: 0.95,
                stream: false
            })
        });
        
        console.log('API 响应状态:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API 错误:', errorData);
            return res.status(response.status).json({ error: errorData });
        }
        
        const data = await response.json();
        console.log('API 响应数据:', data);
        
        res.json(data);
    } catch (error) {
        console.error('服务器错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 生成图片的 API 端点
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        console.log('收到生成图片请求:', prompt);
        
        // 构建完整的 API 端点
        const imagesGenerationsUrl = API_CONFIG.endpoint + '/images/generations';
        
        // 发起 API 请求
        const response = await fetch(imagesGenerationsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.modelImage,
                prompt: prompt,
                n: 1,
                size: '1080x1920',
                quality: 'hd'
            })
        });
        
        console.log('API 响应状态:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API 错误:', errorData);
            return res.status(response.status).json({ error: errorData });
        }
        
        const data = await response.json();
        console.log('API 响应数据:', data);
        
        res.json(data);
    } catch (error) {
        console.error('服务器错误:', error);
        res.status(500).json({ error: error.message });
    }
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log('可用端点:');
    console.log('- POST /api/generate-message - 生成贺词');
    console.log('- POST /api/generate-image - 生成图片');
    console.log('- GET /health - 健康检查');
});
