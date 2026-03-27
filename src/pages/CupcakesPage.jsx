import { useState } from 'react'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Table from '../components/Table'

const INITIAL_CUPCAKES = [
  { id: 1, nombre: 'Red Velvet Dream', sabor: 'Vainilla y queso crema', precio: 45, disponible: true },
  { id: 2, nombre: 'Choco Rosado', sabor: 'Chocolate oscuro', precio: 40, disponible: true },
  { id: 3, nombre: 'Fresa Feliz', sabor: 'Fresa natural', precio: 42, disponible: false },
]

const EMPTY_FORM = { nombre: '', sabor: '', precio: '', disponible: true }

export default function CupcakesPage() {
  const [cupcakes, setCupcakes] = useState(INITIAL_CUPCAKES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [alert, setAlert] = useState(null)
  const [search, setSearch] = useState('')

  function showAlert(type, message) {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3500)
  }

  function openAddModal() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setIsModalOpen(true)
  }

  function openEditModal(cupcake) {
    setForm({ ...cupcake })
    setEditingId(cupcake.id)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  function handleSave() {
    if (!form.nombre.trim() || !form.sabor.trim() || !form.precio) {
      showAlert('warning', 'Por favor completa todos los campos.')
      return
    }
    if (isNaN(Number(form.precio)) || Number(form.precio) <= 0) {
      showAlert('error', 'El precio debe ser un número mayor a 0.')
      return
    }
    if (editingId === null) {
      setCupcakes([...cupcakes, { ...form, id: Date.now(), precio: Number(form.precio) }])
      showAlert('success', `¡Cupcake "${form.nombre}" agregado! 🧁`)
    } else {
      setCupcakes(cupcakes.map((c) =>
        c.id === editingId ? { ...form, id: editingId, precio: Number(form.precio) } : c
      ))
      showAlert('success', `¡Cupcake "${form.nombre}" actualizado! ✨`)
    }
    closeModal()
  }

  function handleDelete(cupcake) {
    if (window.confirm(`¿Eliminar "${cupcake.nombre}"?`)) {
      setCupcakes(cupcakes.filter((c) => c.id !== cupcake.id))
      showAlert('info', `Cupcake "${cupcake.nombre}" eliminado.`)
    }
  }

  const filtered = cupcakes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.sabor.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'sabor', label: 'Sabor' },
    { key: 'precio', label: 'Precio', render: (val) => <span className="font-semibold text-rose-500">${val}.00 MXN</span> },
    { key: 'disponible', label: 'Disponible', render: (val) =>
      val
        ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">✅ Sí</span>
        : <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs font-semibold">❌ No</span>
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold text-rose-600" style={{fontFamily:'Playfair Display,serif'}}>🧁 Cupcakes</h1>
          <p className="text-rose-400 text-sm">Gestiona el menú de cupcakes</p>
        </div>
        <button onClick={openAddModal} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">
          + Nuevo Cupcake
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <input
        type="text"
        placeholder="🔍 Buscar por nombre o sabor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-72 px-4 py-2.5 rounded-xl border-2 border-rose-200 bg-white/90 focus:outline-none focus:border-rose-400 text-sm text-gray-700 mb-4 transition-colors"
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: cupcakes.length, icon: '🧁' },
          { label: 'Disponibles', value: cupcakes.filter((c) => c.disponible).length, icon: '✅' },
          { label: 'Agotados', value: cupcakes.filter((c) => !c.disponible).length, icon: '❌' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-rose-500">{stat.value}</div>
            <div className="text-xs text-rose-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <Table columns={columns} data={filtered} onEdit={openEditModal} onDelete={handleDelete} emptyMessage="No se encontraron cupcakes 🧁" />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar Cupcake' : 'Nuevo Cupcake'}>
        <div className="space-y-4">
          <div>
            <label className="block text-rose-600 font-semibold text-sm mb-1">Nombre</label>
            <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Red Velvet Dream"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 bg-white focus:outline-none focus:border-rose-400 text-sm text-gray-700 transition-colors" />
          </div>
          <div>
            <label className="block text-rose-600 font-semibold text-sm mb-1">Sabor</label>
            <input type="text" value={form.sabor} onChange={(e) => setForm({ ...form, sabor: e.target.value })}
              placeholder="Ej: Vainilla y queso crema"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 bg-white focus:outline-none focus:border-rose-400 text-sm text-gray-700 transition-colors" />
          </div>
          <div>
            <label className="block text-rose-600 font-semibold text-sm mb-1">Precio (MXN)</label>
            <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
              placeholder="Ej: 45" min="1"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-200 bg-white focus:outline-none focus:border-rose-400 text-sm text-gray-700 transition-colors" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-rose-600 font-semibold text-sm">¿Disponible?</label>
            <button type="button" onClick={() => setForm({ ...form, disponible: !form.disponible })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.disponible ? 'bg-rose-400' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.disponible ? 'translate-x-6' : ''}`} />
            </button>
            <span className="text-sm text-gray-500">{form.disponible ? 'Sí' : 'No'}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border-2 border-rose-200 text-rose-400 font-semibold text-sm hover:bg-rose-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold text-sm shadow hover:from-rose-500 transition-all">
              {editingId ? '💾 Guardar' : '✨ Agregar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}