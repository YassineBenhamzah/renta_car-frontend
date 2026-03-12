import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirm, setConfirm] = useState(null);

    const addToast = useCallback((message, type = "success", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const success = useCallback((msg) => addToast(msg, "success"), [addToast]);
    const error = useCallback((msg) => addToast(msg, "error"), [addToast]);
    const warning = useCallback((msg) => addToast(msg, "warning"), [addToast]);
    const info = useCallback((msg) => addToast(msg, "info"), [addToast]);

    const showConfirm = useCallback(({ title, message, confirmText, cancelText, variant, onConfirm }) => {
        setConfirm({ title, message, confirmText: confirmText || "Confirm", cancelText: cancelText || "Cancel", variant: variant || "danger", onConfirm });
    }, []);

    const handleConfirm = () => {
        if (confirm?.onConfirm) confirm.onConfirm();
        setConfirm(null);
    };

    const handleCancel = () => setConfirm(null);

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = {
        success: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const styles = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-blue-500",
    };

    const confirmVariants = {
        danger: { bg: "bg-red-600 hover:bg-red-700", ring: "focus:ring-red-500" },
        warning: { bg: "bg-amber-600 hover:bg-amber-700", ring: "focus:ring-amber-500" },
        info: { bg: "bg-blue-600 hover:bg-blue-700", ring: "focus:ring-blue-500" },
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info, showConfirm }}>
            {children}

            {/* ═══ TOAST STACK ═══ */}
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto animate-slide-in-right"
                        style={{
                            animation: "slideInRight 0.35s cubic-bezier(0.21,1.02,0.73,1) forwards"
                        }}
                    >
                        <div className={`${styles[toast.type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm`}>
                            <div className="flex-shrink-0 bg-white/20 rounded-lg p-1.5">
                                {icons[toast.type]}
                            </div>
                            <p className="text-sm font-medium flex-grow">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 text-white/70 hover:text-white transition p-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ═══ CONFIRM MODAL ═══ */}
            {confirm && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={handleCancel}></div>

                    {/* Modal */}
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        style={{ animation: "scaleIn 0.2s cubic-bezier(0.21,1.02,0.73,1) forwards" }}
                    >
                        <div className="p-6">
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${confirm.variant === 'danger' ? 'bg-red-100 text-red-600' :
                                    confirm.variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {confirm.variant === 'danger' ? (
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                ) : (
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                )}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{confirm.title}</h3>
                            <p className="text-sm text-gray-500 text-center leading-relaxed">{confirm.message}</p>
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition text-sm"
                            >
                                {confirm.cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-5 py-2.5 ${confirmVariants[confirm.variant]?.bg || confirmVariants.danger.bg} text-white font-bold rounded-xl transition text-sm shadow-lg`}
                            >
                                {confirm.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ CSS ANIMATIONS ═══ */}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
