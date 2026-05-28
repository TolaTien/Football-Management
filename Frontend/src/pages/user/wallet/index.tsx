import React from 'react';

const WalletPage: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-h1 text-h1 text-emerald-900">Wallet & Payments</h2>
        <p className="text-gray-500 font-body-lg">Manage your credits and view transaction history.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-emerald-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-300 font-label-caps text-xs mb-2">AVAILABLE BALANCE</p>
              <h3 className="text-4xl font-h1 mb-8">$128.50</h3>
              <div className="flex gap-4">
                <button className="flex-1 bg-white text-emerald-900 py-3 rounded-xl font-button text-sm hover:bg-emerald-50 transition-colors">
                  Top Up
                </button>
                <button className="flex-1 bg-emerald-800 text-white py-3 rounded-xl font-button text-sm border border-emerald-700 hover:bg-emerald-700 transition-colors">
                  Withdraw
                </button>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 opacity-10">
              <span className="material-symbols-outlined text-[200px]">account_balance_wallet</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-h3 text-h3 text-emerald-900">Recent Transactions</h3>
              <button className="text-primary text-sm font-button hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { title: 'Pitch Booking - Pitch 1', date: 'Oct 14, 2024', amount: '-$45.00', status: 'Completed' },
                { title: 'Wallet Top Up', date: 'Oct 12, 2024', amount: '+$100.00', status: 'Completed' },
                { title: 'Match Fee - social', date: 'Oct 10, 2024', amount: '-$12.00', status: 'Completed' },
              ].map((tx, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.amount.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                      <span className="material-symbols-outlined">{tx.amount.startsWith('+') ? 'add_circle' : 'shopping_cart'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-emerald-900">{tx.title}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-900'}`}>{tx.amount}</p>
                    <p className="text-[10px] text-gray-400 font-label-caps">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
