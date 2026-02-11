import React, { useState, useCallback } from 'react';
import ChatPanel from './components/chat/ChatPanel.jsx';
import CodeEditor from './components/editor/CodeEditor.jsx';
import LivePreview from './components/preview/LivePreview.jsx';
import VersionHistory from './components/VersionHistory.jsx';
import DiffView from './components/DiffView.jsx';
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
  const [compareVersion, setCompareVersion] = useState(null);

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

    // Add initial assistant message for streaming
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: '', // Start empty
      steps: { planner: null, generator: null, explainer: null }, // Initial steps state
      isLoading: true
    }]);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          existingCode: code || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText || 'Failed to generate UI');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'step') {
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg.role !== 'assistant') return prev;

                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMsg,
                    steps: {
                      ...lastMsg.steps,
                      [data.step]: data.status // 'pending', 'completed', 'streaming'
                    }
                  }
                ];
              });
            } else if (data.type === 'explanation') {
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg.role !== 'assistant') return prev;

                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMsg,
                    text: lastMsg.text + data.chunk
                  }
                ];
              });
            } else if (data.type === 'complete') {
              setCode(data.code);
              setCurrentVersion(data.version);
              setActiveTab('preview');
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMsg,
                    isLoading: false,
                    text: data.explanation // Ensure full text is set
                  }
                ];
              });
              // Refresh versions
              await fetchVersions();
            } else if (data.type === 'error') {
              throw new Error(data.message);
            }
          }
        }
      }

    } catch (err) {
      setMessages(prev => {
        // Remove the loading assistant message if it exists and replace with error or append error
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === 'assistant' && lastMsg.isLoading) {
          return [
            ...prev.slice(0, -1),
            {
              role: 'assistant',
              text: `❌ Error: ${err.message}`,
            }
          ];
        }
        return [...prev, {
          role: 'assistant',
          text: `❌ Error: ${err.message}`,
        }];
      });
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

  const handleCompare = useCallback((version) => {
    setCompareVersion(version);
  }, []);

  const handleReplay = useCallback((prompt) => {
    // Re-trigger generation with the same prompt
    handleSend(prompt);
  }, [handleSend]);

  return (
    <div className="app">
      <VersionHistory
        versions={versions}
        currentVersion={currentVersion}
        onRollback={handleRollback}
        onCompare={handleCompare}
        onReplay={handleReplay}
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
      {compareVersion && (
        <DiffView
          oldCode={compareVersion.code}
          newCode={code}
          onClose={() => setCompareVersion(null)}
        />
      )}
    </div>
  );
}
