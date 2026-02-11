import React from 'react';

export default function VersionHistory({ versions, currentVersion, onRollback, onCompare, onReplay }) {
  if (!versions || versions.length === 0) return null;

  return (
    <div className="version-history">
      <span className="version-history__label">📌 Versions:</span>
      <div className="version-history__items">
        {versions.map((v) => (
          <div key={v.id} className="version-history__group">
            <button
              className={`version-history__item ${v.id === currentVersion ? 'version-history__item--active' : ''}`}
              onClick={() => onRollback(v.id)}
              title={`${v.prompt}\n${new Date(v.timestamp).toLocaleTimeString()}`}
            >
              <span className="version-history__num">v{v.id}</span>
              <span className="version-history__prompt">
                {v.prompt?.slice(0, 20)}{v.prompt?.length > 20 ? '…' : ''}
              </span>
            </button>
            <div className="version-history__actions">
              <button
                className="version-history__action-btn"
                onClick={() => onCompare(v)}
                title="Compare with current"
              >
                ⚖️
              </button>
              <button
                className="version-history__action-btn"
                onClick={() => onReplay(v.prompt)}
                title="Replay this prompt"
              >
                🔄
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
