import React from 'react';
import { useNavigate } from 'react-router-dom';
import stepThreeImg from '../../assets/images/stepThree.jpeg';


function StepThree() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between px-6 md:px-10 py-5">
      <div className="flex justify-end w-full">
        <button
          onClick={() => navigate('/authscreen')}
          className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="w-full   mx-auto flex flex-col items-center">
        <div className="w-full h-[320px] md:h-[390px] bg-[#f5f5f5] rounded-[28px] flex items-center justify-center mb-10 overflow-hidden">
          <img
            src={stepThreeImg}
            alt="Discover Your Style"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[26px] font-bold text-[#111111] mb-2 tracking-tight">
            Discover Your Style
          </h1>
          <p className="text-sm text-gray-500 font-normal whitespace-nowrap">
            Find outfits that match your body type, skin tone and personal style.
          </p>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 bg-gray-200 rounded-full transition-all"></span>
          <span className="w-2 h-2 bg-gray-200 rounded-full transition-all"></span>
          <span className="w-7 h-2 bg-black rounded-full transition-all"></span>
        </div>
      </div>

      <div className="w-full   mx-auto pb-1">
        <button
          onClick={() => navigate('/authscreen')}
          className="w-full bg-black hover:bg-neutral-900 text-white font-medium py-3.5 rounded-xl transition-all active:scale-[0.99] text-base"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StepThree;