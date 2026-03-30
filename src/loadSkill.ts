import { readFileSync } from "fs";
import { resolve } from "path";

interface SkillMeta {
  name: string;
  description: string;
}

function parseFile(skillDir: string) {
  const filePath = resolve(skillDir, "SKILL.md");
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter found in ${filePath}`);
  return { frontmatter: match[1], body: match[2].trim() };
}

function parseFrontmatter(raw: string, filePath: string): Record<string, string> {
  const meta: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    meta[line.slice(0, colonIndex).trim()] = line.slice(colonIndex + 1).trim();
  }
  if (!meta.name || !meta.description) {
    throw new Error(`${filePath} must have 'name' and 'description' in frontmatter`);
  }
  return meta;
}

/** Load only name and description — used at tool registration time. */
export function loadSkillMeta(skillDir: string): SkillMeta {
  const { frontmatter } = parseFile(skillDir);
  const meta = parseFrontmatter(frontmatter, resolve(skillDir, "SKILL.md"));
  return { name: meta.name, description: meta.description };
}

/** Load only the instruction body — called lazily just before the agent runs. */
export function loadSkillInstructions(skillDir: string): string {
  const { body } = parseFile(skillDir);
  return body;
}
