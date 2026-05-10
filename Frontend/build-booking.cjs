const fs = require('fs');

const body = fs.readFileSync('booking_body.txt', 'utf8');

const tsx = `import React, { useState } from 'react';
import { history } from '@umijs/max';
import Sidebar from '@shared/components/Sidebar';

const BookingInterface: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleConfirmBooking = () => {
    setShowModal(false);
    setBookingConfirmed(true);
  };

  return (
    <>
      <Sidebar />
BODY_CONTENT
      {/* Booking Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-lg bg-emerald-900 text-white flex justify-between items-start">
              <div>
                <h3 className="text-h3 font-h3 leading-tight">Quick Confirm</h3>
                <p className="text-xs text-emerald-200/80 font-medium">Review booking details for Pitch 2</p>
              </div>
              <button className="text-white/60 hover:text-white transition-colors" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined" data-icon="close">close</span>
              </button>
            </div>
            <div className="p-lg space-y-md">
              <div className="flex items-center justify-between p-md bg-surface rounded-lg border border-outline-variant">
                <div>
                  <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TIME SLOT</p>
                  <p className="font-bold text-emerald-900">11:00 AM - 01:00 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TOTAL PRICE</p>
                  <p className="font-bold text-emerald-900">$120.00</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-[10px] font-bold text-gray-400 font-label-caps">Customer Name</label>
                  <input className="w-full border border-gray-200 rounded-lg text-sm p-2 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" type="text" defaultValue="Marcus Silva" />
                </div>
                <div className="space-y-xs">
                  <label className="text-[10px] font-bold text-gray-400 font-label-caps">Payment Method</label>
                  <select className="w-full border border-gray-200 rounded-lg text-sm p-2 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20">
                    <option>Wallet Credit</option>
                    <option>Cash at Facility</option>
                    <option>Credit Card</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-md pt-md">
                <button className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-button text-secondary hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="flex-[2] px-6 py-3 bg-primary text-on-primary rounded-lg font-button shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all" onClick={handleConfirmBooking}>Confirm Booking</button>
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
      )}

      {/* Success Toast */}
      {bookingConfirmed && (
        <div className="fixed bottom-6 right-6 z-[70] bg-emerald-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
          <span className="material-symbols-outlined text-emerald-300" data-icon="check_circle">check_circle</span>
          <div>
            <p className="font-button text-sm">Booking Confirmed!</p>
            <p className="text-xs text-emerald-300">Pitch 2 • 11:00 AM - 01:00 PM • $120.00</p>
          </div>
          <button className="ml-4 text-emerald-400 hover:text-white" onClick={() => setBookingConfirmed(false)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </>
  );
};

export default BookingInterface;
`;

// Replace BODY_CONTENT placeholder with real body (trimmed, sidebar removed, slots clickable)
let processedBody = body;

// Remove the static aside (will use <Sidebar /> instead)
processedBody = processedBody.replace(/<aside[\s\S]*?<\/aside>/i, '');

// Make grid cells clickable to open modal
processedBody = processedBody.replace(
  /className="border-r border-gray-100 hover:bg-primary\/5 transition-colors cursor-pointer"/g,
  'className="border-r border-gray-100 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setShowModal(true)}'
);
processedBody = processedBody.replace(
  /className="hover:bg-primary\/5 transition-colors cursor-pointer"/g,
  'className="hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => setShowModal(true)}'
);

// Make "New Booking" button open modal
processedBody = processedBody.replace(
  /(<button[^>]*bg-primary[^>]*active:scale-95[^>]*>)(\s*<span[^>]*data-icon="add"[^>]*>add<\/span>\s*New Booking\s*<\/button>)/,
  '<button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-lg font-button active:scale-95 transition-transform" onClick={() => setShowModal(true)}><span className="material-symbols-outlined text-sm" data-icon="add">add</span>New Booking</button>'
);

const final = tsx.replace('BODY_CONTENT', processedBody.trim());
fs.writeFileSync('src/pages/pitches/booking/index.tsx', final, 'utf8');
console.log('Done! Written to src/pages/pitches/booking/index.tsx');
