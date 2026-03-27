import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Table from '../components/Table'

const EMPTY_FORM = { nombre: '', descripcion: '' }

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar categorias al iniciar
  useEffect(() => {
    fetchCategorias()
  }, [])

  async function fetchCategorias() {
    try {
      setLoading(true)
      const res = await api.get('/categorias')
      setCategorias(res.data)
    } catch (error) {
      showAlert('error', 'Error al cargar categorias')
    } finally {
      setLoading(false)
    }
  }

  function showAlert(type, message) {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3500)
  }

  function openAddModal() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setIsModalOpen(true)
  }

  function openEditModal(categoria) {
    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion })
    setEditingId(categoria.id)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  async function handleSave() {
    if (!form.nombre.trim()) {
      showAlert('warning', 'El nombre es obligatorio')
      return
    }
    try {
      if (editingId === null) {
        await api.post('/categorias', form)
        showAlert('success', `Categoria "${form.nombre}" agregada!`)
      } else {
        await api.put(`/categorias/${editingId}`, form)
        showAlert('success', `Categoria "${form.nombre}" actualizada!`)
      }
      fetchCategorias()
      closeModal()
    } catch (error) {
      showAlert('error', 'Error al guardar la categoria')
    }
  }

  async function handleDelete(categoria) {
    if (window.confirm(`Eliminar "${categoria.nombre}"?`)) {
      try {
        await api.delete(`/categorias/${categoria.id}`)
        showAlert('info', `Categoria "${categoria.nombre}" eliminada`)
        fetchCategorias()
      } catch (error) {
        showAlert('error', 'Error al eliminar la categoria')
      }
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripcion' },
    {
      key: 'created_at', label: 'Fecha',
      render: (val) => new Date(val).toLocaleDateString('es-MX')
    },
  ]

  return (
    <div style={{ fontFamily: 'Lato, sans-serif' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: '800', color: '#f43f70', margin: '0 0 4px' }}>
            Categorias
          </h1>
          <p style={{ color: '#c4828f', fontSize: '0.9rem', margin: 0 }}>
            Gestiona las categorias de reposteria
          </p>
        </div>
        <button onClick={openAddModal} style={{
          padding: '10px 24px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, #ffb3c6, #f43f70)',
          color: 'white', fontWeight: '700', fontSize: '0.9rem',
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(244,63,112,0.3)',
        }}>
          + Nueva Categoria
        </button>
      </div>

      {/* Alerta */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total', value: categorias.length, color: '#f43f70' },
          { label: 'Activas', value: categorias.length, color: '#22c55e' },
          { label: 'Recetas', value: '—', color: '#a855f7' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 2px 12px rgba(255,182,193,0.2)',
            border: '1px solid #ffe4ed',
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#c4828f', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ffb3c6', fontSize: '1.1rem' }}>
          Cargando categorias...
        </div>
      ) : (
        <Table columns={columns} data={categorias} onEdit={openEditModal} onDelete={handleDelete} emptyMessage="No hay categorias aun" />
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar Categoria' : 'Nueva Categoria'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Nombre</label>
            <input type="text" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Pasteles"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '2px solid #ffe4ed', fontSize: '0.9rem', outline: 'none', color: '#3d1a24' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Descripcion</label>
            <textarea value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe la categoria..."
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', border: '2px solid #ffe4ed', fontSize: '0.9rem', outline: 'none', color: '#3d1a24', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={closeModal} style={{
              flex: 1, padding: '12px', borderRadius: '12px',
              border: '2px solid #ffe4ed', background: 'white',
              color: '#f43f70', fontWeight: '700', cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={handleSave} style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #ffb3c6, #f43f70)',
              color: 'white', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(244,63,112,0.3)',
            }}>{editingId ? 'Guardar cambios' : 'Agregar'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}