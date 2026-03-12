/* src/views/Cars.jsx */
import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Cars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const { success, error, showConfirm } = useToast();

    // Form Refs
    const brandRef = useRef();
    const modelRef = useRef();
    const yearRef = useRef();
    const priceRef = useRef();
    const quantityRef = useRef();
    const registrationRef = useRef();
    const colorRef = useRef();
    const fuelRef = useRef();
    const transmissionRef = useRef();
    const statusRef = useRef();
    const detailsRef = useRef();
    const imageRef = useRef();

    useEffect(() => {
        getCars();
    }, []);

    const getCars = () => {
        setLoading(true);
        axiosClient.get('/cars?all=1')
            .then(({ data }) => {
                setCars(data);
                setLoading(false);
            })
    };

    const editCar = (car) => {
        setSelectedCar(car);
        setShowModal(true);
        setTimeout(() => {
            brandRef.current.value = car.brand;
            modelRef.current.value = car.model;
            yearRef.current.value = car.year;
            priceRef.current.value = car.price_per_day;
            quantityRef.current.value = car.quantity || 1;
            registrationRef.current.value = car.registration_number;
            colorRef.current.value = car.color;
            fuelRef.current.value = car.fuel_type;
            transmissionRef.current.value = car.transmission;
            statusRef.current.value = car.status;
            detailsRef.current.value = car.details || '';
        }, 100);
    };

    const deleteCar = (car) => {
        showConfirm({
            title: "Delete Car",
            message: `Are you sure you want to delete ${car.brand} ${car.model}? This action cannot be undone.`,
            confirmText: "Delete",
            variant: "danger",
            onConfirm: () => {
                axiosClient.delete(`/cars/${car.id}`)
                    .then(() => {
                        success("Car deleted successfully!");
                        getCars();
                    })
                    .catch(() => error("Failed to delete car."));
            }
        });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();

        const formData = new FormData();
        formData.append('brand', brandRef.current.value);
        formData.append('model', modelRef.current.value);
        formData.append('year', yearRef.current.value);
        formData.append('price_per_day', priceRef.current.value);
        formData.append('quantity', quantityRef.current.value);
        formData.append('registration_number', registrationRef.current.value);
        formData.append('color', colorRef.current.value);
        formData.append('fuel_type', fuelRef.current.value);
        formData.append('transmission', transmissionRef.current.value);
        formData.append('status', statusRef.current.value);
        formData.append('details', detailsRef.current.value);

        if (imageRef.current.files[0]) {
            formData.append('image', imageRef.current.files[0]);
        }

        let request;
        if (selectedCar) {
            formData.append('_method', 'PUT');
            request = axiosClient.post(`/cars/${selectedCar.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            request = axiosClient.post('/cars', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        request
            .then(() => {
                setShowModal(false);
                setSelectedCar(null);
                getCars();
                setErrors(null);
                success(selectedCar ? "Car updated successfully!" : "Car added successfully!");
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                    error("Please fix the validation errors.");
                } else {
                    error("An unexpected error occurred.");
                }
            });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Cars Management</h1>
                <button onClick={() => { setSelectedCar(null); setShowModal(true); }} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-bold transition">
                    + Add New Car
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Day</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && <tr><td colSpan="5" className="text-center p-8 text-gray-500">Loading cars...</td></tr>}
                        {!loading && cars.map(car => (
                            <tr key={car.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0">
                                            <img className="h-12 w-12 rounded-lg object-cover border border-gray-200" src={car.image || "https://placehold.co/100"} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900">{car.brand} {car.model}</div>
                                            <div className="text-xs text-gray-500">{car.year} • {car.transmission} • {car.quantity} in stock</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">{car.registration_number}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-900">{car.price_per_day} MAD</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${car.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                                        ${car.status === 'rented' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${car.status === 'maintenance' ? 'bg-orange-100 text-orange-800' : ''}
                                    `}>
                                        {car.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => editCar(car)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded transition">Edit</button>
                                    <button onClick={() => deleteCar(car)} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded transition">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{selectedCar ? 'Edit Car' : 'Add New Car'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="p-8 max-h-[80vh] overflow-y-auto">
                            <form onSubmit={onSubmit} className="space-y-6">

                                {/* SECTION 1: BASIC INFO */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">Car Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                            <input ref={brandRef} type="text" placeholder="e.g. Toyota" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                            {errors?.brand && <p className="text-red-500 text-xs mt-1">{errors.brand[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                            <input ref={modelRef} type="text" placeholder="e.g. Camry" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                            {errors?.model && <p className="text-red-500 text-xs mt-1">{errors.model[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                            <input ref={yearRef} type="number" placeholder="2024" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                            {errors?.year && <p className="text-red-500 text-xs mt-1">{errors.year[0]}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                        <input ref={registrationRef} type="text" placeholder="ABC-123" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                        {errors?.registration_number && <p className="text-red-500 text-xs mt-1">{errors.registration_number[0]}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price (MAD)</label>
                                        <input ref={priceRef} type="number" placeholder="350" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                        {errors?.price_per_day && <p className="text-red-500 text-xs mt-1">{errors.price_per_day[0]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input ref={quantityRef} type="number" min="1" placeholder="1" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                        {errors?.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity[0]}</p>}
                                    </div>
                                </div>

                        {/* SECTION 2: SPECS */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">Technical Specs</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input ref={colorRef} type="text" placeholder="e.g. Silver" className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                    {errors?.color && <p className="text-red-500 text-xs mt-1">{errors.color[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                    <select ref={transmissionRef} className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                                        <option value="manual">Manual</option>
                                        <option value="automatic">Automatic</option>
                                    </select>
                                    {errors?.transmission && <p className="text-red-500 text-xs mt-1">{errors.transmission[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                    <select ref={fuelRef} className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                    {errors?.fuel_type && <p className="text-red-500 text-xs mt-1">{errors.fuel_type[0]}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: MEDIA & STATUS */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">Media & Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                                    <input ref={imageRef} type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 p-1 rounded cursor-pointer" />
                                    {selectedCar && selectedCar.image && (
                                        <div className="mt-2">
                                            <img src={selectedCar.image} alt="Current Car" className="w-32 h-20 object-cover rounded border" />
                                        </div>
                                    )}
                                    {errors?.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                                    <select ref={statusRef} className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                                        <option value="available">Available</option>
                                        <option value="rented">Rented</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                    {errors?.status && <p className="text-red-500 text-xs mt-1">{errors.status[0]}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                                <textarea ref={detailsRef} placeholder="Enter any additional details about the car condition, features, etc." className="w-full border border-gray-300 p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
                                {errors?.details && <p className="text-red-500 text-xs mt-1">{errors.details[0]}</p>}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium transition">
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow-md hover:shadow-lg transition">
                                {selectedCar ? 'Update Car' : 'Save Car'}
                            </button>
                        </div>
                    </form>
                </div>
                    </div>
                </div >
            )
}
        </div >
    );
}