/* src/views/Rentals.jsx */
import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useToast } from "../context/ToastContext";

function DocumentThumbnail({ userId, type, label, hasFile }) {
    const [imgUrl, setImgUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFull, setShowFull] = useState(false);

    const fetchDoc = () => {
        if (!hasFile || imgUrl) {
            if (imgUrl) setShowFull(true);
            return;
        }

        setLoading(true);
        axiosClient.get(`/users/${userId}/documents/${type}`, { responseType: 'blob' })
            .then(response => {
                const url = URL.createObjectURL(response.data);
                setImgUrl(url);
                setLoading(false);
                setShowFull(true);
            })
            .catch(err => {
                console.error(err);
                console.error(`Failed to load ${label}`);
                setLoading(false);
            });
    };

    return (
        <div className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-600">{label}</span>
                {hasFile ? (
                    <button
                        onClick={fetchDoc}
                        className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Loading...' : (imgUrl ? 'View' : 'Fetch & View')}
                    </button>
                ) : (
                    <span className="text-[10px] text-gray-400 italic">Not Uploaded</span>
                )}
            </div>

            {imgUrl && showFull && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-[110]"
                    onClick={() => setShowFull(false)}
                >
                    <div className="max-w-4xl max-h-full relative overflow-auto" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg"
                            onClick={() => setShowFull(false)}
                        >
                            &times;
                        </button>
                        <img src={imgUrl} alt={label} className="max-w-full h-auto rounded shadow-2xl transition-transform duration-300 hover:scale-105" />
                        <p className="text-white text-center mt-4 font-bold">{label}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Rentals() {
    const { success, error: showError, showConfirm } = useToast();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProofModal, setShowProofModal] = useState(false);
    const [selectedProofUrl, setSelectedProofUrl] = useState("");

    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        getRentals();
    }, []);

    const getRentals = () => {
        setLoading(true);
        axiosClient.get('/rentals') // Admin/Agent route
            .then(({ data }) => {
                setRentals(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const updateStatus = (id, newStatus) => {
        const labels = { approved: 'Approve', rejected: 'Reject', active: 'Activate', completed: 'Mark Returned', canceled: 'Cancel', returned: 'Mark Returned' };
        showConfirm({
            title: `${labels[newStatus] || newStatus} Rental`,
            message: `Are you sure you want to set this rental to "${newStatus}"?`,
            confirmText: labels[newStatus] || 'Confirm',
            variant: newStatus === 'rejected' ? 'danger' : 'warning',
            onConfirm: () => {
                axiosClient.put(`/rentals/${id}/status`, { status: newStatus })
                    .then(() => {
                        success(`Rental ${newStatus} successfully!`);
                        getRentals();
                    })
                    .catch(err => {
                        const response = err.response;
                        if (response && response.data) {
                            showError(response.data.message || response.statusText);
                        } else {
                            showError("Failed to update status.");
                        }
                    });
            }
        });
    };

    const [proofLoading, setProofLoading] = useState(false);

    const openProofModal = (rentalId) => {
        setProofLoading(true);
        setShowProofModal(true);
        setSelectedProofUrl(""); // Reset previous

        axiosClient.get(`/rentals/${rentalId}/payment-proof`, { responseType: 'blob' })
            .then(response => {
                const url = URL.createObjectURL(response.data);
                setSelectedProofUrl(url);
                setProofLoading(false);
            })
            .catch(err => {
                console.error(err);
                showError("Could not load proof image. It may have been deleted or access is denied.");
                setProofLoading(false);
                setShowProofModal(false);
            });
    };

    const closeProofModal = () => {
        if (selectedProofUrl && selectedProofUrl.startsWith('blob:')) {
            URL.revokeObjectURL(selectedProofUrl);
        }
        setShowProofModal(false);
        setSelectedProofUrl("");
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const downloadContract = (id) => {
        setLoading(true);
        axiosClient.get(`/rentals/${id}/pdf`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `rental-contract-${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error downloading PDF:", error);
                showError("Failed to download contract.");
                setLoading(false);
            });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Rental Requests Management</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && <tr><td colSpan="7" className="text-center p-8 text-gray-500">Loading requests...</td></tr>}

                        {!loading && rentals.map(rental => (
                            <tr key={rental.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{rental.user ? rental.user.name : 'Unknown User'}</div>
                                            <div className="text-xs text-gray-500">{rental.user?.email}</div>
                                        </div>
                                        {rental.user && (
                                            <button
                                                onClick={() => openUserModal(rental.user)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                                title="View Client Details"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {rental.car && <img className="h-10 w-10 rounded object-cover" src={rental.car.image || "https://placehold.co/100"} alt="" />}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{rental.car ? `${rental.car.brand} ${rental.car.model}` : 'Unknown Car'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rental.start_date} <br /> to {rental.end_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${rental.total_price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {rental.payment_method ? (
                                        <div>
                                            <span className="font-bold uppercase text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{rental.payment_method}</span>
                                            {rental.payment_proof && (
                                                <button
                                                    onClick={() => openProofModal(rental.id)}
                                                    className="ml-2 text-blue-600 underline text-xs block mt-1 hover:text-blue-800"
                                                >
                                                    View Proof
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${rental.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                        ${rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${rental.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                        ${rental.status === 'active' ? 'bg-purple-100 text-purple-800' : ''}
                                        ${rental.status === 'completed' ? 'bg-teal-100 text-teal-800' : ''}
                                        ${rental.status === 'canceled' ? 'bg-orange-100 text-orange-800' : ''}
                                    `}>
                                        {rental.status === 'completed' ? 'RETURNED' : rental.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex flex-col items-end space-y-2">
                                        {/* Status Actions */}
                                        {/* Pending: Approve or Reject */}
                                        {rental.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button onClick={() => updateStatus(rental.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Approve</button>
                                                <button onClick={() => updateStatus(rental.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Reject</button>
                                            </div>
                                        )}
                                        {/* Approved + Paid: Confirm Payment → Active */}
                                        {rental.status === 'approved' && rental.payment_status === 'completed' && (
                                            <button onClick={() => updateStatus(rental.id, 'active')} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Confirm Payment</button>
                                        )}
                                        {/* Approved + Not Paid: Waiting */}
                                        {rental.status === 'approved' && rental.payment_status !== 'completed' && (
                                            <span className="text-gray-500 italic text-xs">Waiting Payment</span>
                                        )}
                                        {/* Active: Mark as Returned → Completed (frees a car unit) */}
                                        {rental.status === 'active' && (
                                            <button onClick={() => updateStatus(rental.id, 'completed')} className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Mark Returned
                                            </button>
                                        )}
                                        {/* Completed: Show returned label */}
                                        {rental.status === 'completed' && (
                                            <span className="text-teal-600 italic text-xs flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Car Returned
                                            </span>
                                        )}

                                        {/* Download PDF Button */}
                                        {(rental.status === 'approved' || rental.status === 'active' || rental.status === 'completed') && (
                                            <button
                                                onClick={() => downloadContract(rental.id)}
                                                className="text-gray-600 hover:text-gray-900 flex items-center text-xs border border-gray-300 px-2 py-1 rounded bg-white hover:bg-gray-50"
                                                title="Download Contract PDF"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Contract
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Proof Modal */}
            {showProofModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[100]"
                    onClick={closeProofModal}
                >
                    <div
                        className="bg-white p-2 rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={closeProofModal}
                            className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-700 transition z-10"
                        >
                            &times;
                        </button>
                        {proofLoading ? (
                            <div className="w-64 h-64 flex flex-col items-center justify-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="text-gray-500 animate-pulse">Fetching secure image...</p>
                            </div>
                        ) : (
                            <img
                                src={selectedProofUrl}
                                alt="Payment Proof"
                                className="max-w-full h-auto rounded"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]" onClick={closeUserModal}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                            <h2 className="text-xl font-bold">Client Information</h2>
                            <button onClick={closeUserModal} className="text-white hover:text-gray-200 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize">{selectedUser.role} Account</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase">National ID (CIN)</label>
                                    <p className="text-sm font-medium text-gray-800">{selectedUser.cin || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase">Driver's License</label>
                                    <p className="text-sm font-medium text-gray-800">{selectedUser.permis || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                                    <p className="text-sm font-medium text-gray-800">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase">Email Address</label>
                                    <p className="text-sm font-medium text-gray-800 truncate" title={selectedUser.email}>{selectedUser.email}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase">Address</label>
                                <p className="text-sm font-medium text-gray-800">{selectedUser.address || 'No address provided'}</p>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-700 uppercase">Attached Documents</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <DocumentThumbnail
                                        userId={selectedUser.id}
                                        type="cin_recto"
                                        label="CIN Front (Recto)"
                                        hasFile={!!selectedUser.cin_recto_path}
                                    />
                                    <DocumentThumbnail
                                        userId={selectedUser.id}
                                        type="cin_verso"
                                        label="CIN Back (Verso)"
                                        hasFile={!!selectedUser.cin_verso_path}
                                    />
                                    <DocumentThumbnail
                                        userId={selectedUser.id}
                                        type="permis"
                                        label="Driver's License"
                                        hasFile={!!selectedUser.permis_path}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={closeUserModal}
                                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}