import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('en-gb', { week: { dow: 1 } });
const localizer = momentLocalizer(moment);

export default function Home() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    // Calendar State
    const [showCalendar, setShowCalendar] = useState(false);
    const [availabilityEvents, setAvailabilityEvents] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date());



    // ── Pagination ──
    const [visibleCount, setVisibleCount] = useState(6);

    // ── Filter State ──
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [selectedTransmission, setSelectedTransmission] = useState("All");
    const [selectedFuel, setSelectedFuel] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    // Booking Modal State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const startDateRef = useRef();
    const endDateRef = useRef();
    const [bookingError, setBookingError] = useState(null);

    const [documents, setDocuments] = useState({
        cin_recto: null,
        cin_verso: null,
        permis_image: null
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocuments(prev => ({ ...prev, [name]: files[0] }));
    };

    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    useEffect(() => {
        if (showBookingModal && selectedCar) {
            axiosClient.get(`/cars/${selectedCar.id}/availability`)
                .then(({ data }) => {
                    const events = data.map(range => ({
                        title: 'Fully Booked',
                        start: new Date(range.start),
                        end: new Date(range.end),
                        allDay: true,
                        resource: 'booked'
                    }));
                    setAvailabilityEvents(events);
                })
                .catch(err => console.error(err));
        }
    }, [showBookingModal, selectedCar]);

    const fetchCars = () => {
        setLoading(true);
        const params = {};
        if (filterStartDate && filterEndDate) {
            params.start_date = filterStartDate;
            params.end_date = filterEndDate;
        } else if (filterStartDate || filterEndDate) {
            // If only one is selected, don't filter by date yet (or filter by partial? No, partial is risky)
            // better wait for both.
            // But we should reload valid cars if filters cleared.
        }

        // If dates are cleared, we want to fetch all.
        // The API returns all if no params.

        axiosClient.get('/cars', { params })
            .then(({ data }) => {
                setCars(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        // Debounce or just fetch when both valid
        if ((filterStartDate && filterEndDate) || (!filterStartDate && !filterEndDate)) {
            fetchCars();
        }
    }, [filterStartDate, filterEndDate]);

    // ── Derived: unique brands from data ──
    const brands = ["All", ...Array.from(new Set(cars.map(c => c.brand)))];

    // ── Filtered + Sorted Cars ──
    const filteredCars = cars
        .filter(car => {
            const q = searchQuery.toLowerCase();
            const matchSearch = !q || `${car.brand} ${car.model}`.toLowerCase().includes(q);
            const matchBrand = selectedBrand === "All" || car.brand === selectedBrand;
            const matchTransmission = selectedTransmission === "All" || car.transmission === selectedTransmission;
            const matchFuel = selectedFuel === "All" || car.fuel_type === selectedFuel;
            return matchSearch && matchBrand && matchTransmission && matchFuel;
        })
        .sort((a, b) => {
            if (sortBy === "price_asc") return a.price_per_day - b.price_per_day;
            if (sortBy === "price_desc") return b.price_per_day - a.price_per_day;
            if (sortBy === "year_desc") return b.year - a.year;
            return 0;
        });

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedBrand("All");
        setSelectedTransmission("All");
        setSelectedFuel("All");
        setSortBy("default");
        setFilterStartDate("");
        setFilterEndDate("");
        setVisibleCount(6);
    };

    const hasActiveFilters = searchQuery || selectedBrand !== "All" || selectedTransmission !== "All" || selectedFuel !== "All" || sortBy !== "default" || filterStartDate || filterEndDate;


    const calculateTotal = () => {
        const start = new Date(startDateRef.current.value);
        const end = new Date(endDateRef.current.value);
        if (startDateRef.current.value && endDateRef.current.value && end > start) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDays(diffDays);
            setTotalPrice(diffDays * selectedCar.price_per_day);
        } else {
            setDays(0);
            setTotalPrice(0);
        }
    };

    const handleBookClick = (car) => {
        if (!token) { navigate('/login'); return; }
        setSelectedCar(car);
        setShowBookingModal(true);
        setBookingError(null);
        // Pre-fill dates if selected in filter
        setTimeout(() => {
            if (startDateRef.current && filterStartDate) startDateRef.current.value = filterStartDate;
            if (endDateRef.current && filterEndDate) endDateRef.current.value = filterEndDate;
            // Trigger calc if both present
            if (filterStartDate && filterEndDate) {
                // We need to manually trigger logic or simulate event?
                // Let's just duplicate logic or abstract it.
                // Ideally calculateTotal reads refs, so calling it works.
                // But state selection isn't ready immediately inside setTimeout?
                // Actually calculateTotal uses refs.
                // We can call it safely?
                // calculateTotal(); // Might fail if selectedCar not set yet state buffer?
            }
        }, 100);
    };

    const submitBooking = (ev) => {
        ev.preventDefault();
        const data = new FormData();
        data.append('car_id', selectedCar.id);
        data.append('start_date', startDateRef.current.value);
        data.append('end_date', endDateRef.current.value);
        if (documents.cin_recto) data.append('cin_recto', documents.cin_recto);
        if (documents.cin_verso) data.append('cin_verso', documents.cin_verso);
        if (documents.permis_image) data.append('permis_image', documents.permis_image);

        axiosClient.post('/rentals', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => { setShowBookingModal(false); success("Booking submitted successfully! 🎉"); navigate('/dashboard'); })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) showError(response.data.message || "Invalid input.");
                else if (response) showError(`Error: ${response.status} - ${response.data.message || response.statusText}`);
                else showError("An unexpected error occurred.");
            });
    };

    return (
        <div className="bg-gray-50">

            {/* ───── HERO SECTION ───── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white">
                {/* animated shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-700 rounded-full mix-blend-multiply opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="container mx-auto px-4 py-28 md:py-36 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block bg-blue-600/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-blue-500/30">
                            🚗 Premium Car Rentals
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                            Drive Your <br />
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Dream Car</span> Today
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                            Explore our fleet of luxury, sport, and economical vehicles. Book in minutes, pick up whenever you're ready.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#cars" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-700/40 transition-all duration-300 text-lg">
                                Browse Our Fleet
                            </a>
                            {!token && (
                                <Link to="/signup" className="px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-lg">
                                    Create Account
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* bottom wave */}
                <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 80" fill="none"><path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#F9FAFB" /></svg>
            </section>

            {/* ───── STATS BAR ───── */}
            <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">{cars.length}+</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Vehicles</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">24/7</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Online Support</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">500+</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Happy Clients</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">10+</p>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Cities Covered</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── HOW IT WORKS ───── */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Simple Process</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">How It Works</h2>
                        <p className="text-gray-500 mt-4 max-w-md mx-auto">Rent a car in three simple steps. No hassles, no hidden fees.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
                        {/* Step 1 */}
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-100">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Choose a Car</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Browse our collection and find the perfect vehicle for your trip.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl group-hover:bg-green-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-green-100">
                                📋
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Book Online</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Select dates, upload your documents, and confirm your booking.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="text-center group">
                            <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-orange-100">
                                🚗
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Hit the Road</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Pick up the keys and enjoy your ride. It's that easy!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── CAR LISTING ───── */}
            <section id="cars" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Our Fleet</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">Available Vehicles</h2>
                        <p className="text-gray-500 mt-4 max-w-md mx-auto">Find the perfect ride from our curated collection of premium cars.</p>
                    </div>

                    {/* ── FILTER BAR ── */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
                        {/* Row 1: Search + Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                            {/* Search */}
                            <div className="relative md:col-span-2">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by brand or model..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Start Date */}
                            <div className="relative">
                                <span className="absolute left-3 top-1 text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-1 z-10">From</span>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={e => setFilterStartDate(e.target.value)}
                                    className="w-full pl-4 pr-4 pt-5 pb-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>

                            {/* End Date */}
                            <div className="relative">
                                <span className="absolute left-3 top-1 text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-1 z-10">To</span>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={e => setFilterEndDate(e.target.value)}
                                    className="w-full pl-4 pr-4 pt-5 pb-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                        </div>

                        {/* Row 2: Dropdowns */}
                        <div className="flex flex-col md:flex-row gap-4 mb-5">
                            {/* Transmission */}
                            <select
                                value={selectedTransmission}
                                onChange={e => setSelectedTransmission(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer flex-grow"
                            >
                                <option value="All">⚙️ All Transmissions</option>
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>

                            {/* Fuel Type */}
                            <select
                                value={selectedFuel}
                                onChange={e => setSelectedFuel(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="All">⛽ All Fuel Types</option>
                                <option value="petrol">Petrol</option>
                                <option value="diesel">Diesel</option>
                                <option value="electric">Electric</option>
                                <option value="hybrid">Hybrid</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="default">📊 Sort By</option>
                                <option value="price_asc">Price: Low → High</option>
                                <option value="price_desc">Price: High → Low</option>
                                <option value="year_desc">Newest First</option>
                            </select>
                        </div>

                        {/* Row 2: Brand Pills */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Brand:</span>
                            <div className="flex flex-wrap gap-2">
                                {brands.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => setSelectedBrand(brand)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${selectedBrand === brand
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>

                            {/* Reset + Count */}
                            <div className="ml-auto flex items-center gap-3 shrink-0">
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1 transition"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                    {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!loading && filteredCars.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No vehicles found</h3>
                            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search query.</p>
                            <button onClick={resetFilters} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCars.slice(0, visibleCount).map(car => (
                            <div key={car.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={car.image || "https://placehold.co/600x400/1e293b/ffffff?text=" + car.brand}
                                        alt={car.brand}
                                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                                        <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow">{car.year}</span>
                                        {car.availability === 'rented' && (
                                            <span className="bg-red-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-pulse">RENTED</span>
                                        )}
                                    </div>
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{car.fuel_type}</span>
                                        <span className="bg-gray-900/70 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{car.transmission}</span>
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{car.brand} {car.model}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.983 1.907a.75.75 0 00-1.292-.657L3.29 9.75H1.5A.75.75 0 001 10.5v2a.75.75 0 00.75.75h2.336l6.955 8.5a.75.75 0 001.292-.657V1.907z" /></svg>
                                                {car.transmission}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                                {car.fuel_type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-2xl font-extrabold text-blue-600">{car.price_per_day} <span className="text-xs text-gray-400 font-normal">MAD/day</span></span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {car.availability === 'rented' && car.rented_until && (
                                                <span className="text-[10px] text-red-500 font-medium">Until {new Date(car.rented_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                            )}
                                            <button
                                                onClick={() => handleBookClick(car)}
                                                className="px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-colors duration-300 bg-gray-900 hover:bg-blue-600"
                                            >
                                                {car.availability === 'rented' ? 'Book Later' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {filteredCars.length > visibleCount && (
                        <div className="flex flex-col items-center mt-12">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                className="group px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3"
                            >
                                <span>Load More Cars</span>
                                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <span className="text-xs text-gray-400 mt-3">Showing {Math.min(visibleCount, filteredCars.length)} of {filteredCars.length} vehicles</span>
                        </div>
                    )}
                </div>
            </section>


            {/* ───── WHY CHOOSE US ───── */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Our Advantages</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">Why Choose Us?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-3xl mb-4">💰</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Best Prices</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Competitive rates with no hidden fees. Transparent pricing for every vehicle.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-3xl mb-4">🛡️</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Full Insurance</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">All vehicles come with comprehensive insurance coverage for your peace of mind.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-3xl mb-4">⚡</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Booking</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Book online in seconds. Get instant confirmation and pick up your car hassle‑free.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-3xl mb-4">🔧</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Maintained Fleet</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Every car is professionally maintained and cleaned before each rental.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Testimonials</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-3">What Our Clients Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { name: "Yassine B.", text: "Incredible service! The car was in perfect condition and the booking process was seamless. Highly recommend!", stars: 5 },
                            { name: "Fatima Z.", text: "Best car rental experience in Morocco. Great prices, clean cars, and very friendly staff.", stars: 5 },
                            { name: "Ahmed M.", text: "I've used many rental services, but RentACar stands out. The online platform is easy to use and they have a great fleet.", stars: 4 },
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                <div className="flex text-yellow-400 text-lg mb-4">
                                    {"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed flex-grow italic">"{t.text}"</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-gray-800 text-sm">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── CTA SECTION ───── */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Hit the Road?</h2>
                    <p className="text-lg text-blue-100 mb-10 max-w-lg mx-auto">Join hundreds of satisfied customers. Create your account now and book your first rental in minutes.</p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <a href="#cars" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 text-lg">
                            View Cars
                        </a>
                        {!token && (
                            <Link to="/signup" className="px-8 py-4 bg-blue-800/50 text-white font-bold rounded-xl border border-white/30 hover:bg-blue-800 transition-all duration-300 text-lg">
                                Sign Up Free
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ───── BOOKING MODAL ───── */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Book {selectedCar?.brand} {selectedCar?.model}</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-300 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            {bookingError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{bookingError}</div>}

                            {/* Availability Calendar Toggle */}
                            <div className="mb-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {showCalendar ? "Hide Availability Calendar" : "Check Availability Calendar"}
                                </button>

                                {showCalendar && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <style>{`
                                            .rbc-month-view { border: none !important; }
                                            .rbc-header { background: #f8fafc; padding: 8px 4px !important; font-size: 11px !important; font-weight: 700 !important; color: #64748b !important; text-transform: uppercase; border-bottom: 1px solid #e2e8f0 !important; }
                                            .rbc-header + .rbc-header { border-left: 1px solid #e2e8f0 !important; }
                                            .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9 !important; }
                                            .rbc-month-row + .rbc-month-row { border-top: 1px solid #f1f5f9 !important; }
                                            .rbc-off-range-bg { background: #f8fafc !important; }
                                            .rbc-today { background: #eff6ff !important; }
                                            .rbc-date-cell { font-size: 12px !important; padding: 4px 6px !important; }
                                            .rbc-event { font-size: 9px !important; padding: 1px 4px !important; }
                                            .rbc-row-segment { padding: 0 2px !important; }
                                        `}</style>
                                        <Calendar
                                            localizer={localizer}
                                            events={availabilityEvents}
                                            startAccessor="start"
                                            endAccessor="end"
                                            views={['month']}
                                            defaultView='month'
                                            date={calendarDate}
                                            onNavigate={(newDate) => setCalendarDate(newDate)}
                                            toolbar={true}
                                            style={{ height: 340 }}
                                            eventPropGetter={() => ({
                                                style: { backgroundColor: '#EF4444', color: 'white', borderRadius: '6px', border: 'none', fontSize: '9px', fontWeight: 600 }
                                            })}
                                            components={{
                                                toolbar: (toolbar) => (
                                                    <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                                                        <button onClick={() => toolbar.onNavigate('PREV')} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-500 hover:text-gray-800 transition border border-transparent hover:border-gray-200 hover:shadow-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                        </button>
                                                        <span className="font-bold text-gray-800 text-sm tracking-wide">{moment(toolbar.date).format('MMMM YYYY')}</span>
                                                        <button onClick={() => toolbar.onNavigate('NEXT')} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-gray-500 hover:text-gray-800 transition border border-transparent hover:border-gray-200 hover:shadow-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                        </button>
                                                    </div>
                                                )
                                            }}
                                        />
                                        <div className="flex items-center justify-center gap-3 py-2.5 bg-gray-50 border-t border-gray-100">
                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm inline-block"></span> Booked</span>
                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-2.5 h-2.5 bg-blue-100 rounded-sm inline-block border border-blue-200"></span> Today</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={submitBooking}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                                    <input ref={startDateRef} onChange={calculateTotal} type="date" className="border border-gray-200 rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                                    <input ref={endDateRef} onChange={calculateTotal} type="date" className="border border-gray-200 rounded-lg w-full py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                                </div>

                                {days > 0 && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{days} days × {selectedCar.price_per_day} MAD</span>
                                            <span className="font-bold text-blue-700">{totalPrice} MAD</span>
                                        </div>
                                    </div>
                                )}

                                {/* Identity Documents */}
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h4 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Identity Documents
                                    </h4>

                                    {user?.cin_recto_path && (
                                        <div className="text-green-700 text-xs font-medium flex items-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Documents already on file.
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase">CIN Front (Recto) {user?.cin_recto_path && "(Optional Update)"}</label>
                                            <input type="file" name="cin_recto" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded-lg p-1.5 bg-white" required={!user?.cin_recto_path} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase">CIN Back (Verso) {user?.cin_verso_path && "(Optional Update)"}</label>
                                            <input type="file" name="cin_verso" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded-lg p-1.5 bg-white" required={!user?.cin_verso_path} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Driver's License Copy {user?.permis_path && "(Optional Update)"}</label>
                                            <input type="file" name="permis_image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded-lg p-1.5 bg-white" required={!user?.permis_path} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-3 italic">Uploaded documents are stored securely and visible only to authorized staff.</p>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2">Cancel</button>
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-blue-600/30">
                                        Confirm Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}