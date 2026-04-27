import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from "react-i18next";

moment.locale('en-gb', { week: { dow: 1 } });
const localizer = momentLocalizer(moment);
const FileUpload = ({ name, label, required, onChange, fileValue }) => (
    <div className="relative group overflow-hidden w-full">
        <input type="file" name={name} id={name} onChange={onChange} accept="image/*" className="hidden" required={required} />
        <label htmlFor={name} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0f0f0f] group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300 cursor-pointer text-center px-4">
            <span className={`text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 ${fileValue ? '' : 'grayscale opacity-50'}`}>
                {fileValue ? '✅' : '📷'}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest leading-tight ${fileValue ? 'text-primary' : 'text-gray-500'}`}>
                {fileValue ? fileValue.name : `Upload ${label}`}
            </span>
        </label>
    </div>
);

export default function Home() {
    const { t } = useTranslation();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token, register } = useAuth();
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
    const guestNameRef = useRef();
    const guestEmailRef = useRef();
    const guestPasswordRef = useRef();
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
        }

        axiosClient.get('/cars', { params })
            .then(({ data }) => {
                setCars(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if ((filterStartDate && filterEndDate) || (!filterStartDate && !filterEndDate)) {
            fetchCars();
        }
    }, [filterStartDate, filterEndDate]);

    const brands = ["All", ...Array.from(new Set((cars || []).map(c => c.brand)))];

    const filteredCars = (cars || [])
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
        setSelectedCar(car);
        setShowBookingModal(true);
        setBookingError(null);
        setTimeout(() => {
            if (startDateRef.current && filterStartDate) startDateRef.current.value = filterStartDate;
            if (endDateRef.current && filterEndDate) endDateRef.current.value = filterEndDate;
        }, 100);
    };

    const submitBooking = async (ev) => {
        ev.preventDefault();
        setBookingError(null);

        if (!token) {
            try {
                await register({
                    name: guestNameRef.current.value,
                    email: guestEmailRef.current.value,
                    password: guestPasswordRef.current.value,
                    password_confirmation: guestPasswordRef.current.value,
                    role: "user",
                });
            } catch (err) {
                const res = err?.response;
                if (res?.status === 422) {
                    setBookingError(Object.values(res.data.errors).flat().join(" · "));
                } else {
                    setBookingError("Failed to create account. Email may already be registered.");
                }
                return;
            }
        }

        const data = new FormData();
        data.append('car_id', selectedCar.id);
        data.append('start_date', startDateRef.current.value);
        data.append('end_date', endDateRef.current.value);
        if (documents.cin_recto) data.append('cin_recto', documents.cin_recto);
        if (documents.cin_verso) data.append('cin_verso', documents.cin_verso);
        if (documents.permis_image) data.append('permis_image', documents.permis_image);

        axiosClient.post('/rentals', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => { setShowBookingModal(false); success("Booking submitted successfully!"); navigate('/dashboard'); })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) showError(response.data.message || "Invalid input.");
                else if (response) showError(`Error: ${response.status} - ${response.data.message || response.statusText}`);
                else showError("An unexpected error occurred.");
            });
    };

    return (
        <div className="bg-bg-light dark:bg-bg-dark transition-colors duration-300 w-full overflow-hidden">
            
            {/* ───── HERO SECTION ───── */}
            <section className="relative h-screen w-full bg-bg-dark text-white flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    {/* Background Texture / Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#1a1a1a] to-transparent z-10 w-1/2"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=2000" 
                        alt="Hero Luxury Car" 
                        className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-80"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 flex flex-col items-start w-full gap-8">
                    <div className="flex flex-col max-w-2xl">
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-1">
                            {t('hero.title1')}
                        </h1>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>
                            {t('hero.title2')}
                        </h1>
                        <p className="mt-8 text-gray-400 font-bold tracking-widest uppercase text-sm">{t('hero.desc')}</p>
                        <p className="mt-2 text-primary font-bold text-lg">{t('hero.price')} <span className="text-sm text-gray-500 font-normal">{t('hero.perDay')}</span></p>

                        <div className="mt-10">
                            <a href="#cars" className="inline-block border border-gray-600 px-10 py-4 text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all">
                                {t('hero.driveNow')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── STATS BAR (Restored & Reskinned) ───── */}
            <section className="bg-bg-darker border-y border-gray-800 py-12 transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <p className="text-4xl font-extrabold text-primary mb-2">{cars.length}+</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('stats.vehicles')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-4xl font-extrabold text-primary mb-2">24/7</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('stats.support')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-4xl font-extrabold text-primary mb-2">500+</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('stats.clients')}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-4xl font-extrabold text-primary mb-2">10+</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('stats.cities')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── TODAYS SPECIALS / CAR LISTING ───── */}
            <section id="cars" className="py-24 bg-white dark:bg-bg-darker transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-6 mb-12">
                        <h2 className="text-2xl font-black tracking-widest uppercase text-gray-900 dark:text-white">
                            {t('specials.title')}
                        </h2>
                        
                        <div className="flex gap-8 mt-6 md:mt-0 text-xs font-bold text-gray-400">
                            <button className="hover:text-primary transition">{t('specials.suv')}</button>
                            <button className="hover:text-primary transition">{t('specials.luxury')}</button>
                            <button className="hover:text-primary transition">{t('specials.sportcar')}</button>
                            <button className="border border-gray-300 dark:border-gray-700 px-6 py-2 hover:border-primary hover:text-primary transition">
                                {t('specials.viewAll')}
                            </button>
                        </div>
                    </div>

                    {/* Filters Module */}
                    <div className="bg-gray-50 dark:bg-bg-dark p-6 mb-12 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by brand or model..."
                                className="col-span-1 md:col-span-2 bg-transparent border-b border-gray-300 dark:border-gray-700 px-0 py-2 text-sm focus:border-primary focus:outline-none dark:text-white transition"
                            />
                            
                            <select value={selectedTransmission} onChange={e => setSelectedTransmission(e.target.value)} className="bg-transparent border-b border-gray-300 dark:border-gray-700 px-0 py-2 text-sm focus:border-primary focus:outline-none dark:text-white transition">
                                <option className="dark:text-black" value="All">{t('filters.transmission')}</option>
                                <option className="dark:text-black" value="automatic">Automatic</option>
                                <option className="dark:text-black" value="manual">Manual</option>
                            </select>

                            <select value={selectedFuel} onChange={e => setSelectedFuel(e.target.value)} className="bg-transparent border-b border-gray-300 dark:border-gray-700 px-0 py-2 text-sm focus:border-primary focus:outline-none dark:text-white transition">
                                <option className="dark:text-black" value="All">{t('filters.fuel')}</option>
                                <option className="dark:text-black" value="petrol">Petrol</option>
                                <option className="dark:text-black" value="diesel">Diesel</option>
                                <option className="dark:text-black" value="electric">Electric</option>
                                <option className="dark:text-black" value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-6">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('filters.brand')}:</span>
                            {brands.map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => setSelectedBrand(brand)}
                                    className={`px-3 py-1 text-xs font-bold transition ${selectedBrand === brand ? 'text-primary' : 'text-gray-400 hover:text-gray-800 dark:hover:text-white'}`}
                                >
                                    {brand}
                                </button>
                            ))}

                            <div className="ml-auto flex items-center gap-4">
                                {hasActiveFilters && (
                                    <button onClick={resetFilters} className="text-xs text-red-500 font-bold uppercase hover:text-red-700 transition">
                                        [ {t('filters.clear')} ]
                                    </button>
                                )}
                                <span className="text-xs font-bold text-gray-400">{t('filters.results', { count: filteredCars.length })}</span>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!loading && filteredCars.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-sm">{t('filters.noResults')}</p>
                        </div>
                    )}

                    {/* Car Grid aligned with the image's styling */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {filteredCars.slice(0, visibleCount).map(car => (
                            <div key={car.id} className="group flex flex-col bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 hover:border-primary transition-all duration-300">
                                {/* Image Container */}
                                <div className="relative w-full h-56 overflow-hidden bg-white dark:bg-[#1a1a1a] flex items-center justify-center border-b border-gray-200 dark:border-gray-800 p-4">
                                    <img
                                        src={car.image || "https://placehold.co/600x400/1a1a1a/ffffff?text=" + car.brand}
                                        alt={car.brand}
                                        className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {car.availability === 'rented' && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            Rented
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{car.brand}</h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{car.model}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-primary text-xl font-black">${car.price_per_day}</span>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">/ Day</p>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="grid grid-cols-3 gap-2 border-y border-gray-200 dark:border-gray-800 py-4 my-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Year</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{car.year}</p>
                                        </div>
                                        <div className="text-center border-x border-gray-200 dark:border-gray-800">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Trans</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{car.transmission}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Fuel</p>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{car.fuel_type}</p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="mt-auto pt-2">
                                        <button 
                                            onClick={() => handleBookClick(car)}
                                            className="w-full bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold uppercase tracking-[0.2em] py-3 hover:border-primary hover:text-primary transition-all flex justify-center items-center gap-2 group-hover:bg-primary group-hover:text-black group-hover:border-primary"
                                        >
                                            {t('specials.driveNow')} <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCars.length > visibleCount && (
                        <div className="flex justify-center mt-16">
                            <button
                                onClick={() => setVisibleCount(prev => prev + 6)}
                                className="px-8 py-3 border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-500 hover:text-primary hover:border-primary transition uppercase tracking-widest"
                            >
                                {t('filters.loadMore')}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ───── LUXURY CAR RENTAL MIAMI (Cinematic Banner) ───── */}
            <section id="about" className="relative py-32 bg-black flex items-center min-h-[600px] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070" 
                        alt="Cinematic Background" 
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-6 tracking-widest drop-shadow-2xl">
                        {t('miami.title')}
                    </h2>
                    <p className="text-sm md:text-base text-gray-300 mb-4 tracking-widest max-w-2xl font-bold">
                        {t('miami.desc1')}
                    </p>
                    <p className="text-xs text-gray-400 mb-16 tracking-widest leading-relaxed max-w-3xl">
                        {t('miami.desc2')}
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white w-full max-w-4xl backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded shadow-2xl">
                        <div className="flex flex-col items-center gap-4 w-full md:w-auto hover:-translate-y-2 transition-transform">
                            <span className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center text-xl text-primary shadow-[0_0_15px_rgba(245,172,35,0.3)]">∞</span>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">{t('miami.feature1')}</span>
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full md:w-auto hover:-translate-y-2 transition-transform border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-16">
                            <span className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center text-xl text-primary shadow-[0_0_15px_rgba(245,172,35,0.3)]">📍</span>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">{t('miami.feature2')}</span>
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full md:w-auto hover:-translate-y-2 transition-transform border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-16">
                            <span className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center text-xl text-primary shadow-[0_0_15px_rgba(245,172,35,0.3)]">🚚</span>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">{t('miami.feature3')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── HOW IT WORKS (Restored & Reskinned) ───── */}
            <section className="py-24 bg-white dark:bg-bg-dark transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('howItWorks.title')}</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="text-center group border border-transparent hover:border-primary p-8 transition-colors duration-300">
                            <div className="w-16 h-16 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white group-hover:border-primary group-hover:text-primary flex items-center justify-center mx-auto mb-6 text-2xl transition-all duration-300">1</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('howItWorks.step1Title')}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">{t('howItWorks.step1Desc')}</p>
                        </div>
                        <div className="text-center group border border-transparent hover:border-primary p-8 transition-colors duration-300">
                            <div className="w-16 h-16 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white group-hover:border-primary group-hover:text-primary flex items-center justify-center mx-auto mb-6 text-2xl transition-all duration-300">2</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('howItWorks.step2Title')}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">{t('howItWorks.step2Desc')}</p>
                        </div>
                        <div className="text-center group border border-transparent hover:border-primary p-8 transition-colors duration-300">
                            <div className="w-16 h-16 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white group-hover:border-primary group-hover:text-primary flex items-center justify-center mx-auto mb-6 text-2xl transition-all duration-300">3</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('howItWorks.step3Title')}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-wider">{t('howItWorks.step3Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── WHY CHOOSE US (Restored & Reskinned) ───── */}
            <section className="py-24 bg-bg-lighter dark:bg-bg-darker transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('advantages.title')}</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark hover:border-primary transition-colors duration-300 group">
                            <div className="text-primary text-3xl mb-6">🏆</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('advantages.adv1Title')}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{t('advantages.adv1Desc')}</p>
                        </div>
                        <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark hover:border-primary transition-colors duration-300 group">
                            <div className="text-primary text-3xl mb-6">🛡️</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('advantages.adv2Title')}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{t('advantages.adv2Desc')}</p>
                        </div>
                        <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark hover:border-primary transition-colors duration-300 group">
                            <div className="text-primary text-3xl mb-6">⚡</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('advantages.adv3Title')}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{t('advantages.adv3Desc')}</p>
                        </div>
                        <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-bg-dark hover:border-primary transition-colors duration-300 group">
                            <div className="text-primary text-3xl mb-6">🔧</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-3">{t('advantages.adv4Title')}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">{t('advantages.adv4Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── TESTIMONIALS (Restored & Reskinned) ───── */}
            <section className="py-24 bg-white dark:bg-bg-dark transition-colors duration-300">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-widest">{t('testimonials.title')}</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: t('testimonials.t1Name'), text: t('testimonials.t1Text') },
                            { name: t('testimonials.t2Name'), text: t('testimonials.t2Text') },
                            { name: t('testimonials.t3Name'), text: t('testimonials.t3Text') },
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center group hover:border-primary transition-colors duration-300">
                                <div className="flex text-primary text-lg mb-4 gap-1">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                                <p className="text-gray-500 text-xs italic uppercase tracking-widest leading-relaxed mb-6">"{t.text}"</p>
                                <span className="font-bold text-gray-900 dark:text-white text-[10px] uppercase tracking-widest">— {t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── LOCATIONS (Moroccan Airports) ───── */}
            <section className="py-24 bg-bg-darker transition-colors duration-300 border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-widest">{t('locations.title')}</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">{t('locations.desc')}</p>
                        </div>
                        <div className="hidden md:block w-32 h-1 bg-primary"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {['casablanca', 'marrakech', 'agadir', 'tangier', 'rabat', 'fez'].map((city, idx) => (
                            <div key={idx} className="border border-gray-800 bg-[#0a0a0a] hover:border-primary p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group">
                                <span className="text-2xl mb-4 grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100">✈️</span>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{t(`locations.${city}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── CTA SECTION (Restored & Reskinned) ───── */}
            <section className="py-24 bg-primary text-black transition-colors duration-300">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">{t('cta.title')}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest mb-10 max-w-lg mx-auto opacity-80">{t('cta.desc')}</p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <a href="#cars" className="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] border border-black hover:bg-transparent hover:text-black transition-all">
                            {t('cta.viewCars')}
                        </a>
                        {!token && (
                            <Link to="/signup" className="px-10 py-4 bg-transparent text-black text-[10px] font-black uppercase tracking-[0.2em] border border-black hover:bg-black hover:text-white transition-all">
                                {t('cta.signUp')}
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ───── BOOKING MODAL (Kept functional & Reskinned to match) ───── */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-bg-darker rounded-none shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 animate-fade-in-up overflow-hidden">
                        <div className="bg-bg-dark text-white px-6 py-5 flex justify-between items-center border-b border-gray-800">
                            <h3 className="text-sm font-black uppercase tracking-widest">Book {selectedCar?.brand} {selectedCar?.model}</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-white text-xl transition">&times;</button>
                        </div>

                        <div className="p-8 max-h-[80vh] overflow-y-auto">
                            {bookingError && <div className="bg-red-900/20 text-red-500 border border-red-900/50 p-3 mb-6 text-xs font-bold uppercase tracking-widest text-center">{bookingError}</div>}

                            <div className="mb-8">
                                <button
                                    type="button"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition flex items-center justify-center gap-2"
                                >
                                    {showCalendar ? "Hide Calendar" : "Check Calendar"}
                                </button>

                                {showCalendar && (
                                    <div className="mt-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                                        <Calendar
                                            localizer={localizer}
                                            events={availabilityEvents}
                                            startAccessor="start"
                                            endAccessor="end"
                                            views={['month']}
                                            defaultView='month'
                                            date={calendarDate}
                                            onNavigate={setCalendarDate}
                                            toolbar={true}
                                            style={{ height: 340 }}
                                            eventPropGetter={() => ({
                                                style: { backgroundColor: '#f5ac23', color: '#000', borderRadius: '0', border: 'none', fontSize: '9px', fontWeight: 'bold' }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>

                            <form onSubmit={submitBooking}>
                                <div className="mb-4">
                                    <label className="block text-gray-500 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-2">
                                        Start Date <span>🗓️ Choose via Icon</span>
                                    </label>
                                    <input ref={startDateRef} onChange={calculateTotal} type="date" className="border-b border-gray-300 dark:border-gray-700 bg-transparent w-full py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition text-sm cursor-pointer [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-500 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mb-2">
                                        End Date <span>🗓️ Choose via Icon</span>
                                    </label>
                                    <input ref={endDateRef} onChange={calculateTotal} type="date" className="border-b border-gray-300 dark:border-gray-700 bg-transparent w-full py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition text-sm cursor-pointer [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer" required />
                                </div>

                                {days > 0 && (
                                    <div className="mb-8 border border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{days} Days</span>
                                        <span className="font-extrabold text-primary">${totalPrice}</span>
                                    </div>
                                )}

                                {!token && (
                                    <div className="mb-8 border border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-bg-darker">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Create Account to Book</h4>
                                            <Link to="/login" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Or Login →</Link>
                                        </div>
                                        <div className="space-y-4">
                                            <input ref={guestNameRef} type="text" placeholder="FULL NAME" required className="border-b border-gray-300 dark:border-gray-700 bg-transparent w-full py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition text-xs tracking-widest" />
                                            <input ref={guestEmailRef} type="email" placeholder="EMAIL ADDRESS" required className="border-b border-gray-300 dark:border-gray-700 bg-transparent w-full py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition text-xs tracking-widest" />
                                            <input ref={guestPasswordRef} type="password" placeholder="PASSWORD" required className="border-b border-gray-300 dark:border-gray-700 bg-transparent w-full py-2 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition text-xs tracking-widest" />
                                        </div>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Identity Documents</h4>
                                    <div className="space-y-4">
                                        <FileUpload name="cin_recto" label={`CIN Front ${user?.cin_recto_path ? '(Optional Update)' : ''}`} required={!user?.cin_recto_path} onChange={handleFileChange} fileValue={documents.cin_recto} />
                                        <FileUpload name="cin_verso" label={`CIN Back ${user?.cin_verso_path ? '(Optional Update)' : ''}`} required={!user?.cin_verso_path} onChange={handleFileChange} fileValue={documents.cin_verso} />
                                        <FileUpload name="permis_image" label={`Driver's License ${user?.permis_path ? '(Optional Update)' : ''}`} required={!user?.permis_path} onChange={handleFileChange} fileValue={documents.permis_image} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-primary hover:bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] py-4 transition-all border border-transparent hover:border-black">
                                    CONFIRM BOOKING
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}