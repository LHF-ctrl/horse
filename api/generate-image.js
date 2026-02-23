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
        
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': requestData.authorization
            },
            body: JSON.stringify(requestData.body)
        });

        const data = await response.json();
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy request error:', error);
        res.status(500).json({ error: error.message });
    }
}
