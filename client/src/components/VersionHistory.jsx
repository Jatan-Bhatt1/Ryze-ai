import React from 'react';

export default function VersionHistory({ versions, currentVersion, onRollback }) {
  if (!versions || versions.length === 0) return null;

  return (
    <div className="version-history">
      <span className="version-history__label">📌 Versions:</span>
      <div className="version-history__items">
        {versions.map((v) => (
          <button
            key={v.id}
            className={`version-history__item ${v.id === currentVersion ? 'version-history__item--active' : ''}`}
            onClick={() => onRollback(v.id)}
            title={`${v.prompt}\n${new Date(v.timestamp).toLocaleTimeString()}`}
          >
            <span className="version-history__num">v{v.id}</span>
            <span className="version-history__prompt">
              {v.prompt?.slice(0, 30)}{v.prompt?.length > 30 ? '…' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
