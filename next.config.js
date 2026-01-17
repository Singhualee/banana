/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置日志级别
  logging: {
    fetches: {
      fullUrl: false,
    },
    level: 'error', // 只显示错误日志
  },
  // 禁用生产环境源映射
  productionBrowserSourceMaps: false,
  // 简化的Turbopack配置
  turbopack: {},
}

module.exports = nextConfig