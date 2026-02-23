// API调用模块 - 阿里云百炼平台集成

// 配置信息（需要根据实际情况修改）
const API_CONFIG = {
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: 'sk-156a6786ce8545548561ac2b188cfc5c',
    modelText: 'qwen3-max',
    modelImage: 'qwen-image-max'
};

/**
 * 生成马年新春贺词
 * @returns {Promise<string>} 生成的贺词
 */
export async function generateMessage() {
    const prompt = `请生成2026年马年新春贺词，要求：
1. 包含马年相关元素和祝福语
2. 语言简洁优美，适合长辈使用
3. 符合新春喜庆氛围
4. 内容积极向上
5. 长度适中，适合在贺卡上展示`;

    try {
        const response = await fetch(API_CONFIG.endpoint, {
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
                temperature: 0.8
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('生成贺词失败:', error);
        // 返回默认贺词作为备选
        return `马年大吉！
马到成功事业顺，
龙马精神身体健，
万马奔腾财运旺，
一马当先福满堂。
2026年，祝您新春快乐，阖家幸福！`;
    }
}

/**
 * 生成贺卡图片
 * @param {string} message 贺词内容
 * @returns {Promise<string>} 图片URL
 */
export async function generateImage(message) {
    const prompt = `创建一张2026年马年新春贺卡，9:16比例长图。画面要有浓厚的新春氛围和马年元素，包括红色背景、金色装饰、马的图案等。中央位置展示以下贺词：\n${message}\n整体设计喜庆、典雅，适合长辈使用。`;

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.modelImage,
                prompt: prompt,
                size: '1080x1920', // 9:16比例
                quality: 'hd'
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data[0].url;
    } catch (error) {
        console.error('生成图片失败:', error);
        throw error;
    }
}

/**
 * 下载图片
 * @param {string} imageUrl 图片URL
 * @param {string} filename 文件名
 */
export function downloadImage(imageUrl, filename = '马年贺卡.png') {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('下载图片失败:', error);
            alert('图片下载失败，请稍后重试');
        });
}