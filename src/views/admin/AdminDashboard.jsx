/* src/views/admin/AdminDashboard.jsx */
import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ cars: 0, rentals: 0, revenue: 0, users: 0 });
    const [analytics, setAnalytics] = useState({
        monthly_revenue: [],
        top_cars: [],
        rental_status: [],
        profitable_cars: []
    });
    const [loading, setLoading] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        year: new Date().getFullYear(), // Default to current year
        month: ''
    });

    useEffect(() => {
        getStats();
    }, []);

    const getStats = (currentFilters = filters) => {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (currentFilters.from && currentFilters.to) {
            params.append('from', currentFilters.from);
            params.append('to', currentFilters.to);
        } else if (currentFilters.year) {
            params.append('year', currentFilters.year);
            if (currentFilters.month) {
                params.append('month', currentFilters.month);
            }
        }

        axiosClient.get(`/admin/stats?${params.toString()}`)
            .then(({ data }) => {
                setStats({
                    cars: data.total_cars,
                    rentals: data.total_rentals,
                    revenue: Number(data.total_revenue),
                    users: data.total_users
                });
                setAnalytics(data.analytics || {
                    monthly_revenue: [],
                    top_cars: [],
                    rental_status: [],
                    profitable_cars: []
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        getStats();
    };

    const resetFilters = () => {
        const reset = { from: '', to: '', year: new Date().getFullYear(), month: '' };
        setFilters(reset);
        getStats(reset);
    };

    // --- Chart Data Preparation ---

    // 1. Monthly Revenue (Line Chart)
    const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueDataPoints = new Array(12).fill(0);
    analytics.monthly_revenue.forEach(item => {
        revenueDataPoints[item.month - 1] = item.total;
    });

    const revenueChartData = {
        labels: revenueLabels,
        datasets: [
            {
                label: 'Monthly Revenue (MAD)',
                data: revenueDataPoints,
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                tension: 0.3,
            },
        ],
    };

    // 2. Top Rented Cars (Bar Chart)
    const topCarsData = {
        labels: analytics.top_cars.map(c => c.name),
        datasets: [
            {
                label: 'Times Rented',
                data: analytics.top_cars.map(c => c.count),
                backgroundColor: 'rgba(53, 162, 235, 0.7)',
            },
        ],
    };

    // 3. Rental Status (Doughnut Chart)
    const statusColors = {
        'pending': '#FCD34D', // Yellow
        'approved': '#34D399', // Green
        'rejected': '#EF4444', // Red
        'active': '#8B5CF6',   // Purple
        'completed': '#6B7280', // Gray
        'cancelled': '#F87171' // Light Red
    };

    const statusData = {
        labels: analytics.rental_status.map(s => s.status.toUpperCase()),
        datasets: [
            {
                data: analytics.rental_status.map(s => s.total),
                backgroundColor: analytics.rental_status.map(s => statusColors[s.status] || '#CBD5E1'),
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    // 4. Most Profitable Cars (Bar Chart)
    const profitData = {
        labels: analytics.profitable_cars.map(c => c.name),
        datasets: [
            {
                label: 'Total Revenue (MAD)',
                data: analytics.profitable_cars.map(c => c.revenue),
                backgroundColor: 'rgba(16, 185, 129, 0.7)', // Emerald
            },
        ],
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Analytics Dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Analytics Dashboard</h1>

            {/* FILTER SECTION */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Filter Data</h3>
                    {loading && <span className="text-blue-600 text-sm animate-pulse">Updating...</span>}
                </div>
                <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From Date</label>
                        <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To Date</label>
                        <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label>
                        <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full border rounded p-2 text-sm">
                            <option value="">All Years</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Month</label>
                        <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full border rounded p-2 text-sm" disabled={!filters.year}>
                            <option value="">All Months</option>
                            {[
                                "January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"
                            ].map((m, i) => (
                                <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black flex-1 text-sm font-bold transition">Apply</button>
                        <button type="button" onClick={resetFilters} className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200 text-sm font-bold transition">Reset</button>
                    </div>
                </form>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-xs font-bold uppercase">Total Cars</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.cars}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-xs font-bold uppercase">Total Rentals</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.rentals}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-xs font-bold uppercase">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">${stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-xs font-bold uppercase">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.users}</p>
                </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* 1. Revenue Trends */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Revenue Trends ({filters.year || 'All Time'})</h3>
                    <Line options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} data={revenueChartData} />
                </div>

                {/* 2. Rental Status Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 w-full text-left">Rental Status Breakdown</h3>
                    <div className="w-2/3">
                        <Doughnut options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} data={statusData} />
                    </div>
                </div>

                {/* 3. Top Rented Cars */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Most Popular Cars</h3>
                    <Bar options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }} data={topCarsData} />
                </div>

                {/* 4. Most Profitable Cars */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Most Profitable Cars (Revenue)</h3>
                    <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={profitData} />
                </div>

            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="flex space-x-4">
                    <button onClick={() => window.location.href = '/cars'} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-bold">Add New Car</button>
                    <button onClick={() => window.location.href = '/rentals'} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-bold">Manage Rentals</button>
                    <button onClick={() => window.location.href = '/users'} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold">Manage Users</button>
                </div>
            </div>
        </div>
    );
}
