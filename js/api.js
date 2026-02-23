// API调用模块 - 阿里云百炼平台集成

const API_CONFIG = {
    apiKey: 'sk-156a6786ce8545548561ac2b188cfc5c',
    modelText: 'qwen3-max',
    modelImage: 'qwen-image-max',
    timeout: 30000
};

export async function generateMessage() {
    const randomSeed = Math.floor(Math.random() * 10000);
    const prompt = `请生成2026年马年新春贺词，要求：
1. 包含马年相关元素和祝福语
2. 语言简洁优美，适合长辈使用
3. 符合新春喜庆氛围
4. 内容积极向上
5. 长度适中，适合在贺卡上展示

随机种子: ${randomSeed}`;

    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'text',
                authorization: `Bearer ${API_CONFIG.apiKey}`,
                model: API_CONFIG.modelText,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
                temperature: 0.9,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('生成贺词失败:', error);
        return `马年大吉！
马到成功事业顺，
龙马精神身体健，
万马奔腾财运旺，
一马当先福满堂。
2026年，祝您新春快乐，阖家幸福！`;
    }
}

export async function generateImage(message) {
    const requestBody = {
        model: API_CONFIG.modelImage,
        input: {
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            text: `创建一张2026年马年新春贺卡，9:16比例长图。画面要有浓厚的新春氛围和马年元素，包括红色背景、金色装饰、马的图案等。中央位置展示以下贺词：\n${message}\n整体设计喜庆、典雅，适合长辈使用。`
                        }
                    ]
                }
            ]
        },
        parameters: {
            negative_prompt: '低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。',
            prompt_extend: true,
            watermark: false,
            size: '1080*1920'
        }
    };

    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'image',
                authorization: `Bearer ${API_CONFIG.apiKey}`,
                body: requestBody
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.output && data.output.choices && data.output.choices[0] && 
            data.output.choices[0].message && data.output.choices[0].message.content && 
            data.output.choices[0].message.content[0] && data.output.choices[0].message.content[0].image) {
            return data.output.choices[0].message.content[0].image;
        }
        
        throw new Error('API响应中没有图片URL');
    } catch (error) {
        console.error('生成图片失败:', error);
        throw error;
    }
}

export function downloadImage(imageUrl, filename = '马年贺卡.png') {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
