import { Link } from "react-router-dom";

export default function AgentDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Agent Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card 1: Manage Cars */}
                <Link to="/cars" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100 block">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 text-2xl">🚗</div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Manage Cars</h2>
                            <p className="text-gray-500 text-sm">Add, update, or remove vehicles.</p>
                        </div>
                    </div>
                </Link>

                {/* Card 2: Manage Rentals */}
                <Link to="/rentals" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600 text-2xl">📅</div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Manage Rentals</h2>
                        <p className="text-gray-500 text-sm">Approve or reject booking requests.</p>
                    </div>
                </Link>

                {/* Card 3: New Walk-in Booking */}
                <Link to="/agent/booking" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-100 flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-2xl">📝</div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Book for Walk-in</h2>
                        <p className="text-gray-500 text-sm">Register client and book on-site.</p>
                    </div>
                </Link>

            </div>
        </div>
    );
}
