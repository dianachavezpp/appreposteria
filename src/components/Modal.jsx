export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(136, 19, 55, 0.18)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass-card rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-400 to-pink-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">
            🧁 {title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light transition-colors"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}