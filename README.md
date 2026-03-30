# agent-skils

A TypeScript project for building OpenAI agents driven by file-based skill definitions.

Skills are defined as folders under `skills/`, each with a `SKILL.md` that the agent loads at runtime — no hardcoded instructions in code.

## Setup

```bash
npm install
cp .env.example .env   # add your OPENAI_API_KEY
```

## Usage

```bash
npm run dev     # run with tsx (no build step)
npm run build   # compile to dist/
npm start       # run compiled output
```

## Skill structure

Each skill is a self-contained folder:

```
skills/
└── calculator/
    ├── SKILL.md            ← name, description (frontmatter) + agent instructions (body)
    └── agents/openai.yaml  ← optional display metadata
```

`SKILL.md` frontmatter fields:
- `name` — tool name passed to the OpenAI API
- `description` — tells the model when to invoke this tool

The instruction body is lazy-loaded at run time and used as the agent's system prompt.
