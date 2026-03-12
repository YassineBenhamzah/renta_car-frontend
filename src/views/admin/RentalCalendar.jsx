import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosClient from '../../api/axios';

// 1. Set start of week to Monday
moment.locale('en-gb', {
    week: {
        dow: 1, // Monday is the first day of the week
    }
});

const localizer = momentLocalizer(moment);

// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span className="text-lg font-bold text-gray-800 capitalize">
                {date.format('MMMM')} <span className="font-light text-gray-500">{date.format('YYYY')}</span>
            </span>
        );
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-2">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <button
                    onClick={goToBack}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
                    title="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    onClick={goToCurrent}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Today
                </button>
                <button
                    onClick={goToNext}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
                    title="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="ml-4 pl-4 border-l border-gray-200 hidden md:block">
                    {label()}
                </div>
            </div>

            <div className="md:hidden mb-4">
                {label()}
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg">
                {['month', 'week', 'day', 'agenda'].map(view => (
                    <button
                        key={view}
                        onClick={() => toolbar.onView(view)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${toolbar.view === view
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {view}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Custom Event Component
const CustomEvent = ({ event }) => {
    return (
        <div
            className="h-full w-full px-1.5 py-0.5 text-[10px] md:text-xs rounded border border-transparent hover:border-white/50 transition-colors shadow-sm"
            style={{
                backgroundColor: event.color,
                color: 'white',
            }}
            title={`${event.resource.car.brand} ${event.resource.car.model} - ${event.resource.user.name}`}
        >
            <div className="font-bold truncate">
                {event.resource.car.brand} {event.resource.car.model}
            </div>
            <div className="truncate opacity-90 text-[9px] md:text-[10px]">
                {event.resource.user.name}
            </div>
        </div>
    );
};

export default function RentalCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());

    // Fetch rentals
    const fetchRentals = async () => {
        try {
            const { data } = await axiosClient.get('/rentals');

            const formattedEvents = data.map(rental => ({
                id: rental.id,
                title: `${rental.car.brand} ${rental.car.model}`, // Title mainly for agenda view
                start: new Date(rental.start_date),
                end: new Date(rental.end_date),
                allDay: true,
                resource: rental,
                color: getStatusColor(rental.status)
            }));
            setEvents(formattedEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rentals:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#059669'; // Emerald-600 (Darker Green)
            case 'pending': return '#D97706'; // Amber-600 (Darker Orange)
            case 'completed': return '#2563EB'; // Blue-600
            case 'cancelled': return '#DC2626'; // Red-600
            default: return '#4B5563'; // Gray-600
        }
    };

    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    // Cleaner Styles
    const calendarStyles = `
        .rbc-calendar { font-family: 'Inter', sans-serif; color: #1f2937; }
        .rbc-month-view { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .rbc-header { 
            padding: 8px; 
            font-weight: 600; 
            color: #4b5563; 
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
        }
        .rbc-month-row { border-top: 1px solid #e5e7eb; }
        .rbc-day-bg { border-left: 1px solid #e5e7eb; }
        .rbc-off-range-bg { background-color: #fcfcfc; }
        .rbc-today { background-color: #f0f9ff; }
        .rbc-event { 
            background: none !important; 
            padding: 1px !important; 
            border: none !important; 
            outline: none !important;
        }
        .rbc-date-cell { padding: 4px 8px; font-weight: 500; font-size: 12px; color: #6b7280; }
        .rbc-show-more { 
            background-color: transparent; 
            color: #4b5563; 
            font-weight: 600; 
            font-size: 11px;
            margin: 2px;
            text-align: center; 
        }
        .rbc-toolbar { margin-bottom: 0 !important; }
    `;

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="h-screen p-4 bg-gray-50">
            <style>{calendarStyles}</style>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ flex: 1 }}
                    components={{
                        toolbar: CustomToolbar,
                        event: CustomEvent
                    }}
                    views={['month', 'week', 'day', 'agenda']}
                    view={view}
                    onView={handleViewChange}
                    date={date}
                    onNavigate={handleNavigate}
                    popup
                />
            </div>
        </div>
    );
}
