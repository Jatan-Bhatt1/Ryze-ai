import React from 'react';
import { ReactDiffViewer } from 'react-diff-viewer-continued';

export default function DiffView({ oldCode, newCode, onClose }) {
  return (
    <div className="diff-view-overlay">
      <div className="diff-view-container">
        <div className="diff-view-header">
          <h3>Version Comparison</h3>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        <div className="diff-view-content">
          <ReactDiffViewer
            oldValue={oldCode}
            newValue={newCode}
            splitView={true}
            useDarkTheme={true}
            leftTitle="Previous Version"
            rightTitle="Current Version"
          />
        </div>
      </div>
    </div>
  );
}
