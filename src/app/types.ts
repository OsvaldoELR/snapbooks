// Types for SnapBooks

export type SessionStatus = 'pendiente' | 'realizada' | 'entregada';
export type PrintStatus = 'pagada' | 'entregada';
export type PaymentType = 'salario_semanal' | 'por_sesion' | 'por_foto' | 'comision_cliente';
export type ExpenseType = 'decoracion' | 'gasolina' | 'impresion' | 'maquillaje' | 'ropa' | 'props' | 'otros';

export interface Session {
  id: string;
  clientName: string;
  date: string;
  sessionType: string;
  price: number;
  includesPrint: boolean;
  photoCount: number;
  photographer: string;
  decorationCost: number;
  notes: string;
  status: SessionStatus;
  createdAt: string;
}

export interface Print {
  id: string;
  clientName: string;
  chargeDate: string;
  deliveryDate: string;
  amountCharged: number;
  actualCost: number;
  status: PrintStatus;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  paymentType: PaymentType;
  amount: number; // weekly salary or per unit amount
  createdAt: string;
}

export interface WeeklySalary {
  id: string;
  workerId: string;
  workerName: string;
  weekStart: string;
  weekEnd: string;
  fixedSalary: number;
  generatedAmount: number;
  paid: boolean;
  paidDate?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  type: ExpenseType;
  amount: number;
  sessionId?: string;
  paidBy: string;
  notes: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  reason: string;
  date: string;
  paid: boolean;
  paidDate?: string;
  createdAt: string;
}

export interface AppData {
  sessions: Session[];
  prints: Print[];
  workers: Worker[];
  weeklySalaries: WeeklySalary[];
  expenses: Expense[];
  debts: Debt[];
}
