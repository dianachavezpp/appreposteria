export default function Table({ columns, data, onEdit, onDelete, emptyMessage = 'No hay datos aún 🧁' }) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-md border border-rose-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-rose-400 to-pink-300 text-white">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold tracking-wide">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-center font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-10 text-rose-300 text-base bg-white">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`border-b border-rose-50 hover:bg-rose-50/60 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit && onEdit(row)}
                      className="px-3 py-1 rounded-lg bg-pink-100 text-rose-600 hover:bg-rose-200 font-semibold text-xs transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(row)}
                      className="px-3 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-300 font-semibold text-xs transition-colors"
                    >
                      🗑️ Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}