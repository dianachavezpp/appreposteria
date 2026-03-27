import { useState, useEffect } from 'react'
import api from '../api'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import Table from '../components/Table'

const EMPTY_FORM = {
  nombre: '', descripcion: '', ingredientes: '',
  instrucciones: '', categoria_id: '', tiempo_preparacion: '', dificultad: 'Facil'
}

const DIFICULTADES = ['Facil', 'Media', 'Dificil']

export default function RecetasPage() {
  const [recetas, setRecetas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecetas()
    fetchCategorias()
  }, [])

  async function fetchRecetas() {
    try {
      setLoading(true)
      const res = await api.get('/recetas')
      setRecetas(res.data)
    } catch (error) {
      showAlert('error', 'Error al cargar recetas')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategorias() {
    try {
      const res = await api.get('/categorias')
      setCategorias(res.data)
    } catch (error) {
      console.error('Error al cargar categorias')
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

  function openEditModal(receta) {
    setForm({
      nombre: receta.nombre,
      descripcion: receta.descripcion || '',
      ingredientes: receta.ingredientes || '',
      instrucciones: receta.instrucciones || '',
      categoria_id: receta.categoria_id || '',
      tiempo_preparacion: receta.tiempo_preparacion || '',
      dificultad: receta.dificultad || 'Facil',
    })
    setEditingId(receta.id)
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
        await api.post('/recetas', form)
        showAlert('success', `Receta "${form.nombre}" agregada!`)
      } else {
        await api.put(`/recetas/${editingId}`, form)
        showAlert('success', `Receta "${form.nombre}" actualizada!`)
      }
      fetchRecetas()
      closeModal()
    } catch (error) {
      showAlert('error', 'Error al guardar la receta')
    }
  }

  async function handleDelete(receta) {
    if (window.confirm(`Eliminar "${receta.nombre}"?`)) {
      try {
        await api.delete(`/recetas/${receta.id}`)
        showAlert('info', `Receta "${receta.nombre}" eliminada`)
        fetchRecetas()
      } catch (error) {
        showAlert('error', 'Error al eliminar la receta')
      }
    }
  }

  const DIFICULTAD_COLORS = {
    Facil: 'background: #dcfce7; color: #16a34a',
    Media: 'background: #fef9c3; color: #ca8a04',
    Dificil: 'background: #ffe4ed; color: #f43f70',
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria_nombre', label: 'Categoria' },
    {
      key: 'tiempo_preparacion', label: 'Tiempo',
      render: (val) => val ? `${val} min` : '—'
    },
    {
      key: 'dificultad', label: 'Dificultad',
      render: (val) => (
        <span style={{
          padding: '3px 10px', borderRadius: '999px',
          fontSize: '0.75rem', fontWeight: '700',
          ...(val === 'Facil' ? { background: '#dcfce7', color: '#16a34a' } :
              val === 'Media' ? { background: '#fef9c3', color: '#ca8a04' } :
              { background: '#ffe4ed', color: '#f43f70' })
        }}>{val || '—'}</span>
      )
    },
  ]

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '12px 16px', borderRadius: '12px',
    border: '2px solid #ffe4ed', fontSize: '0.9rem',
    outline: 'none', color: '#3d1a24', fontFamily: 'Lato, sans-serif',
  }

  return (
    <div style={{ fontFamily: 'Lato, sans-serif' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: '800', color: '#f43f70', margin: '0 0 4px' }}>
            Recetas
          </h1>
          <p style={{ color: '#c4828f', fontSize: '0.9rem', margin: 0 }}>
            Gestiona las recetas de reposteria
          </p>
        </div>
        <button onClick={openAddModal} style={{
          padding: '10px 24px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, #ffb3c6, #f43f70)',
          color: 'white', fontWeight: '700', fontSize: '0.9rem',
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(244,63,112,0.3)',
        }}>
          + Nueva Receta
        </button>
      </div>

      {/* Alerta */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Recetas', value: recetas.length, color: '#f43f70' },
          { label: 'Faciles', value: recetas.filter(r => r.dificultad === 'Facil').length, color: '#22c55e' },
          { label: 'Dificiles', value: recetas.filter(r => r.dificultad === 'Dificil').length, color: '#a855f7' },
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
          Cargando recetas...
        </div>
      ) : (
        <Table columns={columns} data={recetas} onEdit={openEditModal} onDelete={handleDelete} emptyMessage="No hay recetas aun" />
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'Editar Receta' : 'Nueva Receta'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Nombre</label>
            <input type="text" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Red Velvet" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Descripcion</label>
            <textarea value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe la receta..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Ingredientes</label>
            <textarea value={form.ingredientes}
              onChange={(e) => setForm({ ...form, ingredientes: e.target.value })}
              placeholder="Lista de ingredientes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Instrucciones</label>
            <textarea value={form.instrucciones}
              onChange={(e) => setForm({ ...form, instrucciones: e.target.value })}
              placeholder="Pasos de preparacion..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Categoria</label>
              <select value={form.categoria_id}
                onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                style={{ ...inputStyle, background: 'white' }}>
                <option value="">Selecciona...</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Tiempo (min)</label>
              <input type="number" value={form.tiempo_preparacion}
                onChange={(e) => setForm({ ...form, tiempo_preparacion: e.target.value })}
                placeholder="Ej: 45" min="1" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#c4828f', fontWeight: '700', fontSize: '0.82rem', marginBottom: '6px', textTransform: 'uppercase' }}>Dificultad</label>
            <select value={form.dificultad}
              onChange={(e) => setForm({ ...form, dificultad: e.target.value })}
              style={{ ...inputStyle, background: 'white' }}>
              {DIFICULTADES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
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