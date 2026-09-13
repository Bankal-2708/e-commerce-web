import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.jpeg';

function Logo() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFade(true);
    }, 50);

    const fadeOutTimer = setTimeout(() => {
      setFade(false);
    }, 2400);

    const navTimer = setTimeout(() => {
      navigate('/step-one');
    }, 3000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen w-full bg-white flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        opacity: fade ? 1 : 0,
        transform: fade ? 'scale(1)' : 'scale(0.96)',
      }}
    >
      <img
        src={logoImg}
        alt="Logo"
        className="w-100 h-auto object-contain transition-transform duration-700"
      />
    </div>
  );
}

export default Logo;