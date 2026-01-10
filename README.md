# 🍌 Banana Editor / 🍌 香蕉编辑器

<div align="center">

![Banana Editor Logo](public/icon.svg)

**AI-Powered Image Editing Made Simple / 基于 AI 的简单图像编辑**

Transform any image with simple text prompts using advanced AI technology.
使用先进的 AI 技术，通过简单的文本提示词转换任何图像。

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [在线演示](#) • [Report Bug](https://github.com/Singhualee/banana/issues) • [报告错误](https://github.com/Singhualee/banana/issues) • [Request Feature](https://github.com/Singhualee/banana/issues) • [请求功能](https://github.com/Singhualee/banana/issues)

</div>

## ✨ Features / 功能特性

- 🎨 **AI-Powered Editing / AI 驱动编辑**: 使用 Gemini 2.5 Flash Image API 转换图像
- 📸 **Easy Upload / 简单上传**: 拖拽界面，支持多种格式
- 🔄 **Real-time Generation / 实时生成**: 几秒钟内获得编辑后的图像
- 💾 **Smart Downloads / 智能下载**: 支持 JPG/PNG/WebP 格式保存
- 📂 **History Management / 历史管理**: 内置图库管理所有编辑记录
- 🎯 **Prompt-Based Editing / 提示词编辑**: 简单文本提示词实现复杂编辑
- 📱 **Responsive Design / 响应式设计**: 完美适配所有设备
- 🌙 **Dark Mode / 深色模式**: 内置主题切换功能

## 🚀 Quick Start / 快速开始

### Prerequisites / 前置要求

- Node.js 18+
- npm, pnpm, or yarn

### Installation / 安装

```bash
# Clone the repository / 克隆仓库
git clone https://github.com/Singhualee/banana.git
cd banana

# Install dependencies / 安装依赖
pnpm install
# or / 或者
npm install
```

### Environment Setup / 环境设置

1. Create a `.env.local` file in the root directory / 在根目录创建 `.env.local` 文件:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-image
SITE_URL=http://localhost:3000
SITE_NAME=Banana Editor
```

2. Get your API key from [OpenRouter](https://openrouter.ai/) and add it to `.env.local`
   / 从 [OpenRouter](https://openrouter.ai/) 获取 API 密钥并添加到 `.env.local`

### Development / 开发

```bash
# Start development server / 启动开发服务器
pnpm dev
# or / 或者
npm run dev

# Open http://localhost:3000 / 打开 http://localhost:3000
```

### Production / 生产

```bash
# Build for production / 构建生产版本
pnpm build
# or / 或者
npm run build

# Start production server / 启动生产服务器
pnpm start
# or / 或者
npm run start
```

## 📖 Usage / 使用方法

1. **Upload an Image / 上传图像**: 点击 "Start Editing" 并拖拽或选择图像
2. **Enter Your Prompt / 输入提示词**: 描述你想要的变化 (例如 "Make the background a sunny beach" / "把背景变成 sunny 海滩")
3. **Generate / 生成**: 点击 "Get Edit Suggestions" 等待 AI 发挥魔力
4. **Download / 下载**: 以你喜欢的格式保存编辑后的图像

### Example Prompts / 示例提示词

- "Change the season to winter" / "把季节变成冬天"
- "Add vintage film effects" / "添加复古胶片效果"
- "Remove the person in the background" / "移除背景中的人物"
- "Make it look like a professional portrait" / "让它看起来像专业肖像"
- "Change the lighting to golden hour" / "把光线变成黄金时刻"

## 🛠️ Tech Stack / 技术栈

### Frontend / 前端
- **Framework / 框架**: Next.js 16 with App Router
- **Language / 语言**: TypeScript 5
- **UI Library / UI 库**: React 19
- **Styling / 样式**: Tailwind CSS 4.1.9
- **Components / 组件**: shadcn/ui + Radix UI
- **Icons / 图标**: Lucide React
- **State Management / 状态管理**: React Hooks

### Backend / 后端
- **API / 接口**: Next.js API Routes
- **AI Service / AI 服务**: OpenAI SDK with OpenRouter
- **Model / 模型**: Google Gemini 2.5 Flash Image

### Development Tools / 开发工具
- **Build Tool / 构建工具**: Turbopack
- **Linting / 代码检查**: ESLint
- **Package Manager / 包管理器**: pnpm
- **Type Checking / 类型检查**: TypeScript strict mode

## 📁 Project Structure / 项目结构

```
banana/
├── app/                    # Next.js App Router / Next.js 应用路由
│   ├── api/               # API routes / API 路由
│   │   └── edit-image/    # Image editing API / 图像编辑 API
│   ├── globals.css        # Global styles / 全局样式
│   ├── layout.tsx         # Root layout / 根布局
│   └── page.tsx          # Home page / 主页
├── components/            # React components / React 组件
│   ├── ui/               # shadcn/ui components / shadcn/ui 组件
│   ├── hero.tsx          # Hero section / 主页区域
│   ├── image-uploader.tsx # Image upload component / 图像上传组件
│   └── output-gallery.tsx # Results gallery / 结果图库
├── hooks/                # Custom React hooks / 自定义 React Hooks
├── lib/                  # Utility functions / 工具函数
├── public/               # Static assets / 静态资源
└── styles/               # Additional styles / 额外样式
```

## 🎨 UI Components / UI 组件

Banana Editor uses the following UI components from shadcn/ui:
Banana Editor 使用 shadcn/ui 的以下 UI 组件：

- `Button`, `Card`, `Badge`, `Alert`
- `Textarea`, `Input`, `Label`
- `Dialog`, `Sheet`, `Popover`
- `Toast`, `Sonner` notifications / 通知
- And many more... / 以及更多...

All components are fully customizable and follow accessibility best practices.
所有组件都完全可定制，并遵循可访问性最佳实践。

## 🔧 Configuration

### Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES6",
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🌟 API Integration

### Image Editing API

The app uses OpenRouter to access Google's Gemini 2.5 Flash Image model:

```typescript
const completion = await openai.chat.completions.create({
  model: "google/gemini-2.5-flash-image",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": prompt
        },
        {
          "type": "image_url",
          "image_url": {
            "url": imageData
          }
        }
      ]
    }
  ]
});
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
本项目采用 MIT 许可证 - 详情请参见 [LICENSE](LICENSE) 文件。

## 🙏 Acknowledgments / 致谢

- [Next.js](https://nextjs.org/) - The React framework for production / 生产级 React 框架
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components / 精美设计的组件
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives / 底层 UI 原语
- [Google Gemini](https://ai.google.dev/) - AI image generation / AI 图像生成
- [OpenRouter](https://openrouter.ai/) - API gateway for AI models / AI 模型 API 网关

## 📞 Support / 支持

If you have any questions or need help:
如果你有任何问题或需要帮助：

- 📧 [Create an issue](https://github.com/Singhualee/banana/issues) / [创建问题](https://github.com/Singhualee/banana/issues)
- 💬 [Join our discussions](https://github.com/Singhualee/banana/discussions) / [加入讨论](https://github.com/Singhualee/banana/discussions)
- 🐛 [Report bugs](https://github.com/Singhualee/banana/issues/new?template=bug_report.md) / [报告错误](https://github.com/Singhualee/banana/issues/new?template=bug_report.md)

---

<div align="center">

Made with ❤️ and 🍌 by [Singhualee](https://github.com/Singhualee)
由 [Singhualee](https://github.com/Singhualee) 用 ❤️ 和 🍌 制作

[⭐ Star this repo](https://github.com/Singhualee/banana) / [⭐ 给这个仓库标星](https://github.com/Singhualee/banana) •
[🍴 Fork this repo](https://github.com/Singhualee/banana/fork) / [🍴 Fork 这个仓库](https://github.com/Singhualee/banana/fork)

</div>