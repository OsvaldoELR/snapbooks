import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { calculateMetrics, formatCurrency } from '../utils/calculations';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachWeekOfInterval, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Calendar, TrendingUp, Download } from 'lucide-react';

export default function Reports() {
  const { data } = useData();
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  
  const today = new Date();
  const metrics = calculateMetrics(data, today);

  // Weekly breakdown for current month
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const weeksInMonth = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  );

  const weeklyBreakdown = weeksInMonth.map(weekDate => {
    const weekMetrics = calculateMetrics(data, weekDate);
    return {
      weekStart: startOfWeek(weekDate, { weekStartsOn: 1 }),
      weekEnd: endOfWeek(weekDate, { weekStartsOn: 1 }),
      profit: weekMetrics.weeklyProfit,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tu estudio fotográfico
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewType === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setViewType('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewType === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Main Report Cards */}
      {viewType === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title="Total Sesiones"
            value={data.sessions.filter(s => {
              const weekStart = startOfWeek(today, { weekStartsOn: 1 });
              const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
              const sessionDate = new Date(s.date);
              return sessionDate >= weekStart && sessionDate <= weekEnd;
            }).length.toString()}
            icon={BarChart3}
            color="blue"
          />
          <ReportCard
            title="Total Gastos"
            value={formatCurrency(metrics.totalExpenses)}
            icon={TrendingUp}
            color="red"
          />
          <ReportCard
            title="Total Salarios"
            value={formatCurrency(metrics.totalSalaries)}
            icon={Calendar}
            color="purple"
          />
          <ReportCard
            title="Utilidad Semanal"
            value={formatCurrency(metrics.weeklyProfit)}
            icon={TrendingUp}
            color={metrics.weeklyProfit >= 0 ? 'green' : 'red'}
          />
        </div>
      )}

      {viewType === 'month' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title="Total Sesiones"
            value={data.sessions.filter(s => {
              const sessionDate = new Date(s.date);
              return sessionDate >= monthStart && sessionDate <= monthEnd;
            }).length.toString()}
            icon={BarChart3}
            color="blue"
          />
          <ReportCard
            title="Total Gastos"
            value={formatCurrency(metrics.totalExpenses)}
            icon={TrendingUp}
            color="red"
          />
          <ReportCard
            title="Total Salarios"
            value={formatCurrency(metrics.totalSalaries)}
            icon={Calendar}
            color="purple"
          />
          <ReportCard
            title="Utilidad Mensual"
            value={formatCurrency(metrics.monthlyProfit)}
            icon={TrendingUp}
            color={metrics.monthlyProfit >= 0 ? 'green' : 'red'}
          />
        </div>
      )}

      {/* Expected Bank Balance */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100 mb-2">Saldo Esperado en Cuenta Bancaria</p>
            <p className="text-5xl font-bold mb-2">{formatCurrency(metrics.expectedBankBalance)}</p>
            <p className="text-indigo-100">
              Esto es lo que debería haber en tu cuenta considerando todos los ingresos, gastos, salarios y costos de impresión.
            </p>
          </div>
          <Download className="w-8 h-8 text-indigo-200" />
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Desglose Financiero</h2>
        <div className="space-y-4">
          <FinancialRow
            label="Ingresos Totales Recibidos"
            amount={metrics.totalReceived}
            color="green"
          />
          <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
            <FinancialRow
              label="Ingresos de Sesiones Entregadas"
              amount={data.sessions.filter(s => s.status === 'entregada').reduce((sum, s) => sum + s.price, 0)}
              color="green"
              small
            />
            <FinancialRow
              label="Ingresos de Impresiones Entregadas"
              amount={data.prints.filter(p => p.status === 'entregada').reduce((sum, p) => sum + p.amountCharged, 0)}
              color="green"
              small
            />
          </div>
          
          <FinancialRow
            label="Total Gastos Operativos"
            amount={metrics.totalExpenses}
            color="red"
          />
          
          <FinancialRow
            label="Total Salarios Pagados"
            amount={metrics.totalSalaries}
            color="red"
          />
          
          <FinancialRow
            label="Costos de Impresión"
            amount={data.prints.filter(p => p.status === 'entregada').reduce((sum, p) => sum + p.actualCost, 0)}
            color="red"
          />

          <div className="border-t-2 border-gray-300 pt-4 mt-4">
            <FinancialRow
              label="Utilidad Real del Negocio"
              amount={metrics.realProfit}
              color={metrics.realProfit >= 0 ? 'green' : 'red'}
              bold
            />
          </div>

          <FinancialRow
            label="Reserva de Impresiones Pendientes"
            amount={metrics.printReserve}
            color="orange"
          />
        </div>
      </div>

      {/* Weekly Comparison */}
      {viewType === 'month' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Comparativo Semanal del Mes</h2>
          <div className="space-y-3">
            {weeklyBreakdown.map((week, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-48">
                  <p className="text-sm font-medium text-gray-700">
                    {format(week.weekStart, 'dd MMM', { locale: es })} - {format(week.weekEnd, 'dd MMM', { locale: es })}
                  </p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full ${week.profit >= 0 ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-end pr-3`}
                    style={{
                      width: `${Math.min(100, Math.abs(week.profit) / 1000 * 100)}%`,
                    }}
                  >
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(week.profit)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance by Photographer */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Rendimiento por Fotógrafa</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fotógrafa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sesiones</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entregadas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from(new Set(data.sessions.map(s => s.photographer))).map(photographer => {
                const photographerSessions = data.sessions.filter(s => s.photographer === photographer);
                const deliveredSessions = photographerSessions.filter(s => s.status === 'entregada');
                const revenue = deliveredSessions.reduce((sum, s) => sum + s.price, 0);
                
                return (
                  <tr key={photographer} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{photographer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{photographerSessions.length}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{deliveredSessions.length}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface ReportCardProps {
  title: string;
  value: string;
  icon: any;
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange';
}

function ReportCard({ title, value, icon: Icon, color }: ReportCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}

interface FinancialRowProps {
  label: string;
  amount: number;
  color: 'green' | 'red' | 'orange';
  small?: boolean;
  bold?: boolean;
}

function FinancialRow({ label, amount, color, small, bold }: FinancialRowProps) {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="flex items-center justify-between">
      <span className={`${small ? 'text-sm' : 'text-base'} ${bold ? 'font-bold' : ''} text-gray-700`}>
        {label}
      </span>
      <span className={`${small ? 'text-sm' : 'text-lg'} ${bold ? 'font-bold' : 'font-medium'} ${colorClasses[color]}`}>
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
