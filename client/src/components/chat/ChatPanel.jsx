import React, { useState, useRef, useEffect } from 'react';

export default function ChatPanel({ messages, onSend, isLoading, isMockMode }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <div className="chat-panel__logo">
          <span className="chat-panel__logo-icon">⚡</span>
          <span>Ryze AI</span>
          {isMockMode && <span style={{ fontSize: '10px', background: '#f59e0b', color: 'black', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: 'bold' }}>MOCK MODE</span>}
        </div>
        <span className="chat-panel__subtitle">Describe your UI in plain English</span>
      </div>

      <div className="chat-panel__messages">
        {messages.length === 0 && (
          <div className="chat-panel__empty">
            <div className="chat-panel__empty-icon">🎨</div>
            <h3>What UI would you like to create?</h3>
            <p>Describe any interface and I'll generate it using our component library.</p>
            <div className="chat-panel__suggestions">
              <button className="chat-panel__suggestion" onClick={() => setInput("Create a board with columns for Todo, In Progress and Done")}>
                📋 Kanban Board
              </button>
              <button className="chat-panel__suggestion" onClick={() => setInput("Design a product listing page with a table showing product name, price, and status")}>
                🛍️ E-commerce Product List
              </button>
              <button className="chat-panel__suggestion" onClick={() => setInput("Create a dashboard with a navbar, sidebar navigation, and cards showing sales statistics")}>
                📊 Dashboard with charts
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-message chat-message--${msg.role}`}>
            <div className="chat-message__avatar">
              {msg.role === 'user' ? '👤' : '⚡'}
            </div>
            <div className="chat-message__content">
              {msg.role === 'assistant' && msg.steps && (
                <div className="chat-message__steps">
                  <div className="chat-step">
                    <span className="chat-step__badge chat-step__badge--plan">1</span>
                    <div className="chat-step__content">
                      <strong>Planner</strong>
                      <p>Layout: {msg.steps.planner?.layout?.type || 'flex-col'} — {msg.steps.planner?.layout?.description || ''}</p>
                      <p>Components: {msg.steps.planner?.components?.map(c => c.type).join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="chat-step">
                    <span className="chat-step__badge chat-step__badge--gen">2</span>
                    <div className="chat-step__content">
                      <strong>Generator</strong>
                      <p>✅ Code generated ({msg.components?.length || 0} components used)</p>
                    </div>
                  </div>
                  <div className="chat-step">
                    <span className="chat-step__badge chat-step__badge--explain">3</span>
                    <div className="chat-step__content">
                      <strong>Explainer</strong>
                      <p>{msg.steps.explainer}</p>
                    </div>
                  </div>
                </div>
              )}
              {!msg.steps && <p>{msg.text}</p>}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__avatar">⚡</div>
            <div className="chat-message__content">
              <div className="chat-loading">
                <div className="chat-loading__dots">
                  <span></span><span></span><span></span>
                </div>
                <p>Running agent pipeline...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-panel__input-area">
        <textarea
          ref={inputRef}
          className="chat-panel__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the UI you want to create..."
          rows={2}
          disabled={isLoading}
        />
        <button
          className="chat-panel__send"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? '⏳' : '→'}
        </button>
      </div>
    </div>
  );
}
