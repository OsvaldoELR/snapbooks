import type { AppData } from '../types';
import { startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

export interface Metrics {
  totalReceived: number;
  totalExpenses: number;
  totalSalaries: number;
  printReserve: number;
  realProfit: number;
  expectedBankBalance: number;
  weeklyProfit: number;
  monthlyProfit: number;
  deliveredRevenue: number;
}

export function calculateMetrics(data: AppData, referenceDate = new Date()): Metrics {
  // Delivered revenue = sessions delivered + prints delivered
  const deliveredRevenue = data.sessions
    .filter(s => s.status === 'entregada')
    .reduce((sum, s) => sum + s.price, 0);

  const deliveredPrintsRevenue = data.prints
    .filter(p => p.status === 'entregada')
    .reduce((sum, p) => sum + p.amountCharged, 0);

  const totalDeliveredRevenue = deliveredRevenue + deliveredPrintsRevenue;

  // Total received (all money collected, regardless of delivery)
  const totalSessionRevenue = data.sessions.reduce((sum, s) => sum + s.price, 0);
  const totalPrintRevenue = data.prints.reduce((sum, p) => sum + p.amountCharged, 0);
  const totalReceived = totalSessionRevenue + totalPrintRevenue;

  // Print reserve = prints paid but not delivered
  const printReserve = data.prints
    .filter(p => p.status === 'pagada')
    .reduce((sum, p) => sum + (p.amountCharged - p.actualCost), 0);

  // Total expenses
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);

  // Total salaries (from weekly salaries table)
  const totalSalaries = data.weeklySalaries
    .filter(s => s.paid)
    .reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0);

  // Real profit = delivered revenue - expenses - salaries - print costs
  const printCosts = data.prints
    .filter(p => p.status === 'entregada')
    .reduce((sum, p) => sum + p.actualCost, 0);

  const realProfit = totalDeliveredRevenue - totalExpenses - totalSalaries - printCosts;

  // Expected bank balance = total received - expenses - salaries - print costs
  const allPrintCosts = data.prints.reduce((sum, p) => sum + p.actualCost, 0);
  const expectedBankBalance = totalReceived - totalExpenses - totalSalaries - allPrintCosts;

  // Weekly profit
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  
  const weeklyDeliveredSessions = data.sessions
    .filter(s => s.status === 'entregada' && isWithinInterval(new Date(s.date), { start: weekStart, end: weekEnd }))
    .reduce((sum, s) => sum + s.price, 0);

  const weeklyDeliveredPrints = data.prints
    .filter(p => p.status === 'entregada' && p.deliveryDate && isWithinInterval(new Date(p.deliveryDate), { start: weekStart, end: weekEnd }))
    .reduce((sum, p) => sum + p.amountCharged, 0);

  const weeklyExpenses = data.expenses
    .filter(e => isWithinInterval(new Date(e.date), { start: weekStart, end: weekEnd }))
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklySalaries = data.weeklySalaries
    .filter(s => s.paid && isWithinInterval(new Date(s.weekStart), { start: weekStart, end: weekEnd }))
    .reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0);

  const weeklyPrintCosts = data.prints
    .filter(p => p.status === 'entregada' && p.deliveryDate && isWithinInterval(new Date(p.deliveryDate), { start: weekStart, end: weekEnd }))
    .reduce((sum, p) => sum + p.actualCost, 0);

  const weeklyProfit = (weeklyDeliveredSessions + weeklyDeliveredPrints) - weeklyExpenses - weeklySalaries - weeklyPrintCosts;

  // Monthly profit
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  
  const monthlyDeliveredSessions = data.sessions
    .filter(s => s.status === 'entregada' && isWithinInterval(new Date(s.date), { start: monthStart, end: monthEnd }))
    .reduce((sum, s) => sum + s.price, 0);

  const monthlyDeliveredPrints = data.prints
    .filter(p => p.status === 'entregada' && p.deliveryDate && isWithinInterval(new Date(p.deliveryDate), { start: monthStart, end: monthEnd }))
    .reduce((sum, p) => sum + p.amountCharged, 0);

  const monthlyExpenses = data.expenses
    .filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }))
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlySalaries = data.weeklySalaries
    .filter(s => s.paid && isWithinInterval(new Date(s.weekStart), { start: monthStart, end: monthEnd }))
    .reduce((sum, s) => sum + s.fixedSalary + s.generatedAmount, 0);

  const monthlyPrintCosts = data.prints
    .filter(p => p.status === 'entregada' && p.deliveryDate && isWithinInterval(new Date(p.deliveryDate), { start: monthStart, end: monthEnd }))
    .reduce((sum, p) => sum + p.actualCost, 0);

  const monthlyProfit = (monthlyDeliveredSessions + monthlyDeliveredPrints) - monthlyExpenses - monthlySalaries - monthlyPrintCosts;

  return {
    totalReceived,
    totalExpenses,
    totalSalaries,
    printReserve,
    realProfit,
    expectedBankBalance,
    weeklyProfit,
    monthlyProfit,
    deliveredRevenue: totalDeliveredRevenue,
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
