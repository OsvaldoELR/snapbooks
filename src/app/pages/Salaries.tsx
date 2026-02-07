import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import type { WeeklySalary } from '../types';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Salaries() {
  const { data, addWeeklySalary, updateWeeklySalary } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTogglePaid = (salary: WeeklySalary) => {
    updateWeeklySalary(salary.id, {
      paid: !salary.paid,
      paidDate: !salary.paid ? new Date().toISOString() : undefined,
    });
  };

  const pendingSalaries = data.weeklySalaries.filter(s => !s.paid);
  const paidSalaries = data.weeklySalaries.filter(s => s.paid);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salarios Semanales</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los pagos semanales de tu equipo
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Registrar Salario
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Pendientes de Pago</p>
          <p className="text-3xl font-bold text-orange-600">{pendingSalaries.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            ${pendingSalaries.reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Pagados Esta Semana</p>
          <p className="text-3xl font-bold text-green-600">{paidSalaries.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            ${paidSalaries.reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Total Salarios</p>
          <p className="text-3xl font-bold text-indigo-600">{data.weeklySalaries.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            ${data.weeklySalaries.reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Pending Salaries */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-orange-50 px-6 py-3 border-b border-orange-200">
          <h2 className="font-bold text-orange-900">Pendientes de Pago</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salario Fijo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingSalaries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay salarios pendientes
                  </td>
                </tr>
              ) : (
                pendingSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{salary.workerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(salary.weekStart), 'dd MMM', { locale: es })} - {format(new Date(salary.weekEnd), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.fixedSalary.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.generatedAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${(salary.fixedSalary + salary.generatedAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleTogglePaid(salary)}
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

      {/* Paid Salaries */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-green-50 px-6 py-3 border-b border-green-200">
          <h2 className="font-bold text-green-900">Pagados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salario Fijo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paidSalaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No hay salarios pagados
                  </td>
                </tr>
              ) : (
                paidSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{salary.workerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(salary.weekStart), 'dd MMM', { locale: es })} - {format(new Date(salary.weekEnd), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.fixedSalary.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${salary.generatedAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${(salary.fixedSalary + salary.generatedAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {salary.paidDate && format(new Date(salary.paidDate), 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleTogglePaid(salary)}
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
        <SalaryModal
          workers={data.workers}
          onClose={() => setIsModalOpen(false)}
          onSave={(salaryData) => {
            addWeeklySalary(salaryData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

interface SalaryModalProps {
  workers: any[];
  onClose: () => void;
  onSave: (salary: Omit<WeeklySalary, 'id' | 'createdAt'>) => void;
}

function SalaryModal({ workers, onClose, onSave }: SalaryModalProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const [formData, setFormData] = useState({
    workerId: '',
    workerName: '',
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
    fixedSalary: 0,
    generatedAmount: 0,
    paid: false,
  });

  const handleWorkerChange = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (worker) {
      setFormData({
        ...formData,
        workerId,
        workerName: worker.name,
        fixedSalary: worker.paymentType === 'salario_semanal' ? worker.amount : 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workerId) {
      alert('Por favor selecciona un trabajador');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Salario Semanal</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trabajador
            </label>
            <select
              required
              value={formData.workerId}
              onChange={(e) => handleWorkerChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Seleccionar trabajador...</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} - {worker.role}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inicio de Semana
              </label>
              <input
                type="date"
                required
                value={formData.weekStart}
                onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin de Semana
              </label>
              <input
                type="date"
                required
                value={formData.weekEnd}
                onChange={(e) => setFormData({ ...formData, weekEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salario Fijo ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.fixedSalary}
                onChange={(e) => setFormData({ ...formData, fixedSalary: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Generado ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.generatedAmount}
                onChange={(e) => setFormData({ ...formData, generatedAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium mb-1">Total a Pagar</p>
            <p className="text-2xl font-bold text-indigo-900">
              ${(formData.fixedSalary + formData.generatedAmount).toFixed(2)}
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
