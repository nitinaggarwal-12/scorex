import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiVolume2, FiPlay, FiPause, FiSquare, FiFastForward } from 'react-icons/fi';
import toast from 'react-hot-toast';

const wave = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 24px; }
`;

const PlayerCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 1px solid rgba(139, 92, 246, 0.35);
  backdrop-filter: blur(16px);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);

  @media print {
    display: none !important;
  }
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .text {
    h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 0.82rem;
      color: #cbd5e1;
      margin: 0;
    }
  }
`;

const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  height: 28px;
`;

const WaveBar = styled.div`
  width: 3px;
  background: linear-gradient(180deg, #a855f7 0%, #38bdf8 100%);
  border-radius: 3px;
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: ${props => props.$playing ? 'running' : 'paused'};
  height: ${props => props.$playing ? '16px' : '4px'};
  transition: height 0.2s ease;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PlayButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  }
`;

const SecondaryControl = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }
`;

const AudioBriefingPlayer = ({ instance, report }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const utteranceRef = useRef(null);
  const keepAliveTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (keepAliveTimerRef.current) {
        clearInterval(keepAliveTimerRef.current);
        keepAliveTimerRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const generateSpeechScript = () => {
    const customer = instance?.customerName || 'your organization';
    const framework = instance?.frameworkSnapshot?.title || 'Architecture Assessment';
    const score = report?.overallScore || instance?.totalScore || 3.0;
    const stage = report?.maturityLevel || instance?.maturityLevel || 'Defined';
    const summary = report?.executiveSummary || 'Your architecture shows strong baseline capabilities with clear modernization opportunities.';
    const recommendations = (report?.prioritizedRecommendations || []).slice(0, 3);

    let script = `Executive Audio Briefing for ${customer}. `;
    script += `This is your executive summary for the ${framework}. `;
    script += `Your evaluated architectural maturity score is ${score} out of 5.0, positioning the organization at the ${stage} stage. `;
    script += `${summary} `;

    if (recommendations.length > 0) {
      script += `Here are the top strategic recommendations: `;
      recommendations.forEach((rec, idx) => {
        script += `Priority ${idx + 1}: ${rec.title || rec.recommendation || rec.action}. `;
      });
    }

    script += `Thank you for using ScoreX enterprise assessment platform.`;
    return script;
  };

  const cleanupSpeech = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Audio speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();

        const text = generateSpeechScript();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackRate;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          cleanupSpeech();
        };

        utterance.onerror = () => {
          cleanupSpeech();
        };

        utteranceRef.current = utterance;

        if (keepAliveTimerRef.current) {
          clearInterval(keepAliveTimerRef.current);
        }
        // Chromium keep-alive interval to prevent 15-second speech cutoff
        keepAliveTimerRef.current = setInterval(() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        toast('🎙️ Executive AI Audio Briefing playing...', { id: 'audio-play', icon: '🎧' });
      }
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    cleanupSpeech();
  };

  const cycleRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (isPlaying) {
      handleStop();
      toast(`Speed set to ${nextRate}x. Restart playback to apply.`, { id: 'audio-speed' });
    }
  };

  return (
    <PlayerCard
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <InfoSection>
        <div className="icon-wrap">
          <FiVolume2 />
        </div>
        <div className="text">
          <h4>AI Executive Audio Briefing</h4>
          <p>90-second synthesized C-suite narrative & priority action items</p>
        </div>
      </InfoSection>

      <WaveContainer>
        {[0, 0.2, 0.4, 0.6, 0.8, 0.3, 0.7, 0.5, 0.1, 0.4].map((delay, idx) => (
          <WaveBar key={idx} $delay={delay} $playing={isPlaying} />
        ))}
      </WaveContainer>

      <ControlsGroup>
        <SecondaryControl onClick={cycleRate} title="Change speech playback speed">
          <FiFastForward size={13} /> {playbackRate}x
        </SecondaryControl>

        <SecondaryControl onClick={handleStop} title="Stop Audio">
          <FiSquare size={13} /> Stop
        </SecondaryControl>

        <PlayButton onClick={handlePlayToggle}>
          {isPlaying ? <FiPause /> : <FiPlay />}
          {isPlaying ? 'Pause' : 'Play Briefing'}
        </PlayButton>
      </ControlsGroup>
    </PlayerCard>
  );
};

export default AudioBriefingPlayer;
