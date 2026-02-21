import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-900 rounded-2xl shadow-[0_15px_50px_rgba(255,94,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-orange-500/50 w-full max-w-md md:max-w-lg lg:max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-orange-500/30 flex justify-between items-center bg-zinc-950 shrink-0">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider drop-shadow-sm">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-orange-500 hover:text-orange-400 p-2 rounded-lg hover:bg-orange-500/20 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
