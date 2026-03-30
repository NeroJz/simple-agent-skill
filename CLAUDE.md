# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # run src/index.ts directly with tsx (no build step)
npm run build      # compile TypeScript to dist/
npm start          # run compiled output
npx tsc --noEmit   # type-check only
```

To run a specific file without building: `npx tsx src/your-file.ts`

## Environment

Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.

## Architecture

TypeScript ESM project (`"type": "module"`) using the OpenAI Agents SDK (`@openai/agents`).

Key SDK primitives:
- `Agent` — define an agent with `name`, `instructions`, and optional `tools`
- `run(agent, input)` — execute an agent, returns `RunResult` with `finalOutput`
- `tool()` — define typed tools using Zod schemas
- Handoffs — pass control between agents via the `handoffs` array on an Agent

Source lives in `src/`, compiled output goes to `dist/`. Use `tsx` for development (no compile step needed).
