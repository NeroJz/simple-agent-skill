# High level steps for project

## Part 1: Plan

Enrich this document to plan out each of these parts in detail, with substeps listed out as checklist to be checked off by the agent, and with tests and success criteria for each.

---

## Part 2: Add a Calculator Skill

Define a skill following the [OpenAI Codex skills pattern](https://developers.openai.com/codex/skills) — a folder-per-skill with a `SKILL.md` file loaded dynamically at runtime and registered as an OpenAI agent tool.

### Skill folder structure

```
skills/
└── calculator/
    ├── SKILL.md              ← required: name, description, instructions
    ├── execute.ts            ← tool implementation (Zod schema + execute function)
    └── agents/openai.yaml    ← optional: display name, icon, invocation policy
```

### Substeps

- [x] Create `skills/calculator/SKILL.md` with frontmatter (`name`, `description`) and instruction body
- [x] Create `skills/calculator/agents/openai.yaml` with display metadata and invocation policy
- [x] Create `src/loadSkill.ts` — `loadSkillMeta` parses only frontmatter (name, description); `loadSkillInstructions` reads only the body, called lazily at run time
- [x] Create `src/skills/calculator.ts` — implements add/subtract/multiply/divide; loads only metadata (name, description) from skill folder at import time
- [x] Export the calculator as an OpenAI `tool()` with a Zod schema for inputs

> Note: `src/skills/calculator.ts` will be moved into `skills/calculator/execute.ts` in Part 4.

### Success Criteria

- `skills/calculator/SKILL.md` is read at runtime (not imported as a static string)
- Tool `name` and `description` match the frontmatter values in `SKILL.md`
- `loadSkillInstructions` returns the instruction body for use as agent instructions
- Calculator correctly handles: add, subtract, multiply, divide
- Dividing by zero returns a clear error string (not a thrown exception)
- `npx tsc --noEmit` passes with no errors

---

## Part 3: Run the Agent with the Calculator Skill

Create a TypeScript entry point that wires the calculator skill into an OpenAI agent and runs it.

### Substeps

- [x] Update `src/index.ts` to import the calculator tool and load the skill
- [x] Create an `Agent` using the skill's `instructions` as the system prompt and `calculatorTool` in `tools`
- [x] Run the agent with a sample prompt that requires calculation (e.g. `"What is 42 multiplied by 7?"`)
- [x] Print `result.finalOutput` to stdout

### Success Criteria

- `npm run dev` runs without errors (requires `OPENAI_API_KEY` set in `.env`)
- Agent instructions are sourced from `SKILL.md` body at runtime
- Agent correctly invokes the calculator tool and returns the right answer
- Output is printed to stdout
- `npx tsc --noEmit` passes with no errors

---

## Part 4: Dynamic Skill Loading (Copilot-style)

Make skill loading fully automatic with no manual registry. Each skill is self-contained — its tool implementation moves into the skill folder itself as `execute.ts`. The system scans `skills/` at startup, routes the prompt to relevant skills via a lightweight model call, then dynamically imports and registers only those tools.

### Skill folder structure (updated)

```
skills/
└── calculator/
    ├── SKILL.md              ← name, description, instructions
    ├── execute.ts            ← tool implementation (moved from src/skills/calculator.ts)
    └── agents/openai.yaml    ← optional metadata
```

### Flow

```
user prompt
    ↓
discoverSkills()       ← scans skills/ folder, loadSkillMeta() on each (no tools registered)
    ↓
router(prompt, metas)  ← gpt-4o-mini call: returns names of matched skills
    ↓
load selected skills   ← dynamic import of execute.ts + loadSkillInstructions() for each match
    ↓
run Agent              ← only selected tools registered, instructions from SKILL.md
```

### Substeps

- [ ] Move `src/skills/calculator.ts` → `skills/calculator/execute.ts`; update it to export a `createTool(meta)` factory that accepts pre-loaded name and description
- [ ] Delete `src/skills/` directory
- [ ] Create `src/discoverSkills.ts` — scans `skills/` directory, returns `SkillMeta[]` (name, description, skillDir) for all skill folders found
- [ ] Create `src/router.ts` — takes prompt + `SkillMeta[]`, calls `gpt-4o-mini` to return names of relevant skills only
- [ ] Update `src/index.ts` — orchestrate the full flow: discover → route → dynamic import + lazy-load instructions → run agent

### Success Criteria

- Adding a new skill only requires creating a `skills/<name>/` folder with `SKILL.md` and `execute.ts` — no changes to any file in `src/`
- Router returns only skills relevant to the prompt
- Agent is constructed with only the selected tools and their `SKILL.md` instructions
- Token usage for tool schemas scales with matched skills, not total number of skills
- `npx tsc --noEmit` passes with no errors
