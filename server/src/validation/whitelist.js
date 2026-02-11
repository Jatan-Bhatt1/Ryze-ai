/**
 * RYZE AI — Component Whitelist Validation
 * Validates that generated code only uses allowed components.
 */

const ALLOWED_COMPONENTS = ['Button', 'Card', 'Input', 'Table', 'Modal', 'Sidebar', 'Navbar', 'Chart'];

// Allowed HTML elements for layout
const ALLOWED_HTML = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'strong', 'em', 'a'];

export function validateCode(code) {
  const errors = [];

  // 1. Check for inline styles
  const styleRegex = /style\s*=\s*\{/g;
  if (styleRegex.test(code)) {
    errors.push('Code contains inline styles (style={}). This is prohibited.');
  }

  // 2. Check for className usage (only data attributes are allowed)
  const classNameRegex = /className\s*=\s*["'{]/g;
  if (classNameRegex.test(code)) {
    errors.push('Code contains className attributes. Only data-* layout attributes are allowed.');
  }

  // 3. Extract all JSX component names (PascalCase tags)
  const componentRegex = /<([A-Z][a-zA-Z]*)\b/g;
  let match;
  const usedComponents = new Set();
  while ((match = componentRegex.exec(code)) !== null) {
    const name = match[1];
    // Skip React.Fragment, React built-ins
    if (name === 'React' || name === 'Fragment') continue;
    usedComponents.add(name);
  }

  // 4. Check all PascalCase components are whitelisted
  for (const comp of usedComponents) {
    if (!ALLOWED_COMPONENTS.includes(comp)) {
      errors.push(`Component <${comp}> is not in the allowed list. Only: ${ALLOWED_COMPONENTS.join(', ')}`);
    }
  }

  // 5. Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /dangerouslySetInnerHTML/g, msg: 'dangerouslySetInnerHTML is prohibited' },
    { pattern: /\beval\s*\(/g, msg: 'eval() is prohibited' },
    { pattern: /<script[\s>]/gi, msg: '<script> tags are prohibited' },
    { pattern: /document\.(write|cookie|location)/g, msg: 'Direct DOM manipulation is prohibited' },
    { pattern: /window\.(location|open)/g, msg: 'window.location/open is prohibited' },
  ];

  for (const { pattern, msg } of dangerousPatterns) {
    if (pattern.test(code)) {
      errors.push(msg);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    usedComponents: [...usedComponents],
  };
}
