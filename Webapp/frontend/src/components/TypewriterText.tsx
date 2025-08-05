import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TypewriterText({ 
  text, 
  speed = 50, 
  delay = 0, 
  onComplete, 
  className = "" 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
        setIsComplete(false);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <span className="animate-pulse text-purple-500">|</span>
      )}
    </span>
  );
}

// Typewriter for messages with streaming effect
export function TypewriterMessage({ 
  message, 
  speed = 30, 
  onComplete 
}: { 
  message: string; 
  speed?: number; 
  onComplete?: () => void; 
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === message.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, message, speed, onComplete]);

  return (
    <div className="whitespace-pre-wrap">
      {displayText}
      {currentIndex < message.length && (
        <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1"></span>
      )}
    </div>
  );
}

// Typewriter for code/content with syntax highlighting effect
export function TypewriterContent({ 
  content, 
  speed = 25, 
  onComplete,
  className = ""
}: { 
  content: string; 
  speed?: number; 
  onComplete?: () => void;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === content.length) {
      if (onComplete) {
        onComplete();
      }
      // Hide cursor after completion
      setTimeout(() => setShowCursor(false), 1000);
    }
  }, [currentIndex, content, speed, onComplete]);

  return (
    <div className={`font-mono text-sm ${className}`}>
      <div className="whitespace-pre-wrap">
        {displayText}
        {showCursor && currentIndex <= content.length && (
          <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1"></span>
        )}
      </div>
    </div>
  );
}

// Staggered typewriter for multiple lines
export function StaggeredTypewriter({ 
  lines, 
  lineDelay = 500, 
  speed = 40 
}: { 
  lines: string[]; 
  lineDelay?: number; 
  speed?: number; 
}) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  const handleLineComplete = (line: string) => {
    setCompletedLines(prev => [...prev, line]);
    setTimeout(() => {
      if (currentLineIndex < lines.length - 1) {
        setCurrentLineIndex(prev => prev + 1);
      }
    }, lineDelay);
  };

  return (
    <div className="space-y-2">
      {completedLines.map((line, index) => (
        <div key={index} className="text-gray-900">
          {line}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <TypewriterText
          text={lines[currentLineIndex]}
          speed={speed}
          onComplete={() => handleLineComplete(lines[currentLineIndex])}
          className="text-gray-900"
        />
      )}
    </div>
  );
}

// Typewriter with sound effect simulation
export function TypewriterWithSound({ 
  text, 
  speed = 50, 
  onComplete,
  className = ""
}: { 
  text: string; 
  speed?: number; 
  onComplete?: () => void;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Simulate typing sound with visual feedback
        const char = text[currentIndex];
        if (char !== ' ') {
          // Add a subtle flash effect for non-space characters
          document.body.style.backgroundColor = '#f8fafc';
          setTimeout(() => {
            document.body.style.backgroundColor = '';
          }, 50);
        }
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-blue-500 animate-pulse ml-1"></span>
      )}
    </span>
  );
}
