/**
 * RYZE AI — Express Server
 * Main API server for the AI Agent pipeline.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { runPlanner } from './agents/planner.js';
import { runGenerator } from './agents/generator.js';
import { runExplainer } from './agents/explainer.js';
import { runMockAgent } from './agents/mock.js';
import { validateCode } from './validation/whitelist.js';
import { sanitizeInput } from './validation/sanitizer.js';
import versionStore from './store/versionStore.js';
import { initLLM, getProvider } from './llm.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize LLM Provider (OpenAI or Gemini)
initLLM();

/**
 * POST /api/generate
 * Full 3-step pipeline: Planner → Generator → Explainer
 * Body: { prompt: string, existingCode?: string }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, existingCode } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Step 0: Sanitize input
    const { clean, flagged, reason } = sanitizeInput(prompt);
    if (flagged) {
      return res.status(400).json({ error: reason });
    }

    // MOCK MODE CHECK
    if (getProvider() === 'mock') {
      console.log('[Agent] Running in MOCK MODE');
      const mockResult = runMockAgent(clean);

      const version = versionStore.save({
        code: mockResult.code,
        plan: mockResult.plan,
        explanation: mockResult.explanation,
        prompt: clean
      });

      return res.json({
        ...mockResult,
        version: version.id,
        steps: {
          planner: mockResult.plan,
          generator: mockResult.code,
          explainer: mockResult.explanation
        }
      });
    }

    const isIteration = !!existingCode;

    // Step 1: Planner
    console.log('[Agent] Step 1: Planning...');
    const { plan } = await runPlanner(clean, existingCode);

    // Step 2: Generator
    console.log('[Agent] Step 2: Generating code...');
    const { code } = await runGenerator(plan, existingCode);

    // Step 2.5: Validate
    console.log('[Agent] Validating code...');
    const validation = validateCode(code);
    if (!validation.valid) {
      console.warn('[Agent] Validation failed:', validation.errors);
      // Try to regenerate once with validation feedback

      // Don't pass existing code on retry to force clean generation if needed
      const { code: fixedCode } = await runGenerator({
        ...plan,
        validationErrors: validation.errors,
      }, null);

      const revalidation = validateCode(fixedCode);
      if (!revalidation.valid) {
        return res.status(422).json({
          error: 'Generated code failed validation even after retry',
          validationErrors: revalidation.errors,
          plan,
        });
      }

      // Step 3: Explainer (with fixed code)
      console.log('[Agent] Step 3: Explaining...');
      const { explanation } = await runExplainer(plan, fixedCode, clean, isIteration);

      const version = versionStore.save({ code: fixedCode, plan, explanation, prompt: clean });

      return res.json({
        code: fixedCode,
        plan,
        explanation,
        version: version.id,
        components: revalidation.usedComponents,
        steps: {
          planner: plan,
          generator: fixedCode,
          explainer: explanation,
        },
      });
    }

    // Step 3: Explainer
    console.log('[Agent] Step 3: Explaining...');
    const { explanation } = await runExplainer(plan, code, clean, isIteration);

    // Save version
    const version = versionStore.save({ code, plan, explanation, prompt: clean });

    console.log(`[Agent] Complete! Version ${version.id} saved.`);

    res.json({
      code,
      plan,
      explanation,
      version: version.id,
      components: validation.usedComponents,
      steps: {
        planner: plan,
        generator: code,
        explainer: explanation,
      },
    });
  } catch (err) {
    console.error('[Agent] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ... (Rest of file unchanged)

/**
 * GET /api/versions
 * Returns all saved versions
 */
app.get('/api/versions', (req, res) => {
  res.json({ versions: versionStore.getAll() });
});

/**
 * POST /api/rollback
 * Rolls back to a specific version
 * Body: { versionId: number }
 */
app.post('/api/rollback', (req, res) => {
  const { versionId } = req.body;

  if (!versionId) {
    return res.status(400).json({ error: 'versionId is required' });
  }

  const version = versionStore.rollback(versionId);
  if (!version) {
    return res.status(404).json({ error: 'Version not found' });
  }

  res.json({
    code: version.code,
    plan: version.plan,
    explanation: version.explanation,
    version: version.id,
  });
});

/**
 * GET /api/version/:id
 * Get a specific version
 */
app.get('/api/version/:id', (req, res) => {
  const version = versionStore.getById(parseInt(req.params.id));
  if (!version) {
    return res.status(404).json({ error: 'Version not found' });
  }
  res.json(version);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Ryze AI Server running on http://localhost:${PORT}`);
  const provider = getProvider();
  console.log(`   Provider: ${provider.toUpperCase()}`);
  console.log(`   Model: ${provider === 'openai' ? 'gpt-4o' : provider === 'gemini' ? 'gemini-1.5-flash' : 'Mock Mode'}`);
});
