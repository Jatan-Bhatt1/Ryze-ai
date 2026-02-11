/**
 * Agent: Generator
 * Responsibility: Convert structured plan into valid React code.
 */

import { complete } from '../llm.js';
import { GENERATOR_SYS_PROMPT, buildGeneratorUserPrompt } from '../prompts/generator.prompt.js';

export async function runGenerator(plan, existingCode) {
  const fullUserPrompt = buildGeneratorUserPrompt(plan, existingCode);

  try {
    const response = await complete({
      system: GENERATOR_SYS_PROMPT,
      user: fullUserPrompt,
      jsonMode: false // Code generation is text, not JSON object
    });

    // Extract code block if wrapped in markdown
    let code = response;

    // Remove markdown code blocks if present
    if (code.includes('```jsx')) {
      code = code.split('```jsx')[1].split('```')[0].trim();
    } else if (code.includes('```javascript')) {
      code = code.split('```javascript')[1].split('```')[0].trim();
    } else if (code.includes('```')) {
      code = code.split('```')[1].split('```')[0].trim();
    }

    // Strip imports/exports to ensure it works in Function constructor
    // (Although prompt says not to include them, we double check)
    code = code.replace(/import .* from .*/g, '')
      .replace(/export default function/g, 'function')
      .replace(/export default/g, '');

    return { code, rawResponse: response };
  } catch (error) {
    console.error('Generator Agent Error:', error);
    throw error;
  }
}
