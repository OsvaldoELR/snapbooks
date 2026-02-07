import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import type { Debt } from '../types';

export default function Debts() {
  const { data, addDebt, updateDebt } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTogglePaid = (debt: Debt) => {
    updateDebt(debt.id, {
      paid: !debt.paid,
      paidDate: !debt.paid ? new Date().toISOString() : undefined,
    });
  };

  const activeDebts = data.debts.filter(d => !d.paid);
  const paidDebts = data.debts.filter(d => d.paid);

  const totalActiveDebt = activeDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Deudas</h1>
          <p className="text-gray-600 mt-1">
            Sistema tipo ledger para registrar y dar seguimiento a deudas
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Deuda
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
          <p className="text-sm font-medium mb-2 text-red-100">Total Adeudado</p>
          <p className="text-4xl font-bold">${totalActiveDebt.toFixed(2)}</p>
          <p className="text-sm mt-2 text-red-100">
            {activeDebts.length} deuda{activeDebts.length !== 1 ? 's' : ''} activa{activeDebts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Deudas Pagadas</p>
          <p className="text-3xl font-bold text-green-600">{paidDebts.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            ${paidDebts.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Total Deudas</p>
          <p className="text-3xl font-bold text-indigo-600">{data.debts.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            ${data.debts.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Active Debts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-red-50 px-6 py-3 border-b border-red-200">
          <h2 className="font-bold text-red-900">Deudas Activas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeDebts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay deudas activas
                  </td>
                </tr>
              ) : (
                activeDebts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((debt) => (
                    <tr key={debt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{debt.personName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-red-600">${debt.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{debt.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(debt.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleTogglePaid(debt)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Marcar Pagado
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paid Debts */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-green-200">
          <h2 className="font-bold text-green-900">Deudas Pagadas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Persona</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Deuda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paidDebts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay deudas pagadas
                  </td>
                </tr>
              ) : (
                paidDebts
                  .sort((a, b) => new Date(b.paidDate || '').getTime() - new Date(a.paidDate || '').getTime())
                  .map((debt) => (
                    <tr key={debt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{debt.personName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${debt.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{debt.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(debt.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {debt.paidDate && new Date(debt.paidDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleTogglePaid(debt)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-xs"
                        >
                          <Circle className="w-4 h-4" />
                          Marcar Pendiente
                        </button>
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
        <DebtModal
          onClose={() => setIsModalOpen(false)}
          onSave={(debtData) => {
            addDebt(debtData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

interface DebtModalProps {
  onClose: () => void;
  onSave: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
}

function DebtModal({ onClose, onSave }: DebtModalProps) {
  const [formData, setFormData] = useState({
    personName: '',
    amount: 0,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    paid: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Nueva Deuda</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Persona
            </label>
            <input
              type="text"
              required
              value={formData.personName}
              onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
              placeholder="Ej: Mai, Leysi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <input
              type="text"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ej: Impresión, Maquillaje"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              Esta deuda quedará registrada como activa hasta que la marques como pagada.
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
