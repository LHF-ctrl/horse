const https = require('https');

module.exports = async (req, res) => {
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

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            
            const options = {
                hostname: 'dashscope.aliyuncs.com',
                port: 443,
                path: '/api/v1/services/aigc/multimodal-generation/generation',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': requestData.authorization || ''
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                let responseData = '';
                
                proxyRes.on('data', chunk => {
                    responseData += chunk;
                });
                
                proxyRes.on('end', () => {
                    res.status(proxyRes.statusCode).json(JSON.parse(responseData));
                });
            });

            proxyReq.on('error', error => {
                console.error('Proxy request error:', error);
                res.status(500).json({ error: error.message });
            });

            proxyReq.write(JSON.stringify(requestData.body));
            proxyReq.end();
        } catch (error) {
            console.error('Request processing error:', error);
            res.status(500).json({ error: error.message });
        }
    });
};
