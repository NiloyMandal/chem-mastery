'use client';


import { AlertCircle, CreditCard, Send, CheckCircle2 } from 'lucide-react';

interface Payment {
    id: string;
    studentName: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'overdue' | 'pending';
}

const PAYMENTS: Payment[] = [
    { id: '1', studentName: 'Charlie Davis', amount: 150, dueDate: '2023-11-01', status: 'overdue' },
    { id: '2', studentName: 'Dana Scully', amount: 150, dueDate: '2023-11-05', status: 'overdue' },
    { id: '3', studentName: 'Fox Mulder', amount: 150, dueDate: '2023-11-15', status: 'pending' },
    { id: '4', studentName: 'Walter White', amount: 500, dueDate: '2023-10-20', status: 'paid' },
];

export default function FeeManager() {
    const overduePayments = PAYMENTS.filter(p => p.status === 'overdue');

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-red-50/50">
                <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Fee Management: Overdue
                </h2>
            </div>

            <div className="p-4 flex-1 overflow-auto">
                {overduePayments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <CheckCircle2 className="w-12 h-12 mb-2 text-green-500" />
                        <p>All clear! No overdue payments.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {overduePayments.map((payment) => (
                            <div key={payment.id} className="p-4 border border-red-100 bg-red-50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-800">{payment.studentName}</h3>
                                    <p className="text-sm text-red-600 font-medium">Due: ${payment.amount}</p>
                                    <p className="text-xs text-slate-500">Deadline: {payment.dueDate}</p>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
                                        <Send className="w-3 h-3" /> Remind
                                    </button>
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow-sm transition-colors">
                                        <CreditCard className="w-3 h-3" /> Mark Paid
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <button className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
                    View All Transactions
                </button>
            </div>
        </div>
    );
}
