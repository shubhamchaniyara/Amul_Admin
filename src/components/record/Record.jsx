import React, { useState, useEffect } from 'react';
import { Package, FileText, TrendingUp, RefreshCw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const RecordModule = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // API Functions
  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/stocks');
      if (response.ok) {
        const result = await response.json();
        setRecords(result.stocks || []);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchStocks();
  }, []);


  return (
    <div className="w-full">
      <Toaster />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8 p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Stock Inventory</h1>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-8 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-8 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Stock Records</h2>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
              <tr>
                <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-2">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <span>Product Name</span>
                  </div>
                </th>
                <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    <span>Unit of Measure</span>
                  </div>
                </th>
                <th className="px-8 py-6 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center justify-end space-x-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <span>Quantity</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4">
                        <RefreshCw className="h-8 w-8 animate-spin text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-700">Loading Stock Records</h3>
                        <p className="text-slate-500">Loading data...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors duration-300">
                            {record.product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-emerald-100 to-teal-200 rounded-2xl px-4 py-2 shadow-md">
                          <span className="text-sm font-bold text-emerald-800">
                            {record.measurement.name}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl px-4 py-2 shadow-lg">
                          <span className="text-2xl font-bold text-white">
                            {record.quantity.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-full px-3 py-1 border border-slate-300">
                          <span className="text-xs text-slate-600 font-bold">units</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-full p-6">
                        <Package className="h-16 w-16 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-2">No Stock Records Found</h3>
                        <p className="text-slate-500 text-lg">No stock records available.</p>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
                        <p className="text-sm text-indigo-700 font-medium">
                          💡 Stock records are created automatically
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};

export default RecordModule;

