# 智能搜索与主页优化 - 阶段一设计文档

**日期**: 2026-04-26  
**范围**: 智能搜索功能 + 主页 UI 优化 + 洞察页面增强

## 概述

为 Nomadic 应用添加智能搜索功能，使用 Deepseek AI API 解析用户的自然语言输入，提取城市名称和用户意图，并在洞察页面展示 AI 生成的针对性内容。同时优化主页 UI，提升用户体验。

## 核心功能

### 1. 智能搜索

**目标**: 用户可以输入段落文字（如"我想去佛罗伦萨找画廊工作机会"），系统自动识别城市和关键信息。

**流程**:
1. 用户在主页搜索框输入文本
2. 前端调用 `/api/search` 后端 API
3. 后端调用 Deepseek API 解析用户输入
4. 返回：城市名称、用户意图、相关板块、AI 生成的针对性描述
5. 跳转到洞察页面，URL 携带搜索上下文参数
6. 洞察页面展示 AI 增强内容

**API 设计** (`/api/search`):

```typescript
// Request
POST /api/search
{
  "query": "我想去佛罗伦萨找画廊工作机会"
}

// Response
{
  "success": true,
  "cityName": "Florence",           // 英文城市名
  "cityNameZh": "佛罗伦萨",         // 中文城市名
  "confidence": 0.95,               // 匹配置信度 0-1
  "userIntent": "寻找画廊工作机会",  // 用户意图摘要
  "relevantSections": ["chance"],   // 相关板块: soul/base/chance/local
  "aiInsight": "佛罗伦萨作为文艺复兴的发源地，拥有众多世界级画廊...", // AI 生成的针对性描述
  "fallbackCity": null              // 如果找不到城市，推荐的替代城市
}

// 找不到城市时
{
  "success": true,
  "cityName": "Bangkok",            // AI 推荐的最匹配城市
  "cityNameZh": "曼谷",
  "confidence": 0.6,
  "userIntent": "寻找亚洲科技工作机会",
  "relevantSections": ["chance"],
  "aiInsight": "根据你的需求，曼谷是东南亚科技中心...",
  "fallbackCity": "Bangkok",
  "originalQuery": "我想去东京找科技工作"
}
```

**Deepseek Prompt 设计**:

```
你是一个城市搜索助手。用户会输入关于城市的查询，你需要：

1. 识别城市名称（支持中文、英文、大小写不敏感）
2. 提取用户意图和关键信息
3. 判断相关的信息板块（soul/base/chance/local）
4. 生成针对性的描述（50-100字）

可用城市列表：
Berlin(柏林), Amsterdam(阿姆斯特丹), Lisbon(里斯本), Bangkok(曼谷), 
Prague(布拉格), Vienna(维也纳), Paris(巴黎), Barcelona(巴塞罗那), 
Porto(波尔图), Dublin(都柏林), Dubrovnik(杜布罗夫尼克), 
Florence(佛罗伦萨), Tallinn(塔林)

如果用户输入的城市不在列表中，根据用户的完整描述推荐最匹配的城市。

用户输入：{query}

请以 JSON 格式返回：
{
  "cityName": "英文城市名",
  "cityNameZh": "中文城市名",
  "confidence": 0.0-1.0,
  "userIntent": "用户意图摘要",
  "relevantSections": ["相关板块数组"],
  "aiInsight": "针对性描述",
  "fallbackCity": "如果是推荐城市则填写，否则null"
}
```

**大小写处理**: 
- 用户输入 "florence"、"FLORENCE"、"Florence" 都能正确识别
- Deepseek 返回标准化的城市名称（首字母大写）

**国家搜索支持**:
- 用户输入国家名（如"法国"、"France"）
- 洞察页面城市栏和国家栏都显示国家名
- 四象限显示该国通用信息（需要在 cities.ts 中添加国家级数据）

### 2. 主页 UI 优化

#### 2.1 搜索框增强

**视觉设计**:
- 边框：从 0.5px → 2.5px
- 高度：从 ~40px → ~90px（支持多行输入）
- 使用 `<textarea>` 替代 `<input>`
- 聚焦时边框颜色变为主题色（`var(--accent)`）

**占位文字**（多行，有人情味）:
```
柏林
我想去佛罗伦萨的画廊工作
欧洲哪里适合一个人安静写作？
```

**交互**:
- 点击搜索按钮或按 Enter 触发搜索
- 显示加载状态（按钮文字变为"搜索中..."）
- 搜索成功后触发页面翻转动画

#### 2.2 城市标签区域

**随机显示**:
- 每次页面加载时从所有欧洲城市中随机抽取
- 填满两行（约 8-10 个城市）
- 使用 `Math.random()` + `shuffle` 算法

**"随机探索"按钮**:
- 最后一格固定显示"随机探索"
- 点击后：
  1. 调用 `/api/search` 传入 `{ query: "随机推荐一个欧洲城市" }`
  2. AI 返回随机推荐的城市
  3. 跳转到洞察页面

**Hover 效果**:
```css
transform: scale(1.04);
border-width: 1.5px;
transition: all 150ms ease;
```

**Click 效果**:
```css
font-weight: 600;
transform: scale(1.06);
transition: all 100ms ease;
```

#### 2.3 四个象限区域

**标题**:
- 在四个象限上方添加：`—— 洞察四个象限 ——`
- 样式：小字、居中、淡色

**交互**:
- 点击象限时：搜索框边框高亮（pulse 动画）
- 不跳转到洞察页面
- Pulse 动画：
```css
@keyframes pulse {
  0%, 100% { border-color: var(--accent); box-shadow: 0 0 0 0 rgba(29,158,117,0.4); }
  50% { border-color: var(--accent); box-shadow: 0 0 0 8px rgba(29,158,117,0); }
}
```

#### 2.4 操作引导弹窗

**显示逻辑**:
- 仅首次访问显示
- 使用 `localStorage.getItem('hasSeenGuide')` 判断
- 显示后设置 `localStorage.setItem('hasSeenGuide', 'true')`

**视觉设计**:
- 半透明黑色遮罩（`rgba(0,0,0,0.5)`）
- 白色卡片居中显示
- 右上角关闭按钮（X）
- 圆角、阴影

**内容**:
```
欢迎来到 Nomadic 🌍

在搜索框输入你想去的城市，
或描述你的旅居想法，
我们会为你找到最合适的目的地。

[知道了]
```

#### 2.5 报错处理

**报错弹窗**:
- 半透明浮层，居中显示
- 显示文案："哎呀我没理解"
- 1 秒后自动淡出消失
- 淡出动画：`opacity: 1 → 0`，持续 300ms

**触发条件**:
- Deepseek API 调用失败
- 返回的 confidence < 0.3（置信度太低）

#### 2.6 世界地图

**实现方案**:
- 使用 SVG 绘制简化的世界地图轮廓
- 城市坐标数据：
```typescript
const CITY_COORDINATES: Record<string, { x: string; y: string }> = {
  Berlin: { x: '52%', y: '35%' },
  Paris: { x: '48%', y: '38%' },
  Florence: { x: '51%', y: '42%' },
  // ... 其他城市
}
```

**视觉效果**:
- 地图轮廓：淡灰色描边
- 城市标记：发光的圆点
- 点击城市标记跳转到洞察页面

**SVG 地图资源**:
- 从 [Natural Earth](https://www.naturalearthdata.com/) 获取简化的世界地图 SVG
- 或使用 [amCharts Maps](https://www.amcharts.com/svg-maps/) 的开源地图

#### 2.7 页面翻转动画

**搜索跳转动画**:
```css
@keyframes flipToInsights {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(-180deg); }
}
```

**底部导航切换动画**:
- 主页 → 洞察：向左翻转
- 洞察 → 主页：向右翻转
- 根据 tab 索引判断方向

**实现**:
- 使用 Framer Motion 或 CSS transitions
- 动画时长：400ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### 3. 洞察页面增强

#### 3.1 无城市状态

**显示逻辑**:
- 当 URL 没有城市参数时（直接访问 `/insights`）
- 或 `selectedCity` 为空时

**显示内容**:
- 城市名：`世界上的某座城市`
- 国家名：`世界上的某个国家`
- 四象限：只显示通用介绍，不显示具体数据

**通用介绍文案**:
```typescript
const GENERIC_INSIGHTS = {
  soul: {
    headline: '每座城市都有自己的灵魂',
    sub: '等待你去发现它的文化、历史与独特气质'
  },
  base: {
    description: '了解一座城市的生存基准：网络、物价、签证、医疗'
  },
  chance: {
    description: '探索当地的商业机会与职业发展可能性'
  },
  local: {
    description: '找到志同道合的人，融入本地社群'
  }
}
```

#### 3.2 AI 增强内容

**显示位置**:
- 在相关板块顶部添加 AI 生成的描述卡片
- 卡片样式：浅色背景、左侧有装饰条

**高亮效果**:
- 相关板块边框加粗
- 背景色稍微加深
- 添加脉冲动画（可选）

**示例**:
```
┌─────────────────────────────────────┐
│ 💡 根据你的搜索                      │
│ 佛罗伦萨作为文艺复兴的发源地，拥有   │
│ 众多世界级画廊如乌菲兹美术馆...     │
└─────────────────────────────────────┘

💼 CHANCE 商业机会  ← 高亮边框
┌─────────────────────────────────────┐
│ 佛罗伦萨是全球时尚、皮革工艺与...   │
│ ...                                 │
└─────────────────────────────────────┘
```

**数据传递**:
- 通过 URL 参数传递搜索上下文：
```
/insights?city=Florence&intent=画廊工作&sections=chance&insight=base64编码的描述
```
- 或使用 AppContext 存储搜索结果

#### 3.3 国家搜索

**数据结构**:
```typescript
interface CountryData {
  name: string
  nameZh: string
  flag: string
  soul: { headline: string; sub: string }
  base: { description: string }
  chance: { description: string }
  local: { description: string }
}

const COUNTRIES: Record<string, CountryData> = {
  France: { ... },
  Italy: { ... },
  // ...
}
```

**显示逻辑**:
- 城市栏和国家栏都显示国家名
- 四象限显示国家级通用信息

## 技术实现

### 文件结构

```
app/
  api/
    search/
      route.ts          # 新增：搜索 API
  page.tsx              # 修改：主页 UI 优化
  insights/
    page.tsx            # 修改：洞察页面增强
components/
  SearchBox.tsx         # 新增：搜索框组件
  WorldMap.tsx          # 新增：世界地图组件
  GuideModal.tsx        # 新增：操作引导弹窗
  ErrorToast.tsx        # 新增：报错提示
  PageTransition.tsx    # 新增：页面翻转动画
data/
  cities.ts             # 修改：添加城市坐标
  countries.ts          # 新增：国家数据
  genericInsights.ts    # 新增：通用洞察文案
lib/
  deepseek.ts           # 新增：Deepseek API 客户端
  cityMatcher.ts        # 新增：城市匹配逻辑
utils/
  shuffle.ts            # 新增：数组随机打乱
```

### 依赖

**新增依赖**:
- Deepseek SDK（或使用 fetch 直接调用）
- Framer Motion（页面动画，可选）

**环境变量**:
```env
DEEPSEEK_API_KEY=sk-...
```

### 关键代码片段

#### `/api/search` 实现

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  
  // 调用 Deepseek API
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      response_format: { type: 'json_object' }
    })
  })
  
  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)
  
  return NextResponse.json(result)
}
```

#### 搜索框组件

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSearch = async () => {
    setLoading(true)
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    })
    const result = await res.json()
    
    // 跳转到洞察页面
    const params = new URLSearchParams({
      city: result.cityName,
      intent: result.userIntent,
      sections: result.relevantSections.join(','),
      insight: btoa(encodeURIComponent(result.aiInsight))
    })
    router.push(`/insights?${params}`)
  }
  
  return (
    <div className="search-box">
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="柏林\n我想去佛罗伦萨的画廊工作\n欧洲哪里适合一个人安静写作？"
        rows={3}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? '搜索中...' : 'GO'}
      </button>
    </div>
  )
}
```

## 边界情况处理

1. **Deepseek API 失败**: 显示报错弹窗，1秒后消失
2. **置信度过低**: 显示报错弹窗
3. **空输入**: 不触发搜索
4. **网络超时**: 10秒超时，显示报错
5. **城市不存在**: AI 推荐最匹配的城市
6. **国家搜索但数据不存在**: 显示通用国家信息

## 性能优化

1. **搜索防抖**: 用户停止输入 500ms 后才触发搜索建议
2. **结果缓存**: 相同查询缓存 5 分钟
3. **地图懒加载**: 地图组件使用 `React.lazy()`
4. **动画性能**: 使用 `transform` 和 `opacity`，避免 `width`/`height`

## 测试用例

1. 输入"巴黎" → 跳转到巴黎洞察页
2. 输入"我想去佛罗伦萨找画廊工作" → 跳转到佛罗伦萨，显示 AI 描述，高亮商业机会板块
3. 输入"florence" → 正确识别为 Florence
4. 输入"我想去东京找科技工作" → AI 推荐曼谷
5. 输入"法国" → 显示法国的国家级信息
6. 点击"随机探索" → 跳转到随机城市
7. 首次访问 → 显示操作引导弹窗
8. 再次访问 → 不显示操作引导
9. API 失败 → 显示报错弹窗 1 秒后消失
10. 点击四象限 → 搜索框高亮脉冲

## 未来扩展

1. **语音输入**: 添加语音识别功能
2. **搜索历史**: 记录用户搜索历史
3. **智能推荐**: 根据用户行为推荐城市
4. **多语言支持**: 支持英文、西班牙文等
5. **更多城市**: 扩展到全球城市数据库
