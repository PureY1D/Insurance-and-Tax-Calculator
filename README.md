# ITC 4.0 - 社保个税计算器

ITC (Insurance and Tax Calculator) 是一款专业的社保和个人所得税计算工具。

## 功能特性

### 三种计算模式

1. **简易模式** - 快速输入，获取简要结果
2. **学习模式** - 详细计算过程，包含法律依据和知识卡片
3. **配置模式** - 管理默认配置和自定义配置

### 计算功能

#### 社保计算
- 企业职工五险一金计算
- 灵活就业社保计算
- 支持自定义缴费基数和比例

#### 个税计算
- 年度综合所得计算
- 经营所得计算
- 比例税率所得计算
- 专项附加扣除支持

### 配置管理

- 默认配置（宁波2026）
- 最多3个自定义配置
- 配置导入/导出功能
- 配置恢复默认

## 技术栈

- **框架**: uni-app + Vue 3
- **语言**: TypeScript
- **状态管理**: Pinia
- **构建工具**: Vite

## 开发指南

### 环境要求

- Node.js >= 16.0
- pnpm >= 8.0
- 微信开发者工具

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5
```

### 构建生产版本

```bash
# 微信小程序
pnpm build:mp-weixin

# H5
pnpm build:h5
```

### 微信开发者工具

1. 打开微信开发者工具
2. 导入项目目录：`dist/build/mp-weixin`
3. 填写AppID（在manifest.json中配置）
4. 开始预览和调试

## 项目结构

```
itc-4.0/
├── src/
│   ├── pages/              # 页面
│   │   ├── index/          # 简易模式
│   │   ├── learning/       # 学习模式
│   │   └── config/         # 配置模式
│   ├── components/         # 公共组件
│   ├── services/           # 服务层
│   │   ├── calculator.ts   # 计算引擎
│   │   ├── storage.ts      # 存储服务
│   │   └── configService.ts# 配置服务
│   ├── stores/             # 状态管理
│   ├── types/              # TypeScript类型
│   ├── utils/              # 工具函数
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   ├── pages.json          # 页面配置
│   ├── manifest.json       # 应用配置
│   └── uni.scss            # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 默认配置

默认配置为宁波地区2026年社保政策：

- 五险基数：4,986 ~ 38,907 元
- 单位养老：14%
- 单位医疗：7%
- 单位失业：0.3%
- 单位工伤：0.2%
- 个人养老：8%
- 个人医疗：2%
- 个人失业：0.5%
- 公积金：5% ~ 12%

## 许可证

MIT License
