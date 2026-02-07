import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import type { Expense, ExpenseType } from '../types';

export default function Expenses() {
  const { data, addExpense, updateExpense, deleteExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterType, setFilterType] = useState<ExpenseType | 'all'>('all');

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const filteredExpenses = filterType === 'all' 
    ? data.expenses 
    : data.expenses.filter(e => e.type === filterType);

  const getExpenseTypeLabel = (type: ExpenseType) => {
    const labels: Record<ExpenseType, string> = {
      decoracion: 'Decoración',
      gasolina: 'Gasolina',
      impresion: 'Impresión',
      maquillaje: 'Maquillaje',
      ropa: 'Ropa',
      props: 'Props',
      otros: 'Otros',
    };
    return labels[type];
  };

  const getTypeColor = (type: ExpenseType) => {
    const colors: Record<ExpenseType, string> = {
      decoracion: 'bg-purple-100 text-purple-800',
      gasolina: 'bg-blue-100 text-blue-800',
      impresion: 'bg-green-100 text-green-800',
      maquillaje: 'bg-pink-100 text-pink-800',
      ropa: 'bg-indigo-100 text-indigo-800',
      props: 'bg-yellow-100 text-yellow-800',
      otros: 'bg-gray-100 text-gray-800',
    };
    return colors[type];
  };

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registro de Gastos</h1>
          <p className="text-gray-600 mt-1">
            Controla todos los gastos operativos
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Gasto
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <p className="text-sm font-medium mb-2">Total de Gastos</p>
        <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
        <p className="text-sm mt-2 text-red-100">
          {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''} registrado{filteredExpenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {(['decoracion', 'gasolina', 'impresion', 'maquillaje', 'ropa', 'props', 'otros'] as ExpenseType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filterType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getExpenseTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pagado Por</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay gastos registrados
                  </td>
                </tr>
              ) : (
                filteredExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(expense.type)}`}>
                          {getExpenseTypeLabel(expense.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.paidBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.notes || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Estás seguro de eliminar este gasto?')) {
                                deleteExpense(expense.id);
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
        <ExpenseModal
          expense={editingExpense}
          sessions={data.sessions}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={(expenseData) => {
            if (editingExpense) {
              updateExpense(editingExpense.id, expenseData);
            } else {
              addExpense(expenseData);
            }
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}

interface ExpenseModalProps {
  expense: Expense | null;
  sessions: any[];
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

function ExpenseModal({ expense, sessions, onClose, onSave }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    date: expense?.date || new Date().toISOString().split('T')[0],
    type: expense?.type || 'otros' as ExpenseType,
    amount: expense?.amount || 0,
    sessionId: expense?.sessionId || '',
    paidBy: expense?.paidBy || '',
    notes: expense?.notes || '',
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
            {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExpenseType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="decoracion">Decoración</option>
                <option value="gasolina">Gasolina</option>
                <option value="impresion">Impresión</option>
                <option value="maquillaje">Maquillaje</option>
                <option value="ropa">Ropa</option>
                <option value="props">Props</option>
                <option value="otros">Otros</option>
              </select>
            </div>
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
                Pagado Por
              </label>
              <input
                type="text"
                required
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                placeholder="Nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sesión Relacionada (Opcional)
            </label>
            <select
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Ninguna</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.clientName} - {session.sessionType} ({new Date(session.date).toLocaleDateString('es-ES')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Detalles adicionales..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
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
              {expense ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
