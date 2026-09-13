import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.jpeg';

function Logo() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFade(true);
    }, 60);

    const fadeOutTimer = setTimeout(() => {
      setFade(false);
    }, 2200);

    // navigate only AFTER the fade-out transition (900ms) has fully finished
    const navTimer = setTimeout(() => {
      navigate('/step-one');
    }, 2200 + 900);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen w-full bg-white flex flex-col items-center justify-center"
      style={{
        opacity: fade ? 1 : 0,
        transform: fade ? 'scale(1)' : 'scale(0.97)',
        transition: 'opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 900ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <img
        src={logoImg}
        alt="Logo"
        className="w-100 h-auto object-contain"
      />
    </div>
  );
}

export default Logo;