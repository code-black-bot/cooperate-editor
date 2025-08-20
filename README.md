# 多人在线合作文档

基于 React、Next.js 和 Yjs 构建的实时多人协作文档编辑系统，支持多用户同时编辑并实时同步内容。

## 项目概述

本项目旨在提供一个高性能、低延迟的多人在线协作文档平台，让团队成员可以实时共同编辑文档内容，无需手动刷新即可看到彼此的修改。系统采用 Yjs 作为核心协作引擎，确保在网络不稳定情况下也能保持数据一致性。

## 技术栈

- **前端框架**：React 18 + Next.js 14（App Router）
- **协作引擎**：Yjs
- **富文本编辑**：Slate.js/ Tiptap（待实现）
- **实时通信**：WebSocket
- **样式解决方案**：Tailwind CSS（推荐）
- **类型检查**：TypeScript
- **构建工具**：Next.js 内置构建工具

## 快速开始

### 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/multiplayer-document.git
   cd multiplayer-document
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. **访问应用**
   打开浏览器，访问 `http://localhost:3000` 即可使用应用

5. **启动 WebSocket 协作服务**
   ```bash
   # 该服务负责处理实时协作同步
   npm run start:ws
   ```

## 功能说明

### 已实现功能

- 基础文档创建与保存
- 多人实时协作编辑（基于 Yjs）
- 实时用户在线状态显示
- 基础文本编辑功能

### 待实现功能（Todo）

#### 富文本功能
- 文本格式化（加粗、斜体、下划线等）
- 段落样式设置（标题、列表、引用等）
- 插入链接、图片等媒体内容
- 撤销 / 重做操作支持

#### 文档兼容性
- Word 文档导入与导出
- PDF 文档预览与嵌入
- 文档版本历史记录
- 文档比较与合并

#### 协作增强
- 用户光标位置实时显示
- 编辑冲突智能解决
- 评论与批注功能
- 文档权限管理

## 开发指南

### 项目结构

```
/
├── app/                  # Next.js App Router 目录
│   ├── api/              # API 路由
│   ├── documents/        # 文档相关页面
│   └── page.tsx          # 首页
├── components/           #  React 组件
│   ├── editor/           # 编辑器相关组件
│   ├── layout/           # 布局组件
│   └── collaboration/    # 协作相关组件
├── lib/                  # 工具函数与共享逻辑
│   ├── yjs/              # Yjs 相关配置
│   └── websocket/        # WebSocket 客户端
├── public/               # 静态资源
├── server/               # 服务器相关代码
│   └── websocket-server.js # WebSocket 服务端
└── package.json          # 项目依赖配置
```

### 协作原理

本项目使用 Yjs 作为核心协作引擎，通过以下流程实现实时协作：

1. 客户端通过 WebSocket 连接到协作服务器
2. 每个文档创建独立的 Yjs 文档实例
3. 用户编辑操作转换为 Yjs 操作并广播给所有连接的客户端
4. 客户端接收远程操作并应用到本地文档
5. Yjs 自动处理冲突并保持文档一致性

## 部署说明

### 开发环境

如 "快速开始" 部分所示，使用 `npm run dev` 启动前端服务，`npm run start:ws` 启动协作服务。

### 生产环境

1. **构建应用**
   ```bash
   npm run build
   ```

2. **启动生产服务**
   ```bash
   npm start
   ```

3. **部署协作服务**
   ```bash
   # 可使用 PM2 等进程管理器
   pm2 start server/websocket-server.js --name "collab-server"
   ```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 联系方式

- **项目维护者**：[你的名字 / 团队名称]
- **邮箱**：your-email@example.com
- **项目地址**：https://github.com/your-username/multiplayer-document