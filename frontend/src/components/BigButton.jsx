import React from "react";

export function BigButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-700 hover:to-purple-700
        text-white font-semibold
        text-2xl sm:text-3xl
        px-10 sm:px-14 py-5 sm:py-6
        rounded-2xl shadow-2xl
        transform hover:scale-105 active:scale-95
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-blue-500/50
        ${className}
      `}
    >
      {children}
    </button>
  );
}
