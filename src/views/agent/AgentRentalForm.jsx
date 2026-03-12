/* src/views/agent/AgentRentalForm.jsx */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";

export default function AgentRentalForm() {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loadingCars, setLoadingCars] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        car_id: "",
        start_date: "",
        end_date: "",
        name: "",
        email: "",
        phone: "",
        cin: "",
        permis: "",
        address: "",
        payment_method: "espece",
        payment_reference: ""
    });

    const [documents, setDocuments] = useState({
        cin_recto: null,
        cin_verso: null,
        permis_image: null
    });

    useEffect(() => {
        axiosClient.get("/cars")
            .then(({ data }) => {
                setCars(data.filter(car => car.status === "available"));
                setLoadingCars(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingCars(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocuments(prev => ({ ...prev, [name]: files[0] }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        // Append text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        // Append files
        if (documents.cin_recto) data.append('cin_recto', documents.cin_recto);
        if (documents.cin_verso) data.append('cin_verso', documents.cin_verso);
        if (documents.permis_image) data.append('permis_image', documents.permis_image);

        axiosClient.post("/rentals/on-site", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                alert("Walk-in booking created successfully! The rental is now ACTIVE.");
                navigate("/rentals");
            })
            .catch(err => {
                console.error(err);
                const response = err.response;
                if (response && response.data) {
                    alert(`Error: ${response.data.message}`);
                } else {
                    alert("Failed to create booking.");
                }
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">New On-Site Booking</h1>

            <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CLIENT INFO */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Client Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CIN</label>
                                <input type="text" name="cin" required value={formData.cin} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Driver's License</label>
                                <input type="text" name="permis" required value={formData.permis} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                        </div>

                        <div className="space-y-3 pt-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Identity Documents (Images)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase">CIN Front (Recto)</label>
                                    <input type="file" name="cin_recto" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded p-1" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase">CIN Back (Verso)</label>
                                    <input type="file" name="cin_verso" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded p-1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase">Driver's License Copy</label>
                                <input type="file" name="permis_image" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-xs border rounded p-1" />
                            </div>
                        </div>
                    </div>

                    {/* RENTAL INFO */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">Booking Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Car</label>
                            <select name="car_id" required value={formData.car_id} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option value="">-- Choose available car --</option>
                                {cars.map(car => (
                                    <option key={car.id} value={car.id}>
                                        {car.brand} {car.model} (${car.price_per_day}/day)
                                    </option>
                                ))}
                            </select>
                            {loadingCars && <p className="text-xs text-blue-500 mt-1">Loading cars...</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" name="end_date" required value={formData.end_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <select name="payment_method" required value={formData.payment_method} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                                <option value="espece">Cash (Espèce)</option>
                                <option value="cheque">Cheque</option>
                                <option value="banque">Bank Transfer (Virement)</option>
                            </select>
                        </div>

                        {formData.payment_method !== "espece" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {formData.payment_method === "cheque" ? "Cheque Number" : "Transaction Reference"}
                                </label>
                                <input
                                    type="text"
                                    name="payment_reference"
                                    required
                                    value={formData.payment_reference}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-orange-300 bg-orange-50 rounded-md p-2"
                                    placeholder={formData.payment_method === "cheque" ? "Enter cheque #" : "Enter trans. ID"}
                                />
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-md mt-4 border border-dashed border-gray-300">
                            <p className="text-xs text-gray-500 italic">
                                Note: On-site bookings by agents are automatically marked as <strong>Approved</strong> and <strong>Active</strong> with payment confirmed.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || loadingCars}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? "Processing..." : "Create Walk-in Booking"}
                    </button>
                </div>
            </form>
        </div>
    );
}
