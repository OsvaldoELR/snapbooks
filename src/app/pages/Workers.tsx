import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { Worker, PaymentType } from '../types';

export default function Workers() {
  const { data, addWorker, updateWorker, deleteWorker } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingWorker(null);
    setIsModalOpen(true);
  };

  const getPaymentTypeLabel = (type: PaymentType) => {
    switch (type) {
      case 'salario_semanal': return 'Salario Semanal Fijo';
      case 'por_sesion': return 'Por Sesión';
      case 'por_foto': return 'Por Foto';
      case 'comision_cliente': return 'Comisión por Cliente';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Trabajadores</h1>
          <p className="text-gray-600 mt-1">
            Administra tu equipo y sus modalidades de pago
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Trabajador
        </button>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.workers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            No hay trabajadores registrados
          </div>
        ) : (
          data.workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{worker.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(worker)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar a ${worker.name}?`)) {
                        deleteWorker(worker.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-indigo-600 font-medium mb-1">Tipo de Pago</p>
                  <p className="text-sm font-medium text-indigo-900">
                    {getPaymentTypeLabel(worker.paymentType)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">Monto</p>
                  <p className="text-lg font-bold text-green-900">
                    ${worker.amount}
                    {worker.paymentType === 'salario_semanal' && ' /semana'}
                    {worker.paymentType === 'por_sesion' && ' /sesión'}
                    {worker.paymentType === 'por_foto' && ' /foto'}
                    {worker.paymentType === 'comision_cliente' && ' /cliente'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <WorkerModal
          worker={editingWorker}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWorker(null);
          }}
          onSave={(workerData) => {
            if (editingWorker) {
              updateWorker(editingWorker.id, workerData);
            } else {
              addWorker(workerData);
            }
            setIsModalOpen(false);
            setEditingWorker(null);
          }}
        />
      )}
    </div>
  );
}

interface WorkerModalProps {
  worker: Worker | null;
  onClose: () => void;
  onSave: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
}

function WorkerModal({ worker, onClose, onSave }: WorkerModalProps) {
  const [formData, setFormData] = useState({
    name: worker?.name || '',
    role: worker?.role || '',
    paymentType: worker?.paymentType || 'salario_semanal' as PaymentType,
    amount: worker?.amount || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {worker ? 'Editar Trabajador' : 'Nuevo Trabajador'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: María González"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Ej: Fotógrafa, Editora, Comercial"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Pago
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as PaymentType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="salario_semanal">Salario Semanal Fijo</option>
              <option value="por_sesion">Pago por Sesión</option>
              <option value="por_foto">Pago por Foto</option>
              <option value="comision_cliente">Comisión por Cliente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              placeholder="Ej: 150.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.paymentType === 'salario_semanal' && 'Salario semanal fijo'}
              {formData.paymentType === 'por_sesion' && 'Pago por cada sesión'}
              {formData.paymentType === 'por_foto' && 'Pago por cada foto editada'}
              {formData.paymentType === 'comision_cliente' && 'Comisión por cada cliente'}
            </p>
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
              {worker ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
