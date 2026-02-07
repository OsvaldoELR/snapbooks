import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import type { Session, SessionStatus } from '../types';

export default function Sessions() {
  const { data, addSession, updateSession, deleteSession } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const filteredSessions = data.sessions.filter(s =>
    s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.photographer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'realizada': return 'bg-blue-100 text-blue-800';
      case 'entregada': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: SessionStatus) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'realizada': return 'Realizada';
      case 'entregada': return 'Entregada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Sesiones</h1>
          <p className="text-gray-600 mt-1">
            Solo sesiones entregadas cuentan como ingreso real
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Sesión
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por cliente o fotógrafa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fotógrafa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fotos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No hay sesiones registradas
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{session.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{session.sessionType}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${session.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{session.photographer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{session.photoCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusLabel(session.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(session)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar esta sesión?')) {
                              deleteSession(session.id);
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SessionModal
          session={editingSession}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSession(null);
          }}
          onSave={(sessionData) => {
            if (editingSession) {
              updateSession(editingSession.id, sessionData);
            } else {
              addSession(sessionData);
            }
            setIsModalOpen(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}

interface SessionModalProps {
  session: Session | null;
  onClose: () => void;
  onSave: (session: Omit<Session, 'id' | 'createdAt'>) => void;
}

function SessionModal({ session, onClose, onSave }: SessionModalProps) {
  const [formData, setFormData] = useState({
    clientName: session?.clientName || '',
    date: session?.date || new Date().toISOString().split('T')[0],
    sessionType: session?.sessionType || '',
    price: session?.price || 0,
    includesPrint: session?.includesPrint || false,
    photoCount: session?.photoCount || 0,
    photographer: session?.photographer || '',
    decorationCost: session?.decorationCost || 0,
    notes: session?.notes || '',
    status: session?.status || 'pendiente' as SessionStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {session ? 'Editar Sesión' : 'Nueva Sesión'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Sesión
              </label>
              <input
                type="text"
                required
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                placeholder="Ej: Retrato, Familia, Boda"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Fotos
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.photoCount}
                onChange={(e) => setFormData({ ...formData, photoCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fotógrafa Asignada
              </label>
              <input
                type="text"
                required
                value={formData.photographer}
                onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Decoración ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.decorationCost}
                onChange={(e) => setFormData({ ...formData, decorationCost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SessionStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="pendiente">Pendiente</option>
                <option value="realizada">Realizada</option>
                <option value="entregada">Entregada</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includesPrint}
                  onChange={(e) => setFormData({ ...formData, includesPrint: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Incluye Impresión</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              {session ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
