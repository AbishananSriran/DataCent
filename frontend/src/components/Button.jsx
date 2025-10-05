export function Button({ children, disabled, className, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={className || `inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white font-medium hover:bg-purple-700 transition-colors`}
    >
      {children}
    </button>
  );
}