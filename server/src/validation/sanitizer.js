/**
 * RYZE AI — Input Sanitizer
 * Basic prompt injection protection and input sanitization.
 */

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?above/i,
  /you\s+are\s+now\s+a/i,
  /new\s+instructions?:/i,
  /system\s*prompt:/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /override\s+rules/i,
  /forget\s+(everything|all|your\s+instructions)/i,
];

export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return { clean: '', flagged: true, reason: 'Input is not a string' };
  }

  // Trim and limit length
  let clean = input.trim().slice(0, 2000);

  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        clean: '',
        flagged: true,
        reason: 'Input contains patterns that look like prompt injection. Please rephrase your UI description.',
      };
    }
  }

  // Remove potential HTML/script content from user input
  clean = clean
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*on\w+\s*=/gi, '') // Remove event handlers in HTML
    .trim();

  return { clean, flagged: false };
}
