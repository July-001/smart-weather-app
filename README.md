# 智能天气查询应用

一款查询城市天气、未来 7 天预报并根据天气给出穿衣建议的 Web 应用，支持收藏常用城市，方便日常出行决策。

> 技术栈：Vue3 + Vite + JavaScript + Pinia + Vue Router + Element Plus + Axios + Open-Meteo API + localStorage

## 项目简介

本项目是一个基于 Vue3 的智能天气查询 Web 应用。用户可以搜索任意城市查看当前天气与未来 7 天预报，应用会根据温度、降水概率、风速等条件自动生成个性化穿衣建议；同时支持收藏常用城市，便于快速切换查询。项目已独立完成并部署上线。

## 功能特性

- **城市天气查询**：封装 Axios 请求 Open-Meteo 免费 API，统一处理 loading、error 状态，请求异常时给出友好提示。
- **未来 7 天预报**：展示未来一周的天气趋势，辅助出行规划。
- **智能穿衣建议**：设计天气代码映射工具，将 WMO 天气代码转换为中文描述与图标，并基于温度、降水概率、风速等规则生成个性化穿衣建议。
- **收藏城市**：使用 Pinia 管理当前城市、天气数据和收藏列表，收藏城市持久化到 localStorage，支持快速切换与删除，刷新后数据保留。
- **交互细节**：搜索防抖、空状态、错误重试等细节处理，优化移动端布局与横向滚动体验，页面简洁美观。

## 技术架构

| 模块 | 说明 |
| --- | --- |
| Vue3 + Vite | 前端框架与构建工具，开发体验快、热更新流畅 |
| Vue Router | 页面路由管理 |
| Pinia | 全局状态管理（当前城市、天气数据、收藏列表） |
| Element Plus | UI 组件库 |
| Axios | 封装统一请求层，对接 Open-Meteo API |
| Open-Meteo API | 免费天气数据来源（城市搜索 + 天气预报） |
| localStorage | 收藏城市持久化存储 |

## 项目结构

```
smart-weather-app/
├── public/                 # 静态资源
├── src/
│   ├── api/                # Axios 封装与 Open-Meteo API 请求
│   ├── assets/             # 样式与静态资源
│   ├── components/         # 通用组件（天气卡片、搜索框、收藏列表等）
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理（city / weather / favorites）
│   ├── utils/              # 工具函数（WMO 天气代码映射、穿衣建议规则）
│   ├── views/              # 页面视图
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── index.html
├── package.json
└── vite.config.js
```

## 快速开始

### 环境要求

- Node.js >= 16
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:5173 即可使用。

### 构建与部署

```bash
npm run build
```

构建产物输出至 `dist` 目录，可部署到任意静态托管服务（如 Vercel、Netlify、GitHub Pages 等）。

## 数据接口说明

项目使用 [Open-Meteo](https://open-meteo.com/) 提供的免费公开 API，无需 API Key：

- **城市搜索**：Geocoding API，根据关键词返回城市名称、经纬度等信息
- **天气预报**：Forecast API，根据经纬度返回当前天气与未来 7 天预报

## 核心实现说明

### 1. 请求层封装

统一封装 Axios 请求 Open-Meteo API，集中管理 loading 与 error 状态，保证请求异常时有友好提示，并通过错误重试机制提升可用性。

### 2. WMO 天气代码映射

设计天气代码映射工具，将 Open-Meteo 返回的 WMO 天气代码转换为中文描述与对应图标，展示更直观。

### 3. 穿衣建议生成

基于温度、降水概率、风速等规则计算个性化穿衣建议，让天气数据真正服务于日常出行决策。

### 4. 数据结构定义

使用 JavaScript + JSDoc 注释 `City`、`WeatherData`、`DailyForecast` 等数据结构，保证 API 数据清晰，提升代码健壮性与可维护性。

### 5. 收藏持久化

收藏列表通过 Pinia 统一管理，并同步写入 localStorage，刷新页面后数据保留，支持收藏城市的快速切换与删除。

## 交互优化

- 搜索输入防抖，减少无效请求
- 搜索无结果与数据加载时的空状态展示
- 请求失败后的错误重试
- 移动端布局适配与横向滚动体验优化

## License

MIT
