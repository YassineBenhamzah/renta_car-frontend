/* src/views/user/UserDashboard.jsx */
import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";

export default function UserDashboard() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/my-rentals')
            .then(({ data }) => {
                setRentals(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const [selectedRental, setSelectedRental] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentProof, setPaymentProof] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const openPaymentModal = (rental) => {
        setSelectedRental(rental);
        setPaymentMethod('');
        setPaymentProof(null);
    };

    const closePaymentModal = () => {
        setSelectedRental(null);
    };

    const handleFileChange = (e) => {
        setPaymentProof(e.target.files[0]);
    };

    const submitPayment = (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }
        if (paymentMethod === 'banque' && !paymentProof) {
            alert("Please upload payment proof for bank transfer.");
            return;
        }

        let requestBody;
        if (paymentProof) {
            requestBody = new FormData();
            requestBody.append('payment_method', paymentMethod);
            requestBody.append('payment_proof', paymentProof);
        } else {
            requestBody = {
                payment_method: paymentMethod
            };
        }

        setSubmitting(true);
        axiosClient.post(`/rentals/${selectedRental.id}/payment`, requestBody)
            .then(() => {
                alert("Payment submitted successfully!");
                setSubmitting(false);
                closePaymentModal();
                // Refresh list
                window.location.reload();
            })
            .catch(err => {
                const response = err.response;
                if (response && response.data) {
                    alert(`Error: ${response.data.message}`);
                    if (response.data.errors) {
                        console.error(response.data.errors);
                    }
                } else {
                    alert("Failed to submit payment: " + err.message);
                }
                setSubmitting(false);
            });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Rental Requests</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && <tr><td colSpan="5" className="text-center p-8 text-gray-500">Loading your requests...</td></tr>}

                        {!loading && rentals.length === 0 && (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">You haven't made any rental requests yet.</td></tr>
                        )}

                        {!loading && rentals.map(rental => (
                            <tr key={rental.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {rental.car && <img className="h-10 w-10 rounded object-cover" src={rental.car.image || "https://placehold.co/100"} alt="" />}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900">{rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rental.start_date} <br /> to {rental.end_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                    ${rental.total_price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${rental.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                        ${rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${rental.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {rental.status.toUpperCase()}
                                        {rental.payment_status === 'completed' && " (PAID)"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {rental.status === 'approved' && rental.payment_status !== 'completed' && (
                                        <button
                                            onClick={() => openPaymentModal(rental)}
                                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAYMENT MODAL */}
            {selectedRental && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
                        <p className="mb-4 text-gray-600">Total Amount: <span className="font-bold text-black">${selectedRental.total_price}</span></p>

                        <form onSubmit={submitPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option value="">Select Method</option>
                                    <option value="banque">Bank Transfer (Virement)</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="espece">Cash (Espèce)</option>
                                </select>
                            </div>

                            {paymentMethod === 'banque' && (
                                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                                    <h3 className="font-bold text-blue-800 mb-2">Bank Details (RIB)</h3>
                                    <p className="text-sm text-blue-700 font-mono">
                                        Bank: CIH BANK<br />
                                        RIB: 123456789012345678901234<br />
                                        Name: RentaCar Ltd
                                    </p>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Payment Proof (Screenshot)</label>
                                        <input
                                            type="file"
                                            className="w-full border rounded p-1"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'cheque' && (
                                <div className="text-sm text-gray-600 italic">
                                    Please present your cheque at the agency upon vehicle pickup.
                                </div>
                            )}
                            {paymentMethod === 'espece' && (
                                <div className="text-sm text-gray-600 italic">
                                    You can pay in cash at the agency.
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={closePaymentModal} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                                    {submitting ? 'Submitting...' : 'Confirm Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}