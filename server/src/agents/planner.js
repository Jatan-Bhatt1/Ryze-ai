import { complete } from '../llm.js';
import { PLANNER_SYS_PROMPT, buildPlannerUserPrompt } from '../prompts/planner.prompt.js';
import { plannerSchema } from '../validation/schema.js';

export async function runPlanner(userPrompt, existingCode) {
  const fullUserPrompt = buildPlannerUserPrompt(userPrompt, existingCode);

  try {
    const response = await complete({
      system: PLANNER_SYS_PROMPT,
      user: fullUserPrompt,
      jsonMode: true
    });

    // Parse JSON
    let plan;
    try {
      plan = JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse planner JSON:', response);
      throw new Error('Planner failed to generate valid JSON.');
    }

    // Validate with Zod
    const validation = plannerSchema.safeParse(plan);
    if (!validation.success) {
      console.error('Planner JSON validation failed:', validation.error);
      throw new Error('Planner generated invalid plan structure.');
    }

    return { plan: validation.data, rawResponse: response };
  } catch (error) {
    console.error('Planner Agent Error:', error);
    throw error;
  }
}
