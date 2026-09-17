import React from 'react'

function Card({ title, desc, icon, dark, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
        ${dark
          ? 'bg-black text-white hover:bg-gray-900'
          : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
        }`}
    >
      
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0
          ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}
      >
        {icon}
      </div>

      
      <div className="flex-1">
        <h4 className="font-semibold text-base">{title}</h4>
        <p className={`text-sm mt-0.5 ${dark ? 'text-gray-300' : 'text-gray-500'}`}>
          {desc}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-gray-400 text-xl">›</div>
    </div>
  )
}

export default Card