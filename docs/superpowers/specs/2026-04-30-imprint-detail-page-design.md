# 印迹详情页设计文档

**日期：** 2026-04-30  
**功能：** 遇见 & 领地页面帖子点击查看完整内容

---

## 目标

为遇见（Meet）和领地（Vault）页面的印迹卡片添加点击跳转功能，进入独立的详情页查看完整内容，并支持分享。

---

## 路由结构

新增路由：`/app/imprint/[id]/page.tsx`

- 动态路由，`[id]` 对应 `Imprint.id`
- 遇见和领地共用同一个详情页
- 修改 `/app/meet/page.tsx` 和 `/app/vault/page.tsx`，给卡片添加 `onClick` 导航到 `/imprint/{imp.id}`

---

## 页面布局（从上到下）

### 顶部导航栏
- 左侧：返回按钮（`router.back()`）
- 右侧：分享按钮

### 主体内容区
- **大图**：印迹照片，宽度 100%，高度约 240px，`objectFit: cover`；无照片时显示城市色块占位
- **城市标签**：浮动在照片左上角，中文城市名
- **标题**：字号 18-20，fontWeight 500
- **作者信息**：头像（字母占位）+ 用户名 + 发布时间，横向排列
- **完整叙述**：完整 `narrative` 文本，不截断，行高 1.6
- **标签列表**：所有 `tags`，横向排列可换行
- **互动区域**：点赞按钮 + 点赞数（公开印迹）、分享按钮

### 底部
- 公开印迹：显示"查看更多来自社区的印迹"→ 跳转 `/meet`
- 私人印迹：显示"返回我的领地"→ 跳转 `/vault`

---

## 数据获取

```ts
const { allPublicImprints, imprints } = useApp()
const allImprints = [...allPublicImprints, ...imprints.filter(i => !i.isPublic)]
const imprint = allImprints.find(i => i.id === params.id)
```

- 找不到 id：显示"印迹不存在"+ 返回按钮

---

## 交互行为

### 卡片点击
- 遇见 & 领地：点击整个卡片区域触发 `router.push('/imprint/${imp.id}')`

### 返回导航
- 详情页返回按钮：`router.back()`，保持浏览历史

### 分享功能
1. 优先使用 `navigator.share`（Web Share API）
2. 降级：复制链接到剪贴板，显示 toast 提示"链接已复制"，3 秒后消失

### 点赞
- 仅公开印迹显示
- 点击后本地状态 +1（不持久化）
- 简单动画反馈

---

## 样式规范

- 与现有页面保持一致：使用 `var(--bg-page)`、`var(--bg-card)`、`var(--text-primary)` 等 CSS 变量
- 城市名映射：`{ Berlin: '柏林', Amsterdam: '阿姆斯特丹', Lisbon: '里斯本', Prague: '布拉格', Tallinn: '塔林' }`
- 圆角、间距、字号与 meet/vault 页面保持一致

---

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/imprint/[id]/page.tsx` | 新建 | 印迹详情页 |
| `app/meet/page.tsx` | 修改 | 卡片添加 onClick 跳转 |
| `app/vault/page.tsx` | 修改 | 卡片添加 onClick 跳转 |
