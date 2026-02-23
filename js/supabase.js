// Supabase连接配置

const supabaseUrl = 'https://thdyariqljdepfdbfmbe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZHlhcmlxbGpkZXBmZGJmbWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTkxNzcsImV4cCI6MjA4NzE3NTE3N30.sLcsiE-Jgy7Lyajn7xxRULxDpV1AQ48f_RheQ5ohBrE';

// 初始化Supabase客户端
let supabase;

// 注意：需要在HTML中引入Supabase JS SDK
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// 检查是否已加载Supabase SDK
if (typeof window !== 'undefined' && window.createClient) {
    // 使用直接引入的createClient函数
    supabase = window.createClient(supabaseUrl, supabaseKey);
} else if (typeof window !== 'undefined' && window.Supabase) {
    // 备选方案：使用window.Supabase
    const { createClient } = window.Supabase;
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn('Supabase SDK未加载，将使用模拟数据');
    // 模拟Supabase客户端
    supabase = {
        from: () => ({
            insert: async () => ({ data: [], error: null }),
            select: () => ({
                order: () => ({
                    limit: async () => ({ data: [], error: null })
                })
            })
        })
    };
}

// 导出Supabase客户端
export { supabase };

// 示例：保存生成的贺词到Supabase
export async function saveMessage(message) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    content: message,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('保存消息失败:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('保存消息到Supabase失败:', error);
        throw error;
    }
}

// 示例：获取历史贺词
export async function getMessages() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('获取消息失败:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('从Supabase获取消息失败:', error);
        throw error;
    }
}