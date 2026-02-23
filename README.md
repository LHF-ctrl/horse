# 🐴 马年新春贺词生成器

2026年马年新春贺词生成器 - 使用AI生成马年新春贺词和贺卡图片

## ✨ 功能特点

- 🎴 **智能贺词生成**：使用qwen3-max模型生成马年新春贺词
- 🖼️ **贺卡图片生成**：使用qwen-image-max模型生成精美的贺卡图片
- 📱 **移动端适配**：完美适配手机端，长辈使用更方便
- 🎨 **喜庆设计**：红色金色主题，浓厚的新春氛围
- ☁️ **Vercel部署**：一键部署到Vercel，无需服务器

## 🚀 快速开始

### 方式一：Vercel部署（推荐）

1. **Fork本仓库到你的GitHub**

2. **在Vercel中导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择你Fork的仓库
   - 点击 "Deploy"

3. **配置环境变量（可选）**
   - 在Vercel项目设置中添加环境变量：
   - `DASHSCOPE_API_KEY`: 你的阿里云DashScope API密钥

4. **访问你的网站**
   - 部署完成后，Vercel会提供一个域名
   - 也可以绑定自定义域名

### 方式二：本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/你的用户名/horse-year-greeting-generator.git
   cd horse-year-greeting-generator
   ```

2. **启动代理服务器（用于图片生成）**
   ```bash
   node proxy-server.js
   ```

3. **打开浏览器**
   - 直接打开 `standalone.html` 文件
   - 或使用本地服务器运行

## 📁 项目结构

```
horse-year-greeting-generator/
├── api/
│   └── generate-image.js    # Vercel API路由
├── public/
│   └── index.html           # Vercel部署的主页面
├── standalone.html          # 本地开发版本
├── proxy-server.js          # 本地CORS代理服务器
├── vercel.json              # Vercel配置文件
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript
- **AI模型**：
  - 文本生成：qwen3-max
  - 图片生成：qwen-image-max
- **API提供商**：阿里云DashScope
- **部署平台**：Vercel

## 📖 使用说明

1. 点击"生成贺词"按钮
2. 系统会调用qwen3-max模型生成马年新春贺词
3. 点击"生成图片"按钮
4. 系统会调用qwen-image-max模型生成贺卡图片
5. 图片会直接显示在页面上
6. 点击"下载图片"按钮保存贺卡

## ⚙️ 配置说明

### API密钥配置

项目默认使用内置的API密钥，为了安全，建议在Vercel中配置环境变量：

1. 在Vercel项目设置中添加环境变量
2. 变量名：`DASHSCOPE_API_KEY`
3. 变量值：你的阿里云DashScope API密钥

### 本地开发配置

修改 `standalone.html` 中的 `API_CONFIG`：

```javascript
const API_CONFIG = {
    apiKey: '你的API密钥',
    // 其他配置...
};
```

## 🔧 故障排除

### 图片生成失败

1. 检查API密钥是否正确
2. 检查网络连接是否正常
3. 查看浏览器控制台的错误信息

### Vercel部署失败

1. 检查项目结构是否正确
2. 确保 `vercel.json` 配置正确
3. 查看Vercel部署日志

## 📝 更新日志

### v1.0.0 (2026-02-23)
- ✅ 初始版本发布
- ✅ 支持文本贺词生成
- ✅ 支持贺卡图片生成
- ✅ 支持Vercel部署
- ✅ 移动端适配

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 阿里云DashScope提供AI模型支持
- Vercel提供免费部署平台

---

**祝您2026马年新春快乐！🐴🎊**
