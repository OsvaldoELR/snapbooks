import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import type { Print, PrintStatus } from '../types';

export default function Prints() {
  const { data, addPrint, updatePrint, deletePrint } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);

  const handleEdit = (print: Print) => {
    setEditingPrint(print);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPrint(null);
    setIsModalOpen(true);
  };

  const pendingPrints = data.prints.filter(p => p.status === 'pagada');
  const deliveredPrints = data.prints.filter(p => p.status === 'entregada');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Impresiones</h1>
          <p className="text-gray-600 mt-1">
            El dinero va a reserva hasta que se entregue
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Impresión
        </button>
      </div>

      {/* Alert for pending prints */}
      {pendingPrints.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="font-medium text-orange-900">
              Tienes {pendingPrints.length} impresión(es) pendiente(s) de entrega
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Este dinero está en reserva y no cuenta como ganancia hasta que se entreguen.
            </p>
          </div>
        </div>
      )}

      {/* Pending Prints */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-orange-50 px-6 py-3 border-b border-orange-200">
          <h2 className="font-bold text-orange-900">Impresiones Pendientes de Entrega</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cobro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Cobrado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Real</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">En Reserva</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingPrints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay impresiones pendientes
                  </td>
                </tr>
              ) : (
                pendingPrints.map((print) => (
                  <tr key={print.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{print.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(print.chargeDate).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${print.amountCharged}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${print.actualCost}</td>
                    <td className="px-6 py-4 text-sm font-medium text-orange-600">
                      ${(print.amountCharged - print.actualCost).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(print)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar esta impresión?')) {
                              deletePrint(print.id);
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

      {/* Delivered Prints */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-green-200">
          <h2 className="font-bold text-green-900">Impresiones Entregadas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Cobro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Entrega</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto Cobrado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Real</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ganancia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveredPrints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay impresiones entregadas
                  </td>
                </tr>
              ) : (
                deliveredPrints.map((print) => (
                  <tr key={print.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{print.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(print.chargeDate).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(print.deliveryDate).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${print.amountCharged}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${print.actualCost}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      ${(print.amountCharged - print.actualCost).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(print)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar esta impresión?')) {
                              deletePrint(print.id);
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
        <PrintModal
          print={editingPrint}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPrint(null);
          }}
          onSave={(printData) => {
            if (editingPrint) {
              updatePrint(editingPrint.id, printData);
            } else {
              addPrint(printData);
            }
            setIsModalOpen(false);
            setEditingPrint(null);
          }}
        />
      )}
    </div>
  );
}

interface PrintModalProps {
  print: Print | null;
  onClose: () => void;
  onSave: (print: Omit<Print, 'id' | 'createdAt'>) => void;
}

function PrintModal({ print, onClose, onSave }: PrintModalProps) {
  const [formData, setFormData] = useState({
    clientName: print?.clientName || '',
    chargeDate: print?.chargeDate || new Date().toISOString().split('T')[0],
    deliveryDate: print?.deliveryDate || new Date().toISOString().split('T')[0],
    amountCharged: print?.amountCharged || 0,
    actualCost: print?.actualCost || 0,
    status: print?.status || 'pagada' as PrintStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {print ? 'Editar Impresión' : 'Nueva Impresión'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Cobro
              </label>
              <input
                type="date"
                required
                value={formData.chargeDate}
                onChange={(e) => setFormData({ ...formData, chargeDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrega
              </label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Cobrado ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amountCharged}
                onChange={(e) => setFormData({ ...formData, amountCharged: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo Real ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.actualCost}
                onChange={(e) => setFormData({ ...formData, actualCost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PrintStatus })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="pagada">✅ Pagada</option>
              <option value="entregada">✅ Entregada</option>
            </select>
          </div>

          {formData.amountCharged > 0 && formData.actualCost > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ganancia estimada:</p>
              <p className="text-2xl font-bold text-green-600">
                ${(formData.amountCharged - formData.actualCost).toFixed(2)}
              </p>
            </div>
          )}

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
              {print ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
