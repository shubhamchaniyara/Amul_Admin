import React, { useState } from 'react';
import { Search, Plus, Check, Calendar, Package, X, Clock, CheckCircle, Edit3, Save, RotateCcw } from 'lucide-react';

const CustomerSalesSystem = () => {
  const [records, setRecords] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  
  // Form state for adding new record
  const [formData, setFormData] = useState({
    customer: null,
    customerSearch: '',
    product_name: 'Jeera',
    unit: '100gm',
    quantity: 1,
    price: 50
  });

  // Sample customer data
  const customers = [
    { id: 1, shop_name: 'Keshav General Store' },
    { id: 2, shop_name: 'Kiran Trading Co.' },
    { id: 3, shop_name: 'Ketan Spices Hub' },
    { id: 4, shop_name: 'Ramesh Grocery' },
    { id: 5, shop_name: 'Suresh Market' },
    { id: 6, shop_name: 'Prakesh Store' }
  ];

  const products = ['Jeera', 'Dhaniya', 'Chana', 'Tal', 'Methi'];
  const units = ['100gm', '250gm', '500gm', '1kg'];

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.shop_name.toLowerCase().includes(formData.customerSearch.toLowerCase())
  );

  const openAddDialog = () => {
    setFormData({
      customer: null,
      customerSearch: '',
      product_name: 'Jeera',
      unit: '100gm',
      quantity: 1,
      price: 50
    });
    setShowAddDialog(true);
  };

  const closeAddDialog = () => {
    setShowAddDialog(false);
    setFormData({
      customer: null,
      customerSearch: '',
      product_name: 'Jeera',
      unit: '100gm',
      quantity: 1,
      price: 50
    });
  };

  const selectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer,
      customerSearch: ''
    }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRecord = () => {
    if (!formData.customer) return;

    const newRecord = {
      id: Date.now(),
      customer: formData.customer,
      product_name: formData.product_name,
      unit: formData.unit,
      quantity: formData.quantity,
      price: formData.price,
      total: formData.quantity * formData.price,
      create_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      delivered_date: null
    };

    setRecords([newRecord, ...records]);
    closeAddDialog();
  };

  const markAsDelivered = (id) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          status: 'delivered',
          delivered_date: new Date().toISOString().split('T')[0]
        };
      }
      return record;
    }));
    setShowConfirmDialog(null);
  };

  const markAsPending = (id) => {
    setRecords(records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          status: 'pending',
          delivered_date: null
        };
      }
      return record;
    }));
  };

  const startEditing = (record) => {
    setEditingRecord({ ...record });
  };

  const saveEdit = () => {
    if (editingRecord) {
      setRecords(records.map(record => 
        record.id === editingRecord.id ? editingRecord : record
      ));
      setEditingRecord(null);
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <Clock className="w-4 h-4 mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle className="w-4 h-4 mr-1" />
          Delivered
        </span>
      );
    }
  };

  return (
    <div className="w-full">

        {/* Sales Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Left Side - Add Record Button */}
            <div className="flex items-center mb-4 lg:mb-0 lg:ml-8">
              <button
                onClick={openAddDialog}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Record</span>
              </button>
            </div>
            
            {/* Right Side - Sales Info */}
            <div className="flex-1 lg:max-w-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-slate-500" />
                  <h2 className="text-lg font-semibold text-slate-800">Sales Records</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Order Records
            </h2>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-16 px-6">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No records yet</h3>
              <p className="text-slate-600">Start by adding your first customer order record</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {records.map((record, index) => (
                <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Customer & Product Info */}
                      <div>
                        {editingRecord?.id === record.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingRecord.customer.shop_name}
                              onChange={(e) => setEditingRecord(prev => ({
                                ...prev,
                                customer: { ...prev.customer, shop_name: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            />
                            <div className="flex space-x-2">
                              <select
                                value={editingRecord.product_name}
                                onChange={(e) => setEditingRecord(prev => ({ ...prev, product_name: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              >
                                {products.map(product => (
                                  <option key={product} value={product}>{product}</option>
                                ))}
                              </select>
                              <select
                                value={editingRecord.unit}
                                onChange={(e) => setEditingRecord(prev => ({ ...prev, unit: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              >
                                {units.map(unit => (
                                  <option key={unit} value={unit}>{unit}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-slate-800 mb-1">{record.customer.shop_name}</p>
                            <p className="text-sm text-slate-600">
                              {record.product_name} - {record.unit}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div>
                        {editingRecord?.id === record.id ? (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-slate-600 mb-1">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                value={editingRecord.quantity}
                                onChange={(e) => setEditingRecord(prev => ({ 
                                  ...prev, 
                                  quantity: parseInt(e.target.value) || 1,
                                  total: (parseInt(e.target.value) || 1) * prev.price
                                }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-600 mb-1">Price per Unit</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editingRecord.price}
                                onChange={(e) => setEditingRecord(prev => ({ 
                                  ...prev, 
                                  price: parseFloat(e.target.value) || 0,
                                  total: prev.quantity * (parseFloat(e.target.value) || 0)
                                }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600">Quantity & Price</p>
                            <p className="font-semibold text-slate-800">
                              {record.quantity} × ₹{record.price} = ₹{record.total.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Dates */}
                      <div>
                        <p className="text-sm text-slate-600">Created</p>
                        <p className="font-medium text-slate-800">
                          {new Date(record.create_date).toLocaleDateString()}
                        </p>
                        {record.delivered_date && (
                          <div className="mt-1">
                            <p className="text-sm text-slate-600">Delivered</p>
                            <p className="font-medium text-green-700">
                              {new Date(record.delivered_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-start">
                        {getStatusBadge(record.status)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {editingRecord?.id === record.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {record.status === 'pending' && (
                            <>
                              <button
                                onClick={() => startEditing(record)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => setShowConfirmDialog(record.id)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                              >
                                <Check className="w-4 h-4" />
                                Deliver
                              </button>
                            </>
                          )}
                          {record.status === 'delivered' && (
                            <button
                              onClick={() => markAsPending(record.id)}
                              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Mark Pending
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Record Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Dialog Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Record</h3>
                  <button
                    onClick={closeAddDialog}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer *
                  </label>
                  
                  {!formData.customer ? (
                    <>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search customer shop name..."
                          value={formData.customerSearch}
                          onChange={(e) => updateFormData('customerSearch', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>

                      {formData.customerSearch && (
                        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                          {filteredCustomers.map(customer => (
                            <div
                              key={customer.id}
                              onClick={() => selectCustomer(customer)}
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <span className="font-medium text-gray-900">{customer.shop_name}</span>
                            </div>
                          ))}
                          {filteredCustomers.length === 0 && (
                            <div className="p-3 text-gray-500 text-center">No customers found</div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Selected Customer</p>
                          <p className="font-semibold text-blue-900">{formData.customer.shop_name}</p>
                        </div>
                        <button
                          onClick={() => selectCustomer(null)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                {formData.customer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
                      <select
                        value={formData.product_name}
                        onChange={(e) => updateFormData('product_name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        {products.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>

                    {/* Unit Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                      <select
                        value={formData.unit}
                        onChange={(e) => updateFormData('unit', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Price per unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Total Display */}
                {formData.customer && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-700">
                        ₹{(formData.quantity * formData.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dialog Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeAddDialog}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addRecord}
                    disabled={!formData.customer}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Add Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delivery Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark as Delivered</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark this order as delivered? This will set today's date as the delivery date.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => markAsDelivered(showConfirmDialog)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CustomerSalesSystem;