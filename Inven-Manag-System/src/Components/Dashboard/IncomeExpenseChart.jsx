import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { format, subDays, addDays } from 'date-fns';

// Generate sample data for income and expenses
const lastDay = new Date();
const lastMonthDays = Array.from({ length: 30 }, (_, i) => subDays(lastDay, i));

const generateSampleData = () => {
    return lastMonthDays.map(date => ({
        date: date.getTime(),
        income: Math.floor(Math.random() * 1000) + 100, // Random income between 100 and 1100
        expense: Math.floor(Math.random() * 500) + 50,  // Random expense between 50 and 550
    }));
};

const sampleData = generateSampleData();

const dateFormatter = (date) => new Date(date).toLocaleDateString();

const IncomeExpenseChart = () => {
    return (
        <Card>
            <CardHeader title="Monthly Income and Expenses" />
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={sampleData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f44336" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f44336" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                name="Date"
                                type="number"
                                scale="time"
                                domain={[
                                    addDays(subDays(new Date(), 30), 1).getTime(),
                                    new Date().getTime(),
                                ]}
                                tickFormatter={dateFormatter}
                            />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                formatter={(value) =>
                                    new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'ETB',
                                    }).format(value)
                                }
                                labelFormatter={(label) => dateFormatter(label)}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#4caf50"
                                strokeWidth={2}
                                fill="url(#colorIncome)"
                                name="Income"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#f44336"
                                strokeWidth={2}
                                fill="url(#colorExpense)"
                                name="Expense"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default IncomeExpenseChart;
