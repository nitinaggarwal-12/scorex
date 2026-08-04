import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Minimize2, Maximize2, RefreshCw, User, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';
import { sendChatMessage } from '../services/aiService';

export default function ChatAssistant({ isOpen, onClose, reportData, formData, apiKey, gcpToken }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your Gemini Enterprise Solutions Assistant. Ask me any question about the customer's use case, deep dive into migration mechanics, or click the quick prompt buttons below the report to handle live meeting objections!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState(null);
  const [isPositiveFeedback, setIsPositiveFeedback] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackClick = (index, isPositive) => {
    setActiveFeedbackIndex(index);
    setIsPositiveFeedback(isPositive);
    setFeedbackText('');
  };

  const handleSubmitFeedback = () => {
    if (activeFeedbackIndex === null) return;
    const newFeedback = {
      id: 'fb_' + Date.now(),
      timestamp: new Date().toISOString(),
      question: messages[activeFeedbackIndex - 1]?.text || "Discovery session query",
      answer: messages[activeFeedbackIndex]?.text || "",
      isPositive: isPositiveFeedback,
      comment: feedbackText.trim()
    };

    try {
      const stored = localStorage.getItem('gemini_chat_feedback');
      const current = stored ? JSON.parse(stored) : [];
      const updated = [newFeedback, ...current];
      localStorage.setItem('gemini_chat_feedback', JSON.stringify(updated));
      alert(`✅ Logged feedback to train Gemini's contextual memory!`);
    } catch (e) {
      console.error("Failed saving chat feedback:", e);
    } finally {
      setActiveFeedbackIndex(null);
      setFeedbackText('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim() || loading) return;

    const newMsg = { sender: 'user', text: query };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    if (typeof textToSend !== 'string') setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(updatedMessages, reportData, formData, apiKey, gcpToken);
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { sender: 'ai', text: "⚠️ Error generating response. Please check your network or Gemini API settings." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCustomPrompt = (e) => {
      const prompt = e.detail;
      if (prompt) {
        if (isMinimized) setIsMinimized(false);
        handleSend(prompt);
      }
    };
    window.addEventListener('trigger_chat_prompt', handleCustomPrompt);
    return () => window.removeEventListener('trigger_chat_prompt', handleCustomPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isMinimized, loading, reportData, formData, apiKey]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to format markdown bold & bullets robustly
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      let content = line.trim();
      if (content === '') return <div key={idx} style={{ height: '0.5rem' }} />;

      // Handle Headings
      if (content.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--google-blue)', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {content.substring(4)}
          </h4>
        );
      }

      // Check if it is a bullet line
      const isBullet = content.startsWith('* ') || content.startsWith('- ') || content.startsWith('• ');
      if (isBullet) {
        content = content.replace(/^(\*\s*|-\s*|•\s*)/, '');
      }

      // Standardize bold formatting (**text**) using React inline parsing
      const parts = content.split('**');
      const formattedContent = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx}>{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        const rawCleanText = content.replace(/^(\*\s*|-\s*|•\s*)/, '');
        return (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(rawCleanText)}
            style={{
              display: 'flex',
              gap: '0.45rem',
              marginLeft: '0.5rem',
              marginBottom: '0.45rem',
              alignItems: 'center',
              lineHeight: 1.4,
              background: 'rgba(66,133,244,0.03)',
              border: '1px solid rgba(66,133,244,0.15)',
              borderRadius: '10px',
              padding: '0.4rem 0.75rem',
              textAlign: 'left',
              width: 'calc(100% - 0.5rem)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
            className="chat-prompt-pill-btn"
          >
            <span style={{ color: 'var(--google-blue)', fontSize: '0.9rem' }}>✦</span>
            <div style={{ flex: 1, fontWeight: 600, fontSize: '0.8rem' }}>{formattedContent}</div>
          </button>
        );
      }

      return (
        <p key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>
          {formattedContent}
        </p>
      );
    });
  };

  return (
    <div
      className="chat-assistant-drawer"
      style={{
        position: 'fixed',
        bottom: isMinimized ? '1rem' : '1.5rem',
        right: '1.5rem',
        width: isMinimized ? '300px' : '440px',
        height: isMinimized ? '54px' : '600px',
        maxHeight: '85vh',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--google-navy)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--google-amber)' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Gemini Discovery AI Chat</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.25rem' }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-primary)' }}>
            {messages.map((m, idx) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    alignSelf: isAi ? 'flex-start' : 'flex-end',
                    maxWidth: '88%'
                  }}
                >
                  {isAi && (
                    <div style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '0.5rem', borderRadius: '50%', flexShrink: 0 }}>
                      <Bot size={18} />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        backgroundColor: isAi ? 'var(--bg-surface)' : 'var(--google-blue)',
                        color: isAi ? 'var(--text-primary)' : '#ffffff',
                        padding: '0.75rem 1rem',
                        borderRadius: '16px',
                        borderTopLeftRadius: isAi ? 0 : '16px',
                        borderTopRightRadius: isAi ? '16px' : 0,
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        border: isAi ? '1px solid var(--border-color)' : 'none',
                        boxShadow: 'var(--shadow-sm)',
                        width: '100%'
                      }}
                    >
                      {isAi ? renderFormattedText(m.text) : m.text}
                    </div>

                    {/* Thumbs Up/Down Feedback Triggers */}
                    {isAi && idx > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem', paddingLeft: '0.25rem', width: '100%' }}>
                        <button 
                          type="button" 
                          onClick={() => handleFeedbackClick(idx, true)} 
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeFeedbackIndex === idx && isPositiveFeedback ? 'var(--google-green)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                          title="Helpful answer"
                        >
                          <ThumbsUp size={12} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleFeedbackClick(idx, false)} 
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeFeedbackIndex === idx && !isPositiveFeedback ? 'var(--google-red)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                          title="Needs work"
                        >
                          <ThumbsDown size={12} />
                        </button>

                        {/* Inline comment text form */}
                        {activeFeedbackIndex === idx && (
                          <div style={{ display: 'flex', gap: '0.25rem', flex: 1, marginLeft: '0.5rem' }}>
                            <input 
                              type="text" 
                              value={feedbackText}
                              onChange={e => setFeedbackText(e.target.value)}
                              placeholder={isPositiveFeedback ? "Why was this helpful?" : "How can we improve?"}
                              style={{ flex: 1, padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', minWidth: 0 }}
                            />
                            <button type="button" onClick={handleSubmitFeedback} className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>
                              Save
                            </button>
                            <button type="button" onClick={() => setActiveFeedbackIndex(null)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>
                              X
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div style={{ background: 'var(--google-grey-200)', color: 'var(--google-grey-800)', padding: '0.5rem', borderRadius: '50%', flexShrink: 0 }}>
                      <User size={18} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'var(--google-purple-light)', color: 'var(--google-purple)', padding: '0.5rem', borderRadius: '50%' }}>
                  <RefreshCw size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>Gemini is reasoning & querying GCP docs...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '100px', padding: '0.4rem 0.75rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up question..."
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', padding: '0.25rem 0.5rem', color: 'var(--text-primary)' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{ background: loading || !input.trim() ? 'var(--google-grey-300)' : 'var(--google-blue)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading || !input.trim() ? 'default' : 'pointer', transition: 'background 0.2s' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
