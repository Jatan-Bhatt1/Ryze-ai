import React, { useState, useCallback } from 'react';
import ChatPanel from './components/chat/ChatPanel.jsx';
import CodeEditor from './components/editor/CodeEditor.jsx';
import LivePreview from './components/preview/LivePreview.jsx';
import VersionHistory from './components/VersionHistory.jsx';
import './App.css';

const API_BASE = '/api';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [isMockMode, setIsMockMode] = useState(false);

  // Fetch versions from server
  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch (err) {
      console.error('Failed to fetch versions:', err);
    }
  }, []);

  // Send prompt to AI agent
  const handleSend = useCallback(async (prompt) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          existingCode: code || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate UI');
      }

      // Add assistant message with all 3 agent steps
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.explanation,
        steps: data.steps,
        components: data.components,
        isMock: data.isMock
      }]);

      setCode(data.code);
      setCurrentVersion(data.version);
      setActiveTab('preview');

      if (data.isMock) {
        setIsMockMode(true);
      }

      // Refresh versions
      await fetchVersions();
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `❌ Error: ${err.message}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [code, fetchVersions]);

  // Rollback to a previous version
  const handleRollback = useCallback(async (versionId) => {
    try {
      const res = await fetch(`${API_BASE}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCode(data.code);
      setCurrentVersion(data.version);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⏪ Rolled back to version ${data.version}`,
      }]);

      await fetchVersions();
    } catch (err) {
      console.error('Rollback failed:', err);
    }
  }, [fetchVersions]);

  // Handle manual code edits
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  return (
    <div className="app">
      <VersionHistory
        versions={versions}
        currentVersion={currentVersion}
        onRollback={handleRollback}
      />
      <div className="app__main">
        <div className="app__chat">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            isMockMode={isMockMode}
          />
        </div>
        <div className="app__workspace">
          {activeTab === 'code' ? (
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
            />
          ) : (
            <LivePreview
              code={code}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}
