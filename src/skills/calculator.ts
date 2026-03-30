import { tool } from "@openai/agents";
import { z } from "zod";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { loadSkillMeta } from "../loadSkill.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { name, description } = loadSkillMeta(resolve(__dirname, "../../skills/calculator"));

const parameters = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]),
  a: z.number().describe("First operand"),
  b: z.number().describe("Second operand"),
});

export const calculatorTool = tool({
  name,
  description,
  parameters,
  execute({ operation, a, b }) {
    switch (operation) {
      case "add":      return String(a + b);
      case "subtract": return String(a - b);
      case "multiply": return String(a * b);
      case "divide":
        if (b === 0) return "Error: division by zero";
        return String(a / b);
    }
  },
});
