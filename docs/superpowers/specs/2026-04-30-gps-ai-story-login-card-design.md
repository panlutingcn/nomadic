# GPS城市识别、AI故事生成与登录卡片设计文档

## 概述

为印迹发布流程添加三项改进：
1. GPS自动识别城市，自动生成城市和年份标签
2. AI自动生成印迹故事，支持以用户输入为素材进行丰富
3. 登录弹窗改为speech bubble小卡片风格

---

## 架构

**数据流：**
用户拍照 → 确认照片时捕获GPS坐标 → 存入sessionStorage → 印迹页读取GPS → 调用Nominatim反向地理编码 → 获得城市名（中文显示）→ 自动生成两个标签（城市中文名 + 年份）→ 自动触发AI生成故事

**涉及文件：**
- `app/story/camera/page.tsx` — 新增GPS捕获逻辑
- `app/story/page.tsx` — 反向地理编码、自动标签、自动AI生成、验证、登录弹窗重设计
- `app/api/generate-narrative/route.ts` — 新增 `userInput` 参数支持

---

## 1. 相机页 GPS 捕获

**触发时机：** 用户点击"使用此照片"确认按钮时

**实现：**
- 调用 `navigator.geolocation.getCurrentPosition()`
- 成功时将坐标存入 sessionStorage，key 为 `pendingGPS`
- 失败时静默处理（权限拒绝、超时等），印迹页回退到手动输入

**数据格式：**
```typescript
interface GPSData {
  lat: number
  lon: number
  timestamp: number  // Date.now()，用于提取年份
}
sessionStorage.setItem('pendingGPS', JSON.stringify({ lat, lon, timestamp }))
```

**错误处理：**
- `PERMISSION_DENIED`：静默跳过，不阻塞导航
- `TIMEOUT`：静默跳过，不阻塞导航
- GPS不可用：静默跳过

---

## 2. 印迹页反向地理编码与自动生成

### 2.1 反向地理编码

**API：** OpenStreetMap Nominatim（免费，无需密钥）
```
GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}
```

**城市名提取优先级：**
1. `address.city`
2. `address.town`
3. `address.village`
4. `address.county`

**城市名映射（英文 → 中文）：**
```typescript
const CITY_NAME_MAP: Record<string, string> = {
  Berlin: '柏林',
  Amsterdam: '阿姆斯特丹',
  Lisbon: '里斯本',
  Prague: '布拉格',
  Tallinn: '塔林',
  // 其他城市：直接使用原名
}
```
若城市名不在映射表中，直接使用Nominatim返回的原始城市名。

**城市字段显示：**
- 城市归属方框显示中文城市名（GPS识别或手动输入均为中文）
- 内部 `city` 状态存储中文名，AI调用时也传中文名

### 2.2 自动标签生成

GPS识别成功后，自动生成两个标签：
1. 城市中文名（如"柏林"）
2. 拍照年份（从 `pendingGPS.timestamp` 提取，如"2026"）

```typescript
const cityZh = CITY_NAME_MAP[cityEn] ?? cityName
const year = String(new Date(gpsData.timestamp).getFullYear())
setTags([cityZh, year])
```

### 2.3 自动AI生成

GPS识别并设置城市后，自动调用 `generateWithAI()`，无需用户手动点击。

### 2.4 移除的内容

- 删除 `selectedCity || 'Berlin'` 默认值 → 初始城市为空字符串
- 删除 `AI_NARRATIVES` 静态映射
- 删除 `narrativeIdx` 和 `narrativeVariants`（不再需要循环切换）
- 初始 `tags` 为空数组（等待GPS或手动添加）
- 初始 `narrative` 为空字符串（等待AI生成或手动输入）

---

## 3. 发布验证

**必填项：**
- 城市归属（`city` 不为空字符串）
- 标签中必须包含城市名（`tags` 中存在与 `city` 相同的标签）

**选填项：**
- 印迹故事（`narrative` 可为空）

**验证反馈：**
- 点击"发布到社区"或"存入我的领地"时触发验证
- 未通过的字段触发红框闪烁动画（无声）
- 动画：CSS `@keyframes borderFlash`，边框颜色闪烁2次

```css
@keyframes borderFlash {
  0%, 100% { border-color: var(--border) }
  50% { border-color: #c04040 }
}
/* animation: borderFlash 0.4s ease 2 */
```

- 动画结束后边框恢复正常
- 使用 React state `flashCity: boolean` 控制城市字段动画触发
- 使用 React state `flashTags: boolean` 控制标签区域动画触发

**手动修改城市时的标签处理：**
- 用户手动编辑城市字段并确认（onBlur）后，若标签列表中不存在该城市名，自动将新城市名添加为标签（替换旧城市标签）
- 与现有的 `useEffect` 监听 `city` 变化逻辑一致

---

## 4. AI生成API改进

**新增请求参数：**
```typescript
{
  city: string
  imageBase64?: string
  userInput?: string  // 用户已输入的内容，作为素材
}
```

**提示词逻辑：**

若 `userInput` 存在且非空：
```
你是一位擅长城市文化叙事的作家。请以下面的内容为素材，进行丰富和完善，写一段100字左右的印迹故事。

用户提供的素材：
${userInput}

城市：${city}
${imageBase64 ? '请同时参考照片中的场景。' : ''}

要求：
- 保留用户素材的核心意图和情感
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 只输出故事正文，不要标题或解释
```

若 `userInput` 为空：
```
你是一位擅长城市文化叙事的作家。请根据${imageBase64 ? '这张照片和' : ''}城市"${city}"，写一段100字左右的印迹故事。
要求：
- 融入该城市的历史文化特色
- 第一人称，有温度，有细节
- 不要泛泛而谈，要有具体的城市意象
- 只输出故事正文，不要标题或解释
```

---

## 5. 登录弹窗重设计

**样式：** 居中speech bubble卡片（与删除确认弹窗一致）

**结构：**
- 遮罩：`rgba(0,0,0,0.3)`，居中对齐
- 卡片：`background: #f0ebe0`，`borderRadius: 14`，`maxWidth: 320`
- 向下三角尾巴：CSS border trick，`bottom: -8px`，居中

**登录选项：** 手机号 / 邮箱（移除微信）

**手机号登录：**
- `type="tel"` 输入框，placeholder "输入你的手机号"
- 确认登录按钮

**邮箱登录：**
- `type="email"` 输入框，placeholder "输入你的邮箱"
- 确认登录按钮

**取消按钮：** 保留，关闭弹窗

---

## 错误处理汇总

| 场景 | 处理方式 |
|------|---------|
| GPS权限拒绝 | 静默跳过，城市字段为空，用户手动输入 |
| GPS超时 | 静默跳过，城市字段为空，用户手动输入 |
| Nominatim请求失败 | 静默跳过，城市字段为空，用户手动输入 |
| AI生成失败 | 保持narrative为空，用户可手动输入或重试 |
| 发布时城市为空 | 红框闪烁提示，阻止发布 |
| 发布时无城市标签 | 红框闪烁提示标签区域，阻止发布 |
