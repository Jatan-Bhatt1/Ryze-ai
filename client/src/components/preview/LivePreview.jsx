import React, { useState, useEffect, useMemo } from 'react';
import * as UIComponents from '../ui/index.js';

/**
 * LivePreview — Dynamically renders generated JSX code
 * Uses Function constructor to compile code with only whitelisted components available.
 */
export default function LivePreview({ code, activeTab, onTabChange }) {
  const [error, setError] = useState(null);
  const [renderedUI, setRenderedUI] = useState(null);

  useEffect(() => {
    if (!code) {
      setRenderedUI(null);
      setError(null);
      return;
    }

    try {
      // Create the component from code string
      const component = compileCode(code);
      setRenderedUI(component);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRenderedUI(null);
    }
  }, [code]);

  return (
    <div className="live-preview">
      <div className="live-preview__header">
        <div className="live-preview__tabs">
          <button
            className={`live-preview__tab ${activeTab === 'preview' ? 'live-preview__tab--active' : ''}`}
            onClick={() => onTabChange('preview')}
          >
            👁️ Preview
          </button>
          <button
            className={`live-preview__tab ${activeTab === 'code' ? 'live-preview__tab--active' : ''}`}
            onClick={() => onTabChange('code')}
          >
            📝 Code
          </button>
        </div>
        <div className="live-preview__status">
          {error ? (
            <span className="live-preview__status--error">⚠️ Error</span>
          ) : code ? (
            <span className="live-preview__status--ok">✅ Rendered</span>
          ) : (
            <span className="live-preview__status--empty">No UI generated yet</span>
          )}
        </div>
      </div>

      <div className="live-preview__body">
        {error && (
          <div className="live-preview__error">
            <h4>⚠️ Render Error</h4>
            <pre>{error}</pre>
          </div>
        )}
        {!error && !code && (
          <div className="live-preview__empty">
            <div className="live-preview__empty-icon">🖥️</div>
            <p>Your generated UI will appear here</p>
          </div>
        )}
        {!error && renderedUI && (
          <ErrorBoundary>
            <div className="live-preview__render">
              {renderedUI}
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

import * as Babel from '@babel/standalone';

/**
 * Compiles a code string into a React element.
 * Only whitelisted components are available in the scope.
 */
function compileCode(code) {
  try {
    // 1. Transpile JSX to JS using Babel
    const transpiled = Babel.transform(code, {
      presets: ['react'],
      filename: 'generated.jsx', // helps Babel
    }).code;

    // 2. Wrap in a function that extracts components and returns the UI
    // We assume the code defines a component (e.g. function GeneratedUI)
    // We'll append a return statement to return the first function defined or just execute it

    // Improved wrapper: return the component that was defined
    const wrappedCode = `
      const { Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart } = components;
      
      // The generated code (transpiled)
      ${transpiled}

      // Find the component to render
      // We look for GeneratedUI, App, or the first function defined
      let TargetComponent = null;
      if (typeof GeneratedUI !== 'undefined') TargetComponent = GeneratedUI;
      else if (typeof App !== 'undefined') TargetComponent = App;
      else if (typeof Dashboard !== 'undefined') TargetComponent = Dashboard; // Legacy support
      else if (typeof LoginPage !== 'undefined') TargetComponent = LoginPage;
      else if (typeof LandingPage !== 'undefined') TargetComponent = LandingPage;
      else if (typeof SettingsPage !== 'undefined') TargetComponent = SettingsPage;
      else if (typeof KanbanBoard !== 'undefined') TargetComponent = KanbanBoard;
      else if (typeof ProductList !== 'undefined') TargetComponent = ProductList;
      
      if (!TargetComponent && typeof DefaultUI !== 'undefined') TargetComponent = DefaultUI;

      if (!TargetComponent) {
         // Fallback: if code is just an expression or return statement? 
         // But our prompts enforce a functional component.
         return null; 
      }

      return React.createElement(TargetComponent);
    `;

    // 3. Create Function
    const factory = new Function('React', 'components', wrappedCode);
    const element = factory(React, UIComponents.ALLOWED_COMPONENTS);
    return element;
  } catch (err) {
    console.error('Compilation error:', err);
    throw new Error(`Failed to compile code: ${err.message}`);
  }
}

/**
 * Error Boundary to catch runtime render errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LivePreview render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="live-preview__error">
          <h4>⚠️ Runtime Error</h4>
          <pre>{this.state.error?.message || 'Unknown error'}</pre>
          <button
            className="live-preview__retry"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
