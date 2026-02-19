'use client';


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const DATA = [
    { name: 'Jan', score: 65, avg: 70 },
    { name: 'Feb', score: 72, avg: 72 },
    { name: 'Mar', score: 68, avg: 75 },
    { name: 'Apr', score: 85, avg: 78 },
    { name: 'May', score: 82, avg: 80 },
    { name: 'Jun', score: 92, avg: 82 },
];

export default function ProgressChart() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Academic Progress
                    </h2>
                    <p className="text-sm text-slate-500">Test scores over the last 6 months</p>
                </div>
            </div>

            <div className="p-4 flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={DATA}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="score" name="Student Score" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="avg" name="Class Average" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
