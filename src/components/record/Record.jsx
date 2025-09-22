import React from 'react';
import { Package, FileText, TrendingUp, BarChart3 } from 'lucide-react';

const RecordModule = () => {
  // Static data for products and their combinations
  const products = ['jeera', 'chana', 'dhaniya', 'methi'];
  const units = ['250gm', '500gm', '1kg'];
  
  // Generate cross join data
  const generateRecords = () => {
    const records = [];
    products.forEach(product => {
      units.forEach(unit => {
        // Generate random quantity between 10-100 for demonstration
        const quantity = Math.floor(Math.random() * 91) + 10;
        records.push({
          id: `${product}-${unit}`,
          product_name: product,
          unit_of_measure: unit,
          quantity: quantity
        });
      });
    });
    return records;
  };

  const records = generateRecords();

  // Calculate totals
  const totalRecords = records.length;
  const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0);
  const averageQuantity = Math.round(totalQuantity / totalRecords);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 rounded-lg p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Product Records</h1>
              <p className="text-slate-600">Inventory tracking and product management</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex items-center space-x-2 mb-1">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Records</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{totalRecords}</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Total Quantity</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{totalQuantity}</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center space-x-2 mb-1">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Average</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">{averageQuantity}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Product Inventory Records</h2>
          <p className="text-slate-600 text-sm mt-1">Complete product catalog with quantities and measurements</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Product Name</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Unit of Measure
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record, index) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg p-2">
                        <Package className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 capitalize">
                          {record.product_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Product #{index + 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-100 rounded-lg px-3 py-1">
                        <span className="text-sm font-medium text-slate-700">
                          {record.unit_of_measure}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-lg font-bold text-slate-800">
                        {record.quantity.toLocaleString()}
                      </span>
                      <div className="bg-slate-100 rounded-full px-2 py-1">
                        <span className="text-xs text-slate-600 font-medium">units</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      record.quantity > 50 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : record.quantity > 25 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {record.quantity > 50 ? 'In Stock' : record.quantity > 25 ? 'Low Stock' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {records.length} product records
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>Total Products: {products.length}</span>
              <span>•</span>
              <span>Total Units: {units.length}</span>
              <span>•</span>
              <span>Combinations: {records.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordModule;
