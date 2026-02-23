export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const requestData = req.body;
        
        // 根据请求类型选择API端点
        let apiUrl = '';
        let requestBody = {};
        
        if (requestData.type === 'text') {
            // 文本生成API
            apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
            requestBody = {
                model: requestData.model || 'qwen3-max',
                messages: requestData.messages,
                max_tokens: requestData.max_tokens || 200,
                temperature: requestData.temperature || 0.9,
                top_p: requestData.top_p || 0.95,
                stream: false
            };
        } else if (requestData.type === 'image') {
            // 图片生成API
            apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
            requestBody = requestData.body;
        } else {
            res.status(400).json({ error: 'Invalid request type' });
            return;
        }
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': requestData.authorization
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy request error:', error);
        res.status(500).json({ error: error.message });
    }
}
