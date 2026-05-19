import React, { useState } from 'react';

const BookPitchAvailability: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="text-h1 font-h1 text-emerald-900">Book a Pitch</h2>
            <p className="text-body-lg text-on-surface-variant mt-1">Select a time slot at our premium facility.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex flex-col items-center px-4 border-x border-gray-100">
              <span className="text-label-caps text-on-surface-variant">MONDAY</span>
              <span className="text-h3 font-h3 text-emerald-900">Oct 14, 2024</span>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button className="ml-2 p-2 text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors">
              <span className="material-symbols-outlined">calendar_today</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-lg flex flex-wrap items-center gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-label-caps text-on-surface-variant">PITCH TYPE</span>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full border border-emerald-900 bg-emerald-50 text-emerald-900 text-sm font-button">All</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-on-surface-variant text-sm font-button hover:border-emerald-900 transition-colors">5-a-side</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-on-surface-variant text-sm font-button hover:border-emerald-900 transition-colors">7-a-side</button>
              <button className="px-4 py-1.5 rounded-full border border-gray-200 text-on-surface-variant text-sm font-button hover:border-emerald-900 transition-colors">11-a-side</button>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-white border border-gray-200"></div><span className="text-xs text-on-surface-variant font-medium">Available</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200"></div><span className="text-xs text-on-surface-variant font-medium">Booked</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200"></div><span className="text-xs text-on-surface-variant font-medium">Pending</span></div>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[140px_1fr] overflow-x-auto">
            {/* Pitch labels */}
            <div className="border-r border-gray-100 bg-gray-50/50 sticky left-0 z-20">
              <div className="h-16 border-b border-gray-200"></div>
              {[['Pitch 1','5-a-side • 4G'],['Pitch 2','5-a-side • 4G'],['Pitch 3','7-a-side • Hybrid'],['Pitch 4','11-a-side • Grass']].map(([name, sub], i) => (
                <div key={i} className={`h-24 ${i < 3 ? 'border-b' : ''} border-gray-100 flex flex-col justify-center px-6`}>
                  <span className="font-h3 text-sm text-emerald-900">{name}</span>
                  <span className="text-[10px] text-on-surface-variant font-label-caps">{sub}</span>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {/* Time header */}
              <div className="flex h-16 border-b border-gray-200 bg-white">
                {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00'].map(t => (
                  <div key={t} className="min-w-[120px] flex-1 border-r border-gray-100 flex items-center justify-center text-xs font-bold text-on-surface-variant">{t}</div>
                ))}
              </div>

              {/* Pitch 1 row */}
              <div className="flex h-24 border-b border-gray-100">
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 bg-red-50 flex items-center justify-center"><span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Reserved</span></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 bg-emerald-900 text-white flex items-center px-3 z-10">
                  <div className="flex flex-col"><span className="text-[10px] font-bold opacity-80">SELECTED</span><span className="text-[11px] font-bold">11:00 - 12:00</span></div>
                </div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 bg-amber-50 flex items-center justify-center"><span className="material-symbols-outlined text-amber-600/50 text-lg">history</span></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
              </div>

              {/* Pitch 2 row */}
              <div className="flex h-24 border-b border-gray-100">
                {[true,true,false,false,false,true,false,false].map((booked, i) => (
                  <div key={i} className={`min-w-[120px] flex-1 border-r border-gray-50 ${booked ? 'bg-red-50' : 'hover:bg-emerald-50/30 cursor-pointer transition-colors'}`} onClick={booked ? undefined : () => setShowModal(true)}></div>
                ))}
              </div>

              {/* Pitch 3 row */}
              <div className="flex h-24 border-b border-gray-100">
                {[false,false,true,true,true,true,false,false].map((booked, i) => (
                  <div key={i} className={`min-w-[120px] flex-1 border-r border-gray-50 ${booked ? 'bg-red-50' : 'hover:bg-emerald-50/30 cursor-pointer transition-colors'}`} onClick={booked ? undefined : () => setShowModal(true)}></div>
                ))}
              </div>

              {/* Pitch 4 row */}
              <div className="flex h-24">
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 bg-emerald-900/10 border-y border-emerald-900/20 flex items-center justify-center"><span className="text-[10px] font-bold text-emerald-900 uppercase">Your Group</span></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
                <div className="min-w-[120px] flex-1 border-r border-gray-50 hover:bg-emerald-50/30 cursor-pointer transition-colors" onClick={() => setShowModal(true)}></div>
              </div>

              {/* Current time line */}
              <div className="absolute top-0 bottom-0 left-[240px] w-[2px] bg-emerald-900/40 z-30 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected slot summary */}
        <div className="mt-lg grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-emerald-900 text-white rounded-xl p-6 flex justify-between items-center shadow-md">
            <div>
              <h4 className="font-h3 text-lg mb-1">Selected: Pitch 1</h4>
              <p className="text-emerald-100 text-sm">Mon, Oct 14 • 11:00 AM - 12:00 PM • 5-a-side (4G)</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-xs uppercase font-label-caps">Estimated Total</p>
              <p className="text-2xl font-h1">$45.00</p>
            </div>
          </div>
          <button
            className="bg-white border-2 border-emerald-900 text-emerald-900 rounded-xl font-button text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 group py-4"
            onClick={() => setShowModal(true)}
          >
            Continue to Booking
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>

        {/* Info cards */}
        <div className="mt-xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <img alt="Pitch View" className="w-full h-32 object-cover rounded-lg mb-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlueldWn2-ynvSklbbZiG4skzYmpRPkZ6MYzBcLP4-L91LE5rWB3RSTM3a-kWozlCPqUpB_mxHZ_AdmXtFKCyMdF70UV435jNYeQ8oBjsRC_Ys6pk1ZdxOoA-WmbLW0Fvb_W3VQbwG4hDZfsSwo7RWn4GuVloX3vIiLdWHM6neoDMD2KRnkI21LKynuukp_bvRb7XHcqVFnyoyHTMzQ1xscT8hsgiddMsrabq0k0TDSSHn8RrYG8VlmRbjmt6UyhtD7cqGxeF-z2c" />
            <span className="text-[10px] font-bold text-emerald-900 uppercase">Facility Note</span>
            <p className="text-sm font-medium mt-1">Water stations and changing rooms are located by Pitch 1.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg"><span className="material-symbols-outlined text-emerald-900">wb_sunny</span></div>
              <span className="text-sm font-bold text-emerald-900">Weather Forecast</span>
            </div>
            <p className="text-2xl font-h2">18°C</p>
            <p className="text-xs text-on-surface-variant">Clear skies expected all day. Perfect conditions for outdoor play.</p>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-6">
            <div className="flex-1">
              <h4 className="font-h3 text-emerald-900 mb-2">Member Rewards</h4>
              <p className="text-sm text-on-surface-variant mb-4">Book 5 more sessions this month to unlock "Gold Tier" discounts on all pitch rentals.</p>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-emerald-900 h-full w-2/3"></div></div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-emerald-900">10/15 Matches</span>
                <span className="text-[10px] font-bold text-on-surface-variant">5 left</span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-emerald-900">military_tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-md"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-lg bg-emerald-900 text-white flex justify-between items-start">
              <div>
                <h3 className="text-h3 font-h3 leading-tight">Confirm Booking</h3>
                <p className="text-xs text-emerald-200/80 font-medium">Review your booking details for Pitch 1</p>
              </div>
              <button className="text-white/60 hover:text-white transition-colors" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg space-y-md">
              <div className="flex items-center justify-between p-md bg-emerald-50 rounded-lg border border-emerald-100">
                <div>
                  <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TIME SLOT</p>
                  <p className="font-bold text-emerald-900">11:00 AM – 12:00 PM</p>
                  <p className="text-xs text-on-surface-variant">Mon, Oct 14 • Pitch 1 • 5-a-side (4G)</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-label-caps mb-xs">TOTAL</p>
                  <p className="font-bold text-emerald-900 text-xl">$45.00</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-[10px] font-bold text-gray-400 font-label-caps">Your Name</label>
                  <input className="w-full border border-gray-200 rounded-lg text-sm p-2 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" type="text" defaultValue="Marcus F." />
                </div>
                <div className="space-y-xs">
                  <label className="text-[10px] font-bold text-gray-400 font-label-caps">Payment Method</label>
                  <select className="w-full border border-gray-200 rounded-lg text-sm p-2 focus:border-primary outline-none">
                    <option>Wallet Credit</option>
                    <option>Cash at Facility</option>
                    <option>Credit Card</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-md pt-md">
                <button className="flex-1 px-6 py-3 border border-gray-200 rounded-lg font-button text-secondary hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  className="flex-[2] px-6 py-3 bg-emerald-900 text-white rounded-lg font-button shadow-lg hover:bg-emerald-800 active:scale-95 transition-all"
                  onClick={() => { setShowModal(false); setBookingConfirmed(true); }}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
            <div className="px-lg pb-lg">
              <div className="flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <span className="material-symbols-outlined text-emerald-700 text-sm mt-0.5">verified</span>
                <p className="text-[11px] text-emerald-800 leading-normal">Member discount applied. This booking complies with <span className="font-bold">Weekend Premium</span> pricing rules.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {bookingConfirmed && (
        <div className="fixed bottom-6 right-6 z-[70] bg-emerald-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
          <span className="material-symbols-outlined text-emerald-300">check_circle</span>
          <div>
            <p className="font-button text-sm">Booking Confirmed!</p>
            <p className="text-xs text-emerald-300">Pitch 1 • 11:00 AM – 12:00 PM • $45.00</p>
          </div>
          <button className="ml-4 text-emerald-400 hover:text-white" onClick={() => setBookingConfirmed(false)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPitchAvailability;
