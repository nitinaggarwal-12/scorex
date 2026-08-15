import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import chatService from '../services/chatService';

const ChatButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
  }
`;

const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 380px;
  height: 550px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    height: calc(100vh - 140px);
    bottom: 20px;
    right: 20px;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`;

const ChatSubtitle = styled.p`
  font-size: 0.85rem;
  margin: 4px 0 0 0;
  opacity: 0.9;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const SuggestedQuestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const QuestionButton = styled(motion.button)`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  text-align: left;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
    color: #667eea;
    transform: translateX(4px);
  }

  &::before {
    content: '💬';
    font-size: 1rem;
  }
`;

const Message = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: ${props => props.$isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${props => props.$isUser ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    'white'
  };
  color: ${props => props.$isUser ? 'white' : '#1e293b'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-wrap: break-word;

  /* Markdown-style formatting */
  strong {
    font-weight: 700;
    color: ${props => props.$isUser ? 'white' : '#0f172a'};
  }
  
  /* Links */
  a {
    color: ${props => props.$isUser ? '#fde68a' : '#667eea'};
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      color: ${props => props.$isUser ? '#fcd34d' : '#4f46e5'};
      text-decoration: underline;
    }
  }

  em {
    font-style: italic;
  }

  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin: 4px 0;
  }

  code {
    background: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.2)' : '#f1f5f9'};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
  }

  p {
    margin: 8px 0;
  }

  p:first-child {
    margin-top: 0;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

const ChatInput = styled.form`
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
`;

const WelcomeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const WelcomeText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const sessionId = localStorage.getItem('sessionId') || 'anonymous';
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userEmail = user?.email || null;

  // Simple Markdown to HTML converter
  const formatMessage = (text) => {
    if (!text) return '';
    
    let formatted = text;
    
    // Links FIRST (before bold/italic): [text](/url) or [text](url) -> <a>text</a>
    const linkCount = (text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
    console.log('[ChatWidget] Formatting message with', linkCount, 'links');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #667eea; font-weight: 600; text-decoration: underline; cursor: pointer;">$1</a>');
    console.log('[ChatWidget] After replacement, has <a> tags:', formatted.includes('<a href'));
    
    // Bold: **text** -> <strong>text</strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text* -> <em>text</em>
    formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');
    
    // Code: `text` -> <code>text</code>
    formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Bullet points: • text -> proper list items
    const lines = formatted.split('\n');
    let inList = false;
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('•')) {
        if (!inList) {
          processedLines.push('<ul style="margin: 8px 0; padding-left: 20px;">');
          inList = true;
        }
        processedLines.push(`<li style="margin: 4px 0;">${line.trim().substring(1).trim()}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    formatted = processedLines.join('\n');
    
    // Preserve line breaks
    formatted = formatted.replace(/\n\n/g, '<br/><br/>');
    formatted = formatted.replace(/\n/g, '<br/>');
    
    return formatted;
  };

  // Get current page context
  const getPageContext = () => {
    const path = location.pathname;
    const search = location.search;
    
    // Extract assessment ID from URL if present
    const assessmentIdMatch = path.match(/\/results\/([^/]+)/);
    const assessmentId = assessmentIdMatch ? assessmentIdMatch[1] : null;
    
    // Determine page type
    let pageType = 'home';
    let pageData = {};
    
    if (path === '/') {
      pageType = 'home';
    } else if (path.startsWith('/assessment')) {
      pageType = 'assessment';
      // Try to get current assessment data
      const currentAssessment = JSON.parse(localStorage.getItem('currentAssessment') || 'null');
      if (currentAssessment) {
        pageData = {
          assessmentId: currentAssessment.id,
          organization: currentAssessment.organization,
          progress: currentAssessment.progress
        };
      }
    } else if (path.startsWith('/results')) {
      pageType = 'maturity_report';
      pageData = { assessmentId };
    } else if (path.startsWith('/executive-command-center')) {
      pageType = 'executive_dashboard';
      pageData = { assessmentId };
    } else if (path.startsWith('/insights-dashboard')) {
      pageType = 'insights_dashboard';
      pageData = { assessmentId };
    } else if (path.startsWith('/industry-benchmarks')) {
      pageType = 'industry_benchmarks';
      pageData = { assessmentId };
    } else if (path.startsWith('/deep-dive')) {
      pageType = 'deep_dive';
    } else if (path.startsWith('/dashboard')) {
      pageType = 'dashboard';
    } else if (path.startsWith('/user-guide')) {
      pageType = 'user_guide';
    } else if (path.startsWith('/pitch-deck')) {
      pageType = 'pitch_deck';
    } else if (path.startsWith('/admin')) {
      pageType = 'admin';
    }
    
    return { pageType, pageData, path };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, suggestedQuestions]);

  // Initialize with suggested questions when opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const context = getPageContext();
      const initialQuestions = getInitialSuggestedQuestions(context.pageType);
      setSuggestedQuestions(initialQuestions);
    }
  }, [isOpen]);

  // Get initial suggested questions based on page type
  const getInitialSuggestedQuestions = (pageType) => {
    const questionsByPage = {
      home: [
        "How do I start an assessment?",
        "What are the 6 pillars?",
        "How long does it take?",
        "Can I save and resume later?"
      ],
      assessment: [
        "How do I rate maturity levels?",
        "What are pain points?",
        "Can I skip questions?",
        "How do I save my progress?"
      ],
      maturity_report: [
        "What do my scores mean?",
        "How can I improve my maturity?",
        "What are Databricks Recommendations?",
        "Can I edit this report?"
      ],
      executive_dashboard: [
        "What are Strategic Imperatives?",
        "How do I use the roadmap?",
        "Can I present this to executives?",
        "What are the success metrics?"
      ],
      insights_dashboard: [
        "What metrics are shown here?",
        "How do I track progress over time?",
        "Can I compare assessments?",
        "How do I export this data?"
      ],
      industry_benchmarks: [
        "What do percentile rankings mean?",
        "How do I compare to industry?",
        "What's a good percentile?",
        "How can I improve my ranking?"
      ],
      deep_dive: [
        "What does this page explain?",
        "What are the 6 pillars in detail?",
        "What is the maturity framework?",
        "How is the assessment scored?"
      ],
      user_guide: [
        "How do I get started?",
        "What features are available?",
        "Where can I find help?",
        "How do I troubleshoot issues?"
      ],
      dashboard: [
        "How do I view my assessments?",
        "How do I start a new assessment?",
        "Can I export to Excel?",
        "How do I share assessments?"
      ],
      admin: [
        "How do I manage users?",
        "How do I assign assessments?",
        "Can I add custom questions?",
        "How do I view feedback?"
      ],
      pitch_deck: [
        "What is this assessment about?",
        "Who should take this assessment?",
        "What value does it provide?",
        "How do I get started?"
      ]
    };

    return questionsByPage[pageType] || questionsByPage.home;
  };

  const handleSendMessage = async (e, messageText = null) => {
    if (e) e.preventDefault();
    
    const userMessage = messageText || inputValue.trim();
    if (!userMessage || isTyping) return;

    setInputValue('');
    setSuggestedQuestions([]); // Clear suggestions while processing

    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Get current page context
      const context = getPageContext();
      
      // Send message with context
      const response = await chatService.sendMessage(
        userMessage,
        conversationId,
        sessionId,
        userEmail,
        context
      );

      // Update conversation ID if new
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      // Add AI response to UI
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        setIsTyping(false);
        
        // Set new suggested questions based on response
        console.log('[ChatWidget] Response:', response);
        console.log('[ChatWidget] Suggested questions:', response.suggestedQuestions);
        
        if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
          console.log('[ChatWidget] Setting suggested questions:', response.suggestedQuestions);
          setSuggestedQuestions(response.suggestedQuestions);
        } else {
          console.log('[ChatWidget] No suggested questions in response, using defaults');
          // Fallback to page-specific questions if none returned
          const context = getPageContext();
          const defaultQuestions = getInitialSuggestedQuestions(context.pageType);
          setSuggestedQuestions(defaultQuestions);
        }
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      setIsTyping(false);
    }
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(null, question);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <ChatButton
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiMessageCircle size={28} />
          </ChatButton>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <ChatContainer
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHeader>
              <div>
                <ChatTitle>Maturity Assistant</ChatTitle>
                <ChatSubtitle>Ask me anything about the assessment</ChatSubtitle>
              </div>
              <HeaderButtons>
                <IconButton onClick={handleMinimize} title="Minimize">
                  <FiMinimize2 size={16} />
                </IconButton>
                <IconButton onClick={handleClose} title="Close">
                  <FiX size={18} />
                </IconButton>
              </HeaderButtons>
            </ChatHeader>

            <ChatMessages>
              {messages.length === 0 ? (
                <WelcomeMessage>
                  <WelcomeIcon>👋</WelcomeIcon>
                  <WelcomeText>
                    Hi! I'm your Databricks Maturity Assessment assistant. 
                    Click a question below or type your own!
                  </WelcomeText>
                </WelcomeMessage>
              ) : (
                messages.map((msg, index) => (
                  <Message 
                    key={index} 
                    $isUser={msg.role === 'user'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageBubble 
                      $isUser={msg.role === 'user'}
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                  </Message>
                ))
              )}

              {isTyping && (
                <Message $isUser={false}>
                  <TypingIndicator>
                    <Dot
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <Dot
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                    <Dot
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    />
                  </TypingIndicator>
                </Message>
              )}

              {/* Suggested Questions */}
              {!isTyping && suggestedQuestions.length > 0 && (
                <SuggestedQuestions>
                  {suggestedQuestions.map((question, index) => (
                    <QuestionButton
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </QuestionButton>
                  ))}
                </SuggestedQuestions>
              )}

              <div ref={messagesEndRef} />
            </ChatMessages>

            <ChatInput onSubmit={handleSendMessage}>
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <SendButton type="submit" disabled={!inputValue.trim() || isTyping}>
                <FiSend size={18} />
              </SendButton>
            </ChatInput>
          </ChatContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;

