import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppData, Session, Print, Worker, WeeklySalary, Expense, Debt } from '../types';

interface DataContextType {
  data: AppData;
  addSession: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  addPrint: (print: Omit<Print, 'id' | 'createdAt'>) => void;
  updatePrint: (id: string, print: Partial<Print>) => void;
  deletePrint: (id: string) => void;
  addWorker: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  addWeeklySalary: (salary: Omit<WeeklySalary, 'id' | 'createdAt'>) => void;
  updateWeeklySalary: (id: string, salary: Partial<WeeklySalary>) => void;
  deleteWeeklySalary: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: string, debt: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'snapbooks_data';

const initialData: AppData = {
  sessions: [],
  prints: [],
  workers: [],
  weeklySalaries: [],
  expenses: [],
  debts: [],
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Sessions
  const addSession = (session: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...session,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, sessions: [...prev.sessions, newSession] }));
  };

  const updateSession = (id: string, session: Partial<Session>) => {
    setData(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === id ? { ...s, ...session } : s),
    }));
  };

  const deleteSession = (id: string) => {
    setData(prev => ({
      ...prev,
      sessions: prev.sessions.filter(s => s.id !== id),
    }));
  };

  // Prints
  const addPrint = (print: Omit<Print, 'id' | 'createdAt'>) => {
    const newPrint: Print = {
      ...print,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, prints: [...prev.prints, newPrint] }));
  };

  const updatePrint = (id: string, print: Partial<Print>) => {
    setData(prev => ({
      ...prev,
      prints: prev.prints.map(p => p.id === id ? { ...p, ...print } : p),
    }));
  };

  const deletePrint = (id: string) => {
    setData(prev => ({
      ...prev,
      prints: prev.prints.filter(p => p.id !== id),
    }));
  };

  // Workers
  const addWorker = (worker: Omit<Worker, 'id' | 'createdAt'>) => {
    const newWorker: Worker = {
      ...worker,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, workers: [...prev.workers, newWorker] }));
  };

  const updateWorker = (id: string, worker: Partial<Worker>) => {
    setData(prev => ({
      ...prev,
      workers: prev.workers.map(w => w.id === id ? { ...w, ...worker } : w),
    }));
  };

  const deleteWorker = (id: string) => {
    setData(prev => ({
      ...prev,
      workers: prev.workers.filter(w => w.id !== id),
    }));
  };

  // Weekly Salaries
  const addWeeklySalary = (salary: Omit<WeeklySalary, 'id' | 'createdAt'>) => {
    const newSalary: WeeklySalary = {
      ...salary,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, weeklySalaries: [...prev.weeklySalaries, newSalary] }));
  };

  const updateWeeklySalary = (id: string, salary: Partial<WeeklySalary>) => {
    setData(prev => ({
      ...prev,
      weeklySalaries: prev.weeklySalaries.map(s => s.id === id ? { ...s, ...salary } : s),
    }));
  };

  const deleteWeeklySalary = (id: string) => {
    setData(prev => ({
      ...prev,
      weeklySalaries: prev.weeklySalaries.filter(s => s.id !== id),
    }));
  };

  // Expenses
  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...expense } : e),
    }));
  };

  const deleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  };

  // Debts
  const addDebt = (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debt,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, debts: [...prev.debts, newDebt] }));
  };

  const updateDebt = (id: string, debt: Partial<Debt>) => {
    setData(prev => ({
      ...prev,
      debts: prev.debts.map(d => d.id === id ? { ...d, ...debt } : d),
    }));
  };

  const deleteDebt = (id: string) => {
    setData(prev => ({
      ...prev,
      debts: prev.debts.filter(d => d.id !== id),
    }));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        addSession,
        updateSession,
        deleteSession,
        addPrint,
        updatePrint,
        deletePrint,
        addWorker,
        updateWorker,
        deleteWorker,
        addWeeklySalary,
        updateWeeklySalary,
        deleteWeeklySalary,
        addExpense,
        updateExpense,
        deleteExpense,
        addDebt,
        updateDebt,
        deleteDebt,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
