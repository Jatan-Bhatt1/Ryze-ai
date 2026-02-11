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

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory (where built client resides)
app.use(express.static('public'));

// SPA Fallback: Serve index.html for any unknown routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
    if (err) {
      res.status(404).send("Client build not found");
    }
  });
});

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

    // Enable SSE Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Establish connection immediately

    const sendEvent = (type, data) => {
      res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
    };

    // Step 0: Sanitize input
    const { clean, flagged, reason } = sanitizeInput(prompt);
    if (flagged) {
      sendEvent('error', { message: reason });
      res.end();
      return;
    }

    // MOCK MODE CHECK
    if (getProvider() === 'mock') {
      console.log('[Agent] Running in MOCK MODE');
      sendEvent('step', { step: 'planner', status: 'completed', plan: { reason: "Mock Plan" } });
      sendEvent('step', { step: 'generator', status: 'completed', code: "// Mock Code" });

      const mockResult = runMockAgent(clean);
      const version = versionStore.save({
        code: mockResult.code,
        plan: mockResult.plan,
        explanation: mockResult.explanation,
        prompt: clean
      });

      sendEvent('explanation', { chunk: mockResult.explanation });
      sendEvent('complete', {
        version: version.id,
        code: mockResult.code,
        plan: mockResult.plan,
        explanation: mockResult.explanation
      });
      res.end();
      return;
    }

    const isIteration = !!existingCode;

    // Step 1: Planner
    console.log('[Agent] Step 1: Planning...');
    sendEvent('step', { step: 'planner', status: 'pending' });
    const { plan } = await runPlanner(clean, existingCode);
    sendEvent('step', { step: 'planner', status: 'completed', plan });

    // Step 2: Generator
    console.log('[Agent] Step 2: Generating code...');
    sendEvent('step', { step: 'generator', status: 'pending' });
    const { code } = await runGenerator(plan, existingCode);

    // Step 2.5: Validate
    console.log('[Agent] Validating code...');
    sendEvent('step', { step: 'validator', status: 'pending' });
    const validation = validateCode(code);
    let finalCode = code;

    if (!validation.valid) {
      console.warn('[Agent] Validation failed:', validation.errors);
      sendEvent('step', { step: 'validator', status: 'failed', errors: validation.errors });

      // Try to regenerate once with validation feedback
      const { code: fixedCode } = await runGenerator({
        ...plan,
        validationErrors: validation.errors,
      }, null);

      const revalidation = validateCode(fixedCode);
      if (!revalidation.valid) {
        sendEvent('error', { message: 'Generated code failed validation even after retry', validationErrors: revalidation.errors });
        res.end();
        return;
      }
      finalCode = fixedCode;
      sendEvent('step', { step: 'validator', status: 'repaired' });
    } else {
      sendEvent('step', { step: 'validator', status: 'valid' });
    }

    sendEvent('step', { step: 'generator', status: 'completed', code: finalCode });

    // Step 3: Explainer (Streaming)
    console.log('[Agent] Step 3: Explaining...');
    sendEvent('step', { step: 'explainer', status: 'streaming' });

    const stream = await runExplainer(plan, finalCode, clean, isIteration, true);

    let fullExplanation = '';
    for await (const chunk of stream) {
      // OpenAI chunks are objects, Gemini chunks are text (via our wrapper)
      // Adjust based on provider wrapper implementation. 
      // Our wrapper returns stream from OpenAI or Gemini.
      // OpenAI stream yields 'chunk' objects. Gemini yields 'chunk' objects too but different structure.

      let textChunk = '';
      if (typeof chunk === 'string') {
        textChunk = chunk;
      } else if (chunk.choices) {
        // OpenAI
        textChunk = chunk.choices[0]?.delta?.content || '';
      } else if (chunk.text && typeof chunk.text === 'function') {
        // Gemini
        textChunk = chunk.text();
      }

      if (textChunk) {
        fullExplanation += textChunk;
        sendEvent('explanation', { chunk: textChunk });
      }
    }

    sendEvent('step', { step: 'explainer', status: 'completed' });

    // Save version
    const version = versionStore.save({ code: finalCode, plan, explanation: fullExplanation, prompt: clean });

    console.log(`[Agent] Complete! Version ${version.id} saved.`);

    sendEvent('complete', {
      version: version.id,
      code: finalCode,
      plan,
      explanation: fullExplanation
    });

    res.end();

  } catch (err) {
    console.error('[Agent] Error:', err.message);
    // If headers already sent, we can't send status 500
    // Try to send error event
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
      res.end();
    }
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
