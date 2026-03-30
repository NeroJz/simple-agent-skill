import { Agent, run } from "@openai/agents";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { calculatorTool } from "./skills/calculator.js";
import { loadSkillInstructions } from "./loadSkill.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Lazy-load instructions only when the agent is about to run
const instructions = loadSkillInstructions(resolve(__dirname, "../skills/calculator"));

const agent = new Agent({
  name: "Calculator Agent",
  instructions,
  tools: [calculatorTool],
});

const result = await run(agent, "What is 42 multiplied by 7?");
console.log(result.finalOutput);
