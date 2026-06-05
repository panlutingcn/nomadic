# Nomadic 🌍

**为旅居者与数字游民深度解读每一座城市**

*Unveiling the essence of every city for digital nomads and global wanderers.*

> 在世界各地扎根，而不只是路过。

**Live Demo → [nomadictree.io](https://nomadictree.io)**

---

## What is Nomadic?

Nomadic is a deep city insight platform built for digital nomads and global wanderers. We aggregate information scattered across dozens of platforms — visa guides, cost of living data, local communities, business opportunities — into one structured, honest picture of each city.

Over 35 million digital nomads worldwide spend dozens of hours stitching together city research every time they move. Yet they still can't answer the question that matters most:

> *"Is this city actually right for my life and livelihood?"*

Nomadic answers that question.

---

## Core Features

### 🗺️ Four-Quadrant City Profile
Every city is analyzed across four dimensions:

| Quadrant | Content | Access |
|----------|---------|--------|
| **LANDING 落地指南** | Visa · Housing · Safety · Cost of living | Free |
| **SOUL 文化内核** | City character · History · Cultural fit | Free |
| **COMMUNITY 本地社区** | Local groups · Meetups · Co-living · Networks | Free |
| **CHANCE 商业机会** | Industries · Entrepreneurship · Freelance income | AI overview free · Deep reports paid |

### 🧭 Nomad Personality Test
16 nomad personality types. Discover your travel identity and get personalized city recommendations — the entry point to your nomadic journey.

### 👤 Local Expert Consulting
Connect with real people already living in the city. Pay for 1:1 consulting sessions or book local experiences. Nomadic takes 25% commission; local guides set their own rates.

### 📰 Deep City Reports
Paid in-depth reports on specific real-world topics — e.g. *"The real cost of opening a café in Berlin in 2026"* or *"Munich freelancer tax guide."* Summary free; full report paid (¥88–128/report).

### 🗺️ Global Travel Map
Visualize and record every city you've lived in. Your personal nomadic archive.

### 🌐 Nomad Community (印迹社区)
A UGC community where nomads share their city experiences, find like-minded people, and build real connections on the ground.

---

## User Journey

```
I  出发之前  →  Nomad Personality Test    (Who am I? Where do I belong?)
II 洞察城市  →  Four-Quadrant City Profile (Is this city right for me?)
III 到达之后 →  Community + Local Guides   (How do I truly fit in?)
IV 旅行版图  →  Global Travel Map          (Recording every chapter)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Search | Three-layer AI search engine (city data aggregation) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/panlutingcn/nomadic.git
cd nomadic

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see Environment Variables section below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Environment Variables

```env
# AI / Search
OPENAI_API_KEY=your_key_here

# Add other required keys as needed
```

---

## Project Structure

```
nomadic/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── city/[slug]/       # City detail pages (four-quadrant profile)
│   ├── personality-test/  # Nomad personality test
│   ├── community/         # Nomad community (印迹社区)
│   ├── map/               # Global travel map
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── README.md
```

---

## Traction & Validation

- ✅ **Live product** at [nomadictree.io](https://nomadictree.io) — 50 cities covered
- ✅ **200-person seed community** — real users, actively engaged
- ✅ **50 user surveys** — 80%+ willingness to pay for city intelligence
- ✅ **MVP built in 1 month** — total cost ¥770
- ✅ **3-layer AI search validated** — core differentiation confirmed
- ✅ **16-type personality test live** — growth engine ready

---

## Business Model

**Year 1 — Three revenue streams:**
1. **Local Expert Consulting** — paid 1:1 sessions with real locals (platform takes 25%)
2. **Deep City Reports** — paid reports on specific topics (¥88–128/report)
3. **Affiliate Referrals** — SafetyWing, iVisa, Flatio, Coworker.com

**Year 2+ — Scaling:**
- Subscription model (after 30–50 reports published)
- Bespoke relocation advisory (high-value clients)
- B2B brand partnerships & nomad events

---

## Competitive Moat

| Moat | Why it's hard to copy |
|------|----------------------|
| **Founder's local network** | 4 years studying in Germany — real cross-industry connections across Europe |
| **Proprietary content library** | Structured local interviews compound into a city intel archive unique to Nomadic |
| **Local guide network effects** | More guides → more cities → stronger user pull. Density is defensible |
| **Founder brand trust** | Early users pay because they trust the person behind the product |

---

## Roadmap

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| Launch | Month 1–3 | 5 local guides onboarded in Germany, affiliate revenue live |
| Validate | Month 3–6 | First 3–5 deep city reports published, consulting platform open |
| Expand | Month 6–9 | 15 guides, expand to second city |
| Accelerate | Month 9–12 | 20 guides, 12 reports live, near breakeven |
| Scale | Month 13+ | Subscription launched, seed membership, Series A prep |

---

## About the Founder

**Luna 潘璐婷** — Founder · Solo Builder · AI Product Manager

- Traveled to 30+ countries
- 4 years studying and living in Germany
- Built the entire MVP solo in one month for ¥770
- Nomad type: Local Blender

📧 panluting.cn@gmail.com
🌐 [nomadictree.io](https://nomadictree.io)

---

## License

MIT

---

*Nomadic — 为旅居者与数字游民深度解读每一座城市*
