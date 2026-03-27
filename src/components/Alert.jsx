export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null

  const styles = {
    success: { bg: 'bg-green-50 border-green-300', text: 'text-green-800', icon: '✅' },
    error:   { bg: 'bg-rose-50 border-rose-300',   text: 'text-rose-800',  icon: '❌' },
    warning: { bg: 'bg-yellow-50 border-yellow-300',text: 'text-yellow-800',icon: '⚠️' },
    info:    { bg: 'bg-pink-50 border-pink-300',    text: 'text-pink-800',  icon: '💬' },
  }

  const s = styles[type] || styles.info

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${s.bg} ${s.text} shadow-sm mb-4`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{s.icon}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-lg opacity-60 hover:opacity-100 transition-opacity">
          ×
        </button>
      )}
    </div>
  )
}