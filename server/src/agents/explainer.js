/**
 * Agent: Explainer
 * Responsibility: Explain the changes in plain English.
 */

import { complete } from '../llm.js';
import { EXPLAINER_SYS_PROMPT } from '../prompts/explainer.prompt.js';

export async function runExplainer(plan, code, userPrompt, isIteration, stream = false) {
  const fullUserPrompt = `
User Prompt: "${userPrompt}"
Is Iteration: ${isIteration}

Generated Plan:
${JSON.stringify(plan, null, 2)}

Generated Code:
${code}

Explain what was built and why.
`;

  try {
    if (stream) {
      return complete({
        system: EXPLAINER_SYS_PROMPT,
        user: fullUserPrompt,
        jsonMode: false,
        stream: true
      });
    }

    const response = await complete({
      system: EXPLAINER_SYS_PROMPT,
      user: fullUserPrompt,
      jsonMode: false
    });

    return { explanation: response };
  } catch (error) {
    console.error('Explainer Agent Error:', error);
    if (stream) {
      // Return a mock generator that yields the error message
      return (async function* () {
        yield "I've generated the requested UI, but couldn't generate a detailed explanation due to an error.";
      })();
    }
    return { explanation: "I've generated the requested UI, but couldn't generate a detailed explanation due to an error." };
  }
}
