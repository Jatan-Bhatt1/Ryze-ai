import React, { useRef, useEffect, useCallback } from 'react';

// Simple syntax highlighting using regex (no external lib needed)
function highlightJSX(code) {
  if (!code) return '';

  return code
    // Strings
    .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="code-string">$&</span>')
    // JSX components (PascalCase)
    .replace(/(&lt;\/?)([A-Z][a-zA-Z]*)/g, '$1<span class="code-component">$2</span>')
    // HTML elements
    .replace(/(&lt;\/?)([a-z][a-z0-9]*)/g, '$1<span class="code-tag">$2</span>')
    // Props/attributes
    .replace(/\b([a-zA-Z_][\w]*)(?==)/g, '<span class="code-attr">$1</span>')
    // Keywords
    .replace(/\b(const|let|var|function|return|if|else|true|false|null|undefined|new|import|export|default|from|useState|React)\b/g, '<span class="code-keyword">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>')
    // Comments
    .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>');
}

export default function CodeEditor({ code, onChange, readOnly = false }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);

  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const syncScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue = code.substring(0, selectionStart) + '  ' + code.substring(selectionEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
      });
    }
  };

  const lines = (code || '').split('\n');
  const highlighted = highlightJSX(escapeHtml(code || ''));

  return (
    <div className="code-editor">
      <div className="code-editor__header">
        <span className="code-editor__tab">
          <span className="code-editor__dot code-editor__dot--jsx"></span>
          GeneratedUI.jsx
        </span>
        <div className="code-editor__actions">
          <button
            className="code-editor__action"
            onClick={() => navigator.clipboard.writeText(code)}
            title="Copy code"
          >
            📋
          </button>
        </div>
      </div>
      <div className="code-editor__body">
        <div className="code-editor__gutter">
          {lines.map((_, i) => (
            <div key={i} className="code-editor__line-num">{i + 1}</div>
          ))}
        </div>
        <div className="code-editor__content">
          <pre
            ref={preRef}
            className="code-editor__pre"
            dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
          />
          <textarea
            ref={textareaRef}
            className="code-editor__textarea"
            value={code || ''}
            onChange={handleChange}
            onScroll={syncScroll}
            onKeyDown={handleTab}
            spellCheck={false}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}
