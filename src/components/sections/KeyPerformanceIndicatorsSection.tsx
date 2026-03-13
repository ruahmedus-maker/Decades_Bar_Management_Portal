'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { brandFont, sectionHeaderStyle, cardHeaderStyle, uiBackground, uiBackdropFilter, uiBackdropFilterWebkit, premiumWhiteStyle, premiumBodyStyle } from '@/lib/brand-styles';
import { supabase } from '@/lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

interface MonthlyPerformance {
    id: string;
    employee_id: string;
    employee_name: string;
    month: string;
    sales: number;
    check_average: number;
    punctuality_score: number;
    shifts_worked: number;
    created_at: string;
    [key: string]: any;
}

const CHART_COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', 'rgba(255,255,255,0.4)'];

export default function KeyPerformanceIndicatorsSection() {
    const { currentUser, showToast } = useApp();
    const [data, setData] = useState<MonthlyPerformance[]>([]);
    const [loading, setLoading] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser, selectedMonth]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: performanceData, error } = await supabase
                .from('monthly_performance')
                .select('*')
                .eq('month', selectedMonth)
                .order('sales', { ascending: false });

            if (error) throw error;
            setData(performanceData || []);
        } catch (error) {
            console.error('Error loading KPI data:', error);
            showToast('Error loading performance data');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const updates = [];

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const [name, salesStr, checksStr, hoursStr, latesStr] = line.split(',');
                    if (!name) continue;

                    const { data: user } = await supabase
                        .from('users')
                        .select('id')
                        .ilike('name', name.trim())
                        .maybeSingle();

                    if (user) {
                        const sales = parseFloat(salesStr) || 0;
                        const checks = parseFloat(checksStr) || 1;
                        const hours = parseFloat(hoursStr) || 0;
                        const lates = parseInt(latesStr) || 0;
                        const checkAvg = checks > 0 ? (sales / checks) : 0;
                        const punctuality = Math.max(0, 100 - (lates * 10));

                        updates.push({
                            employee_id: user.id,
                            employee_name: name.trim(),
                            month: selectedMonth,
                            sales,
                            check_average: checkAvg,
                            punctuality_score: punctuality,
                            shifts_worked: Math.round(hours / 6),
                            late_count: lates
                        });
                    }
                }

                if (updates.length > 0) {
                    const { error: insertError } = await supabase
                        .from('monthly_performance')
                        .insert(updates);

                    if (insertError) throw insertError;
                    showToast(`Successfully imported ${updates.length} records.`);
                    setShowImportModal(false);
                    loadData();
                } else {
                    showToast('No matching employees found in CSV.');
                }
            } catch (error) {
                console.error('Import error:', error);
                showToast('Error parsing file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div
            style={{
                background: uiBackground,
                backdropFilter: uiBackdropFilter,
                WebkitBackdropFilter: uiBackdropFilterWebkit,
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div>
                    <h3 style={{ ...sectionHeaderStyle, ...premiumWhiteStyle, letterSpacing: '4px' }}>
                        Performance KPIs
                    </h3>
                    <p style={{ ...premiumBodyStyle, margin: '4px 0 0 0', fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.7 }}>
                        Metrics for {selectedMonth}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '30px',
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            fontWeight: 300
                        }}
                    />
                    {currentUser?.position === 'Admin' && (
                        <button
                            onClick={() => setShowImportModal(true)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: '8px 18px',
                                borderRadius: '30px',
                                color: 'white',
                                fontSize: '0.85rem',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                fontWeight: 300
                            }}
                        >
                            Import Cloud Data
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div style={{ ...premiumBodyStyle, textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>Syncing analytics...</div>
            ) : (
                <>
                    {/* Top Performers Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '12px' }}>
                                Highest Sales
                            </h4>
                            <p style={{ ...premiumWhiteStyle, fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>
                                {data.length > 0 ? data[0].employee_name : 'No Data'}
                            </p>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 300 }}>
                                ${data.length > 0 ? data[0].sales.toLocaleString() : 0}
                            </span>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '12px' }}>
                                Top Check Avg
                            </h4>
                            <p style={{ ...premiumWhiteStyle, fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>
                                {data.length > 0 ? [...data].sort((a, b) => b.check_average - a.check_average)[0].employee_name : 'No Data'}
                            </p>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 300 }}>
                                ${data.length > 0 ? [...data].sort((a, b) => b.check_average - a.check_average)[0].check_average.toFixed(2) : 0}
                            </span>
                        </div>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', marginBottom: '12px' }}>
                                Attendance Pct
                            </h4>
                            <p style={{ ...premiumWhiteStyle, fontSize: '1.5rem', fontWeight: 300, margin: 0 }}>
                                {data.length > 0 ? [...data].sort((a, b) => b.punctuality_score - a.punctuality_score)[0].employee_name : 'No Data'}
                            </p>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 300 }}>
                                {data.length > 0 ? [...data].sort((a, b) => b.punctuality_score - a.punctuality_score)[0].punctuality_score : 100}%
                            </span>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px', height: '350px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>Revenue Distribution</h4>
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="sales"
                                        nameKey="employee_name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        innerRadius={60}
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <h4 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>Average Order Value</h4>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.05} vertical={false} />
                                    <XAxis dataKey="employee_name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    />
                                    <Bar dataKey="check_average" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ranking Table */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', textAlign: 'left', color: 'white', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.5)' }}>
                                <tr>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px' }}>Rank</th>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px' }}>Bartender</th>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Revenue</th>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>AOV</th>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Attendance</th>
                                    <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Vols</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '0.9rem', fontWeight: 300 }}>
                                {data.map((row, index) => (
                                    <tr key={row.id} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <td style={{ padding: '15px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>#{index + 1}</td>
                                        <td style={{ padding: '15px 20px' }}>{row.employee_name}</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>${row.sales.toLocaleString()}</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>${row.check_average.toFixed(2)}</td>
                                        <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }}>
                                                {row.punctuality_score}%
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>{row.shifts_worked}</td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '60px', textAlign: 'center', opacity: 0.5, ...premiumBodyStyle }}>
                                            Performance database is empty for this period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyCenter: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '24px',
                        padding: '32px',
                        maxWidth: '450px',
                        width: '100%',
                        margin: 'auto'
                    }}>
                        <h3 style={{ ...cardHeaderStyle, ...premiumWhiteStyle, letterSpacing: '2px', marginBottom: '10px' }}>Import Cloud Dataset</h3>
                        <p style={{ ...premiumBodyStyle, fontSize: '0.85rem', marginBottom: '24px', opacity: 0.7 }}>
                            Please upload the standardized XLSX/CSV export from Aloha Manager or your labor tracking system.
                        </p>

                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '20px',
                                color: 'white',
                                marginBottom: '20px'
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button
                                onClick={() => setShowImportModal(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
