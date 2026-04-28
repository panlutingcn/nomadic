# 用户登录与认证系统设计

**日期：** 2026-04-28  
**状态：** 已批准

---

## 概述

为 Nomadic 应用添加用户认证系统，使用 Supabase Auth 实现邮箱和手机号登录。登录后用户数据从 Supabase 拉取，未登录时保持现有默认行为不变。

---

## 技术栈

- **认证：** Supabase Auth（邮箱 Magic Link + 手机号 OTP）
- **数据库：** Supabase PostgreSQL
- **SDK：** `@supabase/supabase-js`

**环境变量：**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 数据库表结构

### `profiles`
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 对应 auth.users.id |
| nickname | text | 用户昵称（必填） |
| avatar_url | text | 头像 URL（可选，后续在领地页上传） |
| created_at | timestamptz | 创建时间 |

### `imprints`
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| user_id | uuid (FK) | 关联 auth.users.id |
| city | text | 城市名（英文） |
| title | text | 标题 |
| narrative | text | 正文 |
| tags | text[] | 标签数组 |
| is_public | boolean | 是否公开 |
| likes | integer | 点赞数 |
| created_at | timestamptz | 创建时间 |
| photo_url | text | 照片 URL（可选） |

### `saved_cities`
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| user_id | uuid (FK) | 关联 auth.users.id |
| city_name | text | 城市名（英文） |
| country | text | 国家名 |
| saved_at | timestamptz | 收藏时间 |

**RLS 策略：**
- `profiles`：用户只能读写自己的记录
- `imprints`：用户只能写自己的记录；`is_public = true` 的记录所有人可读
- `saved_cities`：用户只能读写自己的记录

---

## 架构

### 新增文件
- `lib/supabase.ts` — Supabase 客户端初始化
- `context/AuthContext.tsx` — 认证状态管理
- `components/LoginModal.tsx` — 登录弹窗（三步流程）
- `components/BottomBubbles.tsx` — 替换 ContactBubble，双气泡布局

### 修改文件
- `context/AppContext.tsx` — 登录后从 Supabase 拉取数据，未登录保持示例数据
- `app/page.tsx` — 替换 `<ContactBubble />` 为 `<BottomBubbles />`
- `app/vault/page.tsx` — 未登录时显示登录引导，登录后显示真实数据
- `app/layout.tsx` — 包裹 `AuthProvider`

---

## 登录弹窗流程

### 步骤 1：选择方式 + 输入
- Tab 切换：邮箱 / 手机号
- 输入框 + 发送验证码按钮
- 邮箱：发送 Magic Link（Supabase 邮件）
- 手机号：发送 6 位 OTP（Supabase 短信）

### 步骤 2：输入验证码
- 6 位验证码输入框
- 确认登录按钮
- 重新发送（60 秒倒计时）
- 邮箱 Magic Link 模式：提示用户去邮箱点击链接

### 步骤 3：仅新用户 — 设置昵称
- 系统检测 `profiles` 表中是否存在该用户
- 新用户：显示昵称输入框，写入 `profiles` 表
- 老用户：直接完成登录

**视觉规格：**
- 背景：半透明遮罩 `rgba(0,0,0,0.4)`
- 弹窗：白色卡片，`border-radius: 20px`，`max-width: 420px`，移动端全宽
- 配色：沿用项目暖棕色系（`--bg-page`, `--accent`, `--text-primary`）
- Tab 切换：邮箱/手机号，激活态用 `--accent` 下划线

---

## 首页底部双气泡布局

替换现有 `ContactBubble`，新增 `BottomBubbles` 组件：

```
┌─────────────────────────────────────┐
│  [联系共创]          [登录账号]      │
│  期待听到你的声音    解锁你的全球版图 │
└─────────────────────────────────────┘
```

**规格：**
- 两个气泡各占 50%，总宽度等于内容区（`padding: 0 16px`）
- 左气泡（联系共创）：尾巴朝左，点击打开 ContactModal
- 右气泡（登录账号）：尾巴朝右，点击打开 LoginModal
- 登录后右气泡变为：用户昵称首字母头像 + 昵称，点击进入 `/vault`
- 气泡边框：`1px solid`，背景色 `#ede8df`（比现有稍深）
- 两行文字：第一行 `fontWeight: 600`，第二行浅色副标题

---

## 数据层行为

### 未登录
- `imprints`：使用现有示例数据（`SAMPLE_IMPRINTS`）
- `savedCities`：使用现有预设数据
- 全球版图：显示现有示例城市
- 领地页：显示示例数据 + 登录引导横幅

### 登录后
- `imprints`：从 Supabase `imprints` 表拉取（`user_id = 当前用户`）
- `savedCities`：从 Supabase `saved_cities` 表拉取
- 全球版图：只显示用户自己收藏的城市
- 领地页：只显示用户真实数据

---

## 不在本次范围内

- 微信 OAuth 集成（后续迭代）
- 搜索次数限制（已放弃）
- 头像上传（在领地页后续实现）
- 社区公开印迹的点赞/收藏同步（后续迭代）
