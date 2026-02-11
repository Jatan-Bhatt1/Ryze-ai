/**
 * Agent: Planner
 * Responsibility: Convert user intent into a structured JSON plan.
 */

import { complete } from '../llm.js';
import { PLANNER_SYS_PROMPT, buildPlannerUserPrompt } from '../prompts/planner.prompt.js';

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

    return { plan, rawResponse: response };
  } catch (error) {
    console.error('Planner Agent Error:', error);
    throw error;
  }
}
