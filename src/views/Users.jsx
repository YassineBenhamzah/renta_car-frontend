/* src/views/Users.jsx */
import { useEffect, useState } from "react";
import axiosClient from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error, showConfirm } = useToast();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')
            .then(({ data }) => {
                setUsers(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (user) => {
        showConfirm({
            title: "Delete User",
            message: `Are you sure you want to delete ${user.name}? This action cannot be undone and will remove all their data.`,
            confirmText: "Delete User",
            variant: "danger",
            onConfirm: () => {
                axiosClient.delete(`/users/${user.id}`)
                    .then(() => {
                        success("User deleted successfully!");
                        getUsers();
                    })
                    .catch(err => {
                        const response = err.response;
                        if (response && response.data) {
                            error(response.data.message);
                        } else {
                            error("Failed to delete user.");
                        }
                    });
            }
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading && <tr><td colSpan="6" className="text-center p-8 text-gray-500">Loading users...</td></tr>}

                        {!loading && users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${user.role === 'admin' ? 'bg-red-100 text-red-800' : ''}
                                        ${user.role === 'agent' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${user.role === 'user' ? 'bg-green-100 text-green-800' : ''}
                                    `}>
                                        {user.role ? user.role.toUpperCase() : 'USER'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="text-red-600 hover:text-red-900 border border-red-200 hover:bg-red-50 px-3 py-1 rounded transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
