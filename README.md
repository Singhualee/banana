# 🍌 Banana Editor

<div align="center">

![Banana Editor Logo](public/icon.svg)

**AI-Powered Image Editing Made Simple**

Transform any image with simple text prompts using advanced AI technology.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Report Bug](https://github.com/Singhualee/banana/issues) • [Request Feature](https://github.com/Singhualee/banana/issues)

</div>

## ✨ Features

- 🎨 **AI-Powered Editing**: Transform images using Gemini 2.5 Flash Image API
- 📸 **Easy Upload**: Drag & drop interface with multiple format support
- 🔄 **Real-time Generation**: Get edited images in seconds
- 💾 **Smart Downloads**: Save results in JPG/PNG/WebP formats
- 📂 **History Management**: Built-in gallery for all your edits
- 🎯 **Prompt-Based Editing**: Simple text prompts for complex edits
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌙 **Dark Mode**: Built-in theme switching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Singhualee/banana.git
cd banana

# Install dependencies
pnpm install
# or
npm install
```

### Environment Setup

1. Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-image
SITE_URL=http://localhost:3000
SITE_NAME=Banana Editor
```

2. Get your API key from [OpenRouter](https://openrouter.ai/) and add it to `.env.local`

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
pnpm build
# or
npm run build

# Start production server
pnpm start
# or
npm run start
```

## 📖 Usage

1. **Upload an Image**: Click "Start Editing" and drag & drop or select an image
2. **Enter Your Prompt**: Describe what you want to change (e.g., "Make the background a sunny beach")
3. **Generate**: Click "Get Edit Suggestions" and wait for the AI to work its magic
4. **Download**: Save your edited image in your preferred format

### Example Prompts

- "Change the season to winter"
- "Add vintage film effects"
- "Remove the person in the background"
- "Make it look like a professional portrait"
- "Change the lighting to golden hour"

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.9
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **API**: Next.js API Routes
- **AI Service**: OpenAI SDK with OpenRouter
- **Model**: Google Gemini 2.5 Flash Image

### Development Tools
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Package Manager**: pnpm
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
banana/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── edit-image/    # Image editing API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── hero.tsx          # Hero section
│   ├── image-uploader.tsx # Image upload component
│   └── output-gallery.tsx # Results gallery
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🎨 UI Components

Banana Editor uses the following UI components from shadcn/ui:

- `Button`, `Card`, `Badge`, `Alert`
- `Textarea`, `Input`, `Label`
- `Dialog`, `Sheet`, `Popover`
- `Toast`, `Sonner` notifications
- And many more...

All components are fully customizable and follow accessibility best practices.

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Google Gemini](https://ai.google.dev/) - AI image generation
- [OpenRouter](https://openrouter.ai/) - API gateway for AI models

## 📞 Support

If you have any questions or need help:

- 📧 [Create an issue](https://github.com/Singhualee/banana/issues)
- 💬 [Join our discussions](https://github.com/Singhualee/banana/discussions)
- 🐛 [Report bugs](https://github.com/Singhualee/banana/issues/new?template=bug_report.md)

---

<div align="center">

Made with ❤️ and 🍌 by [Singhualee](https://github.com/Singhualee)

[⭐ Star this repo](https://github.com/Singhualee/banana) • [🍴 Fork this repo](https://github.com/Singhualee/banana/fork)

</div>