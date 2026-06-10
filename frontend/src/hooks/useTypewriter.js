import { useEffect, useState } from 'react';

export const useTypewriter = (phrases = [], speed = 48, pause = 1800) => {
  const [display, setDisplay] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) return undefined;

    const current = phrases[phraseIndex % phrases.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const next = current.slice(0, display.length + 1);
          setDisplay(next);
          if (next === current) {
            setTimeout(() => setIsDeleting(true), pause);
          }
        } else {
          const next = current.slice(0, display.length - 1);
          setDisplay(next);
          if (!next.length) {
            setIsDeleting(false);
            setPhraseIndex((prev) => prev + 1);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [display, phraseIndex, isDeleting, phrases, speed, pause]);

  return display;
};
