'use client'

import { useEffect, useState } from 'react';

export const Typewriter = ({ words }: any) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(200);
  const [hasCompleted, setHasCompleted] = useState(false); // Estado para controlar si la animación ha completado

  useEffect(() => {
    if (hasCompleted) return; // Si la animación ha completado, no hacer nada

    const handleType = () => {
      const currentWord = words[currentWordIndex];
      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          setSpeed(1500);
        } else {
          setSpeed(50);
        }
      } else {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          setIsDeleting(true);
          setSpeed(1500);
        } else {
          setSpeed(50);
        }
      }

      // Comprobar si se ha completado la animación
      if (!isDeleting && currentWordIndex === words.length - 1 && text === currentWord) {
        setHasCompleted(true);
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, speed, words, currentWordIndex, hasCompleted]);

  return <h1 className="text-3xl text-center  tracking-tight text-indigo-700 md:text-6xl xl:text-6xl">{text}</h1>;
};

export default Typewriter;
