# FrameFlow Studio 🎬

An end-to-end AI video production workstation tailored for creators and production teams. FrameFlow transforms topics into complete scripts, auto-chunked batch image prompts, and viral packaging with resilient multi-model failover and encrypted credential security.

---

## ⚡ Core Architecture

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Glassmorphism dark studio aesthetic
- **Database & ODM**: MongoDB with `mongoose` connection pooling
- **Authentication**: `better-auth` with RBAC (`admin` and `creator`)
- **Key Vault**: AES-256-GCM encryption at rest; keys are decrypted only in memory during AI generation
- **AI Routing Engine**:
  - **Auto Model Mode**: Automatically fails over across **Google Gemini ➔ Anthropic Claude ➔ OpenAI** if rate limits (HTTP 429) or token quotas are reached.
  - **Manual Model Selection**: Lock into Gemini 2.5 Flash, Claude 3.7 Sonnet, GPT-4o Mini, etc.
- **Master Prompt & Style Presets**:
  - Supports uploading `.md` or `.txt` style rules.
  - Default preset: **FrameFlow 2D Vector Doodles**.
  - Pipeline remains strictly fixed: `Topic ➔ Script (<90 chars/line) ➔ Timestamps ➔ Batch Prompts ➔ Packaging`.
- **Text Format Persistence**: All stage outputs saved to MongoDB in clean, exportable text formats.

---

## 🚀 Getting Started

1. **Configure Environment Variables**:
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Ensure your `MONGODB_URI` points to your local MongoDB instance or MongoDB Atlas.

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Configure API Keys**:
   - Navigate to `/settings` (Key Vault) in the top right.
   - Enter your Google Gemini, Anthropic Claude, or OpenAI API key.
   - Keys are immediately encrypted using AES-256-GCM and stored safely in your database.

---

## 📁 4-Stage Production Pipeline

1. **Stage 1 (Topic & Angle)**: Generates 5 high-CTR viral topic candidates with conflict hooks and visual thumbnail concepts.
2. **Stage 2 (Voiceover Script)**: Generates complete narration pre-broken sentence-by-sentence (&lt;90 chars/line) for ElevenLabs and caption sync.
3. **Stage 3 (Batch Image Prompts)**: Paste timestamped script; automatically executes 20-prompt batches with a live progress bar, prompt cards, and raw Midjourney / Flux text export.
4. **Stage 4 (Viral Packaging & SEO)**: Generates title hooks, thumbnail prompt, description, 15 hashtags, and 35 SEO tags with 1-click bundle export.
