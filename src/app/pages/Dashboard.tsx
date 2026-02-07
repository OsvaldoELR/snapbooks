import { useData } from '../contexts/DataContext';
import { calculateMetrics, formatCurrency } from '../utils/calculations';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Printer, 
  Banknote,
  Calendar,
  CalendarDays
} from 'lucide-react';

export default function Dashboard() {
  const { data } = useData();
  const metrics = calculateMetrics(data);

  const statCards = [
    {
      title: 'Dinero Total Recibido',
      value: formatCurrency(metrics.totalReceived),
      icon: Wallet,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      title: 'Total Gastos',
      value: formatCurrency(metrics.totalExpenses),
      icon: TrendingDown,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    {
      title: 'Total Salarios Pagados',
      value: formatCurrency(metrics.totalSalaries),
      icon: DollarSign,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      bgLight: 'bg-cyan-50',
    },
    {
      title: 'Reserva de Impresiones',
      value: formatCurrency(metrics.printReserve),
      icon: Printer,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Utilidad Real del Negocio',
      value: formatCurrency(metrics.realProfit),
      icon: TrendingUp,
      color: metrics.realProfit >= 0 ? 'bg-green-500' : 'bg-red-500',
      textColor: metrics.realProfit >= 0 ? 'text-green-600' : 'text-red-600',
      bgLight: metrics.realProfit >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Saldo Esperado en Cuenta',
      value: formatCurrency(metrics.expectedBankBalance),
      icon: Banknote,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
  ];

  const periodStats = [
    {
      title: 'Ganancia Semanal',
      value: formatCurrency(metrics.weeklyProfit),
      icon: Calendar,
      positive: metrics.weeklyProfit >= 0,
    },
    {
      title: 'Ganancia Mensual',
      value: formatCurrency(metrics.monthlyProfit),
      icon: CalendarDays,
      positive: metrics.monthlyProfit >= 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Vista general de tu estudio fotográfico</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-2">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Period Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {periodStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 border border-slate-200 ${
              stat.positive ? 'border-l-green-500' : 'border-l-red-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  stat.positive ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p
                  className={`text-2xl font-bold ${
                    stat.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Estadísticas Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-600 mb-1">Sesiones Totales</p>
            <p className="text-2xl font-bold text-slate-900">{data.sessions.length}</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-700 mb-1">Sesiones Entregadas</p>
            <p className="text-2xl font-bold text-emerald-600">
              {data.sessions.filter(s => s.status === 'entregada').length}
            </p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-700 mb-1">Impresiones Pendientes</p>
            <p className="text-2xl font-bold text-amber-600">
              {data.prints.filter(p => p.status === 'pagada').length}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-700 mb-1">Deudas Activas</p>
            <p className="text-2xl font-bold text-red-600">
              {data.debts.filter(d => !d.paid).length}
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl shadow-sm p-6 text-white border border-slate-200">
        <h3 className="text-lg font-bold mb-2">Filosofía SnapBooks</h3>
        <p className="text-slate-200 leading-relaxed">
          Este sistema separa dinero cobrado vs dinero ganado. Solo cuenta como ganancia
          lo que ya fue entregado al cliente. Primero se pagan costos y salarios,
          luego se calcula la utilidad real. Las impresiones pendientes van a reserva
          hasta que se entreguen.
        </p>
      </div>
    </div>
  );
}
