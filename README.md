# Brand Operator AI

Premium AI creative suite — imagery, campaigns, copy, research, and a creative agent, unified under one aesthetic.

Built on **Next.js 14 · React 18 · Tailwind 3 · TypeScript** — stable, production-ready stack.

---

## Stack

- **Next.js 14.2** (App Router) + **React 18.3** + **TypeScript strict**
- **Tailwind v3** with CSS-variable design tokens (warm black / gold / beige)
- **Zustand + localStorage** for generation history
- **Zod** for end-to-end API validation
- **OpenAI SDK** — GPT-4o (text + vision)
- **Anthropic SDK** — Claude 3.5 Sonnet (text + vision)
- **Replicate SDK** — Flux 1.1 Pro for imagery

Provider layer is fully abstracted (`ImageProvider` / `TextProvider` / `ChatProvider`). Registry auto-picks the best available provider based on which keys are set.

---

## Quick start

```bash
npm install
cp .env.example .env.local
# add OPENAI_API_KEY, ANTHROPIC_API_KEY, REPLICATE_API_TOKEN
npm run dev
```

Open http://localhost:3000.

### Environment

```
OPENAI_API_KEY=sk-...          # required for text + chat
ANTHROPIC_API_KEY=sk-ant-...   # optional fallback + multimodal
REPLICATE_API_TOKEN=r8_...     # required for image generation

DEFAULT_TEXT_PROVIDER=openai   # openai | anthropic
DEFAULT_CHAT_PROVIDER=openai   # openai | anthropic
DEFAULT_IMAGE_PROVIDER=replicate
```

---

## Modules

| Route | What it does |
|---|---|
| `/dashboard` | Studio overview |
| `/agent` | **Creative Agent** — multimodal chat, image + text-file upload |
| `/generate/image` | Editorial imagery (5 style presets, 5 aspect ratios) |
| `/generate/campaign` | **Multi-tone campaign** (10 tones, 7 channels, full launch kit) |
| `/generate/copy` | Task-based copywriter (7 tasks) |
| `/research` | One-page operator briefing |
| `/assets` | Local history of everything generated |
| `/settings` | Provider status |

---

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx             Root shell
│  ├─ (dashboard, agent, generate/*, research, assets, settings)
│  └─ api/ai/
│     ├─ image/route.ts
│     ├─ campaign/route.ts
│     ├─ copy/route.ts
│     └─ chat/route.ts       Multimodal (text + images)
│
├─ components/
│  ├─ ui/                    Button, Input, Card, Chip, Select, Spinner
│  ├─ layout/                Sidebar, Topbar
│  ├─ generators/            Image / Campaign / Copy generators
│  └─ agent/                 ChatInterface, MessageBubble, Composer
│
├─ services/ai/
│  ├─ types.ts               ImageProvider, TextProvider, ChatProvider
│  ├─ registry.ts            Selects provider; throws if no key
│  └─ providers/             openai, anthropic-text, anthropic-chat, replicate-image
│
├─ prompts/                  agent, campaign (10 tones), copy (7 tasks), image
├─ lib/                      env, history (Zustand), attachments, utils
├─ types/                    campaign, chat, index
└─ styles/globals.css        Design tokens (RGB triplets)
```

---

## Design

- Warm black `rgb(11,11,12)`, beige fg `rgb(242,236,221)`, gold accent `rgb(201,168,99)`
- Instrument Serif for display, Inter for UI
- All colors exposed as Tailwind tokens: `bg-bg`, `text-gold`, `border-border-strong`, etc.
- Full opacity-modifier support: `bg-gold/15`, `text-danger/80`, etc.

---

## Deploy

One-click deployable to Vercel. Set the three API keys in the Vercel project env, and it runs.

```bash
npm run build
npm start
```

---

© Brand Operator AI
