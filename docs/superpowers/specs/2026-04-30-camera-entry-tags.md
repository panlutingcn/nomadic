# 印迹拍照入口页 & 标签限制 设计文档

**日期：** 2026-04-30
**功能：** 点击"印迹"导航按钮进入拍照页，支持拍照或相册上传，确认图片后跳转编辑页；标签添加上限 10 个

---

## 目标

1. 点击底部导航"印迹"按钮，直接进入全屏拍照页（而非现有编辑页）
2. 用户在拍照页完成选图/拍照并确认后，才跳转到印迹编辑页，图片自动填入
3. 印迹编辑页的标签区域支持添加/删除，上限 10 个，超出时提示"最多添加 10 个标签"

---

## 路由结构

| 路由 | 说明 |
|------|------|
| `/story/camera` | 新建：全屏拍照入口页 |
| `/story` | 修改：印迹编辑页，接收图片数据，完善标签交互 |
| `BottomNav` | 修改：印迹按钮跳转改为 `/story/camera` |

---

## 页面一：拍照入口页 `/story/camera`

### 布局（从上到下）

**状态一：待拍摄**
- 全屏深色背景（`#111`）
- 顶部：左侧 ✕ 关闭按钮（`router.back()`），中间"印迹"文字，右侧空白
- 中间：取景框区域（使用 `<video>` 元素显示摄像头预览，或占位区域）
- 底部操作栏（`background: #111`）：
  - 左：相册按钮（图标 + "相册"文字），点击触发 `<input type="file" accept="image/*">`
  - 中：快门按钮（白色圆形，直径 60px，外圈 border）
  - 右：空白占位（保持三列对称）

**状态二：已选图/已拍摄（预览）**
- 取景框区域替换为所选图片预览（`objectFit: cover`）
- 底部操作栏切换为：
  - 左：✕ 按钮（灰色圆形）+ "重拍"文字 → 清除图片，回到状态一
  - 右：✓ 按钮（绿色圆形，`var(--accent)`）+ "使用"文字 → 确认，跳转编辑页

### 图片传递方式

使用 `sessionStorage`：
- 确认图片时，将图片的 `objectURL`（`URL.createObjectURL(file)`）存入 `sessionStorage.setItem('pendingPhoto', url)`
- 跳转到 `/story`
- `/story` 页面在 `useEffect` 中读取并清除该值：`sessionStorage.getItem('pendingPhoto')`

### 相机权限

- 使用 `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` 请求后置摄像头
- 若浏览器不支持或用户拒绝权限：隐藏取景框，仅显示相册入口，不报错崩溃
- 快门按钮：调用 `canvas.drawImage(video, ...)` 截取当前帧，转为 blob URL

---

## 页面二：印迹编辑页 `/story`（修改）

### 图片读取

在组件顶部 `useEffect` 中：
```ts
useEffect(() => {
  const pending = sessionStorage.getItem('pendingPhoto')
  if (pending) {
    setPhoto(pending)
    sessionStorage.removeItem('pendingPhoto')
  }
}, [])
```

### 标签交互（完善现有标签区域）

**当前状态：** 标签固定为 `[city, '2025']`，"+ 添加"按钮无功能

**目标状态：**
- 初始标签：`[city]`（去掉硬编码的 `'2025'`）
- 每个标签右侧有 ✕ 删除按钮
- 点击"+ 添加"：显示一个 inline 输入框，回车或失焦确认添加
- 标签上限：10 个
- 超出时：不显示"+ 添加"按钮，改为显示提示文字"最多添加 10 个标签"（`fontSize: 10, color: var(--text-muted)`）
- 发布时 `tags` 使用 state 中的标签数组

---

## 数据流

```
BottomNav 点击"印迹"
  → router.push('/story/camera')
  → 用户拍照或选相册
  → 确认图片
  → sessionStorage.setItem('pendingPhoto', objectURL)
  → router.push('/story')
  → StoryPage useEffect 读取 pendingPhoto → setPhoto(url)
  → 用户编辑标题/叙述/标签
  → 发布
```

---

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `app/story/camera/page.tsx` | 新建 | 全屏拍照入口页 |
| `app/story/page.tsx` | 修改 | 读取 pendingPhoto，完善标签增删逻辑 |
| `components/BottomNav.tsx` | 修改 | 印迹按钮跳转改为 `/story/camera` |

---

## 样式规范

- 拍照页背景：`#111`（深色，模拟相机界面）
- 快门按钮：白色圆形，直径 60px，外圈 `border: 3px solid #fff`
- ✕ 按钮：`border: 2px solid #666`，深色背景
- ✓ 按钮：`border: 2px solid var(--accent)`，`background: rgba(29,158,117,0.15)`，图标颜色 `var(--accent)`
- 编辑页标签样式与现有保持一致，删除按钮为小号 ✕
