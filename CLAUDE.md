# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 16 的 AI 图像编辑器应用，名为 "Banana Editor"。项目使用 React 19、TypeScript 和 Tailwind CSS 构建，UI 组件基于 shadcn/ui 库。

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行 ESLint 检查
pnpm lint
```

## 技术栈架构

### 核心框架
- **Next.js 16**: 使用 App Router 架构
- **React 19**: 带有最新特性
- **TypeScript**: 严格模式配置

### UI 组件系统
- **shadcn/ui**: 基于 Radix UI 的组件库
  - 位置：`components/ui/`
  - 配置文件：`components.json`
  - 样式：New York 风格，使用 CSS 变量
- **Tailwind CSS 4.1.9**: 用于样式
- **Lucide React**: 图标库

### 项目结构

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件库
│   ├── image-uploader.tsx # 图像上传组件
│   └── [其他页面组件]
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数
├── public/               # 静态资源
└── styles/               # 额外样式文件
```

### 路径别名配置

TypeScript 和模块解析配置了以下路径别名：
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/utils` → `./lib/utils`

## 组件开发指南

### UI 组件使用
- 所有 UI 组件从 `@/components/ui` 导入
- 遵循 shadcn/ui 的组件模式和 props 接口
- 使用 `class-variance-authority` (CVA) 进行变体管理

### 样式规范
- 使用 Tailwind CSS 类名
- 通过 `cn()` 工具函数合并类名（位于 `lib/utils.ts`）
- 优先使用 CSS 变量进行主题定制

### 状态管理
- 当前使用 React 内置状态管理（useState, useRef 等）
- 表单处理使用 `react-hook-form` 配合 `zod` 验证

## 特殊功能

### 图像上传组件 (`components/image-uploader.tsx`)
- 支持拖拽上传
- 文件类型验证
- Base64 转换
- 模拟 AI 处理流程

### 主题系统
- 使用 `next-themes` 支持暗色/亮色模式切换
- 主题提供者位于 `components/theme-provider.tsx`

## 注意事项

1. **包管理器**: 项目使用 `pnpm`（存在 `pnpm-lock.yaml`）
2. **TypeScript 配置**: 严格模式启用，目标 ES6
3. **构建输出**: 使用 Next.js 默认配置
4. **分析工具**: 集成 Vercel Analytics
5. **图标系统**: 统一使用 Lucide React 图标库

## 开发建议

- 新增 UI 组件时优先考虑使用 shadcn/ui 的现有组件
- 遵循 React 19 的最佳实践
- 保持 TypeScript 严格模式的类型安全
- 利用项目预设的路径别名简化导入路径