import React from 'react';

interface QuickConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  pitchName: string;
  timeSlot: string;
  price: string;
}

export const QuickConfirmModal: React.FC<QuickConfirmModalProps> = ({ isOpen, onClose, pitchName, timeSlot, price }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-lg bg-emerald-900 text-white flex justify-between items-start">
          <div>
            <h3 className="text-h3 font-h3 leading-tight">Quick Confirm</h3>
            <p className="text-xs text-emerald-200/80 font-medium">Review booking details for {pitchName}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined" data-icon="close">close</span>
          </button>
        </div>
        
        <div className="p-lg space-y-md">
          <div className="flex items-center justify-between p-md bg-surface rounded-lg border border-outline-variant">
            <div>
              <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TIME SLOT</p>
              <p className="font-bold text-emerald-900">{timeSlot}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TOTAL PRICE</p>
              <p className="font-bold text-emerald-900">{price}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="text-[10px] font-bold text-gray-400 font-label-caps">Customer Name</label>
              <input className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" type="text" placeholder="e.g. Marco Verratti" />
            </div>
            <div className="space-y-xs">
              <label className="text-[10px] font-bold text-gray-400 font-label-caps">Payment Method</label>
              <select className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none">
                <option>Wallet Credit</option>
                <option>Cash at Facility</option>
                <option>Credit Card</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-md pt-md">
            <button onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-button text-secondary hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="flex-[2] px-6 py-3 bg-primary text-on-primary rounded-lg font-button shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
              Confirm Booking
            </button>
          </div>
        </div>
        
        <div className="px-lg pb-lg">
          <div className="flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            <span className="material-symbols-outlined text-emerald-700 text-sm mt-0.5" data-icon="verified">verified</span>
            <p className="text-[11px] text-emerald-800 leading-normal">This booking complies with the <span className="font-bold">Weekend Premium</span> pricing rules. Member discount applied.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
