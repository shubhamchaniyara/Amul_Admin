import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Calendar, Package, X, Clock, CheckCircle, Edit3, Save, RotateCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CustomerSalesSystem = () => {
  const [records, setRecords] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  
  // API state
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });
  
  // Form state for adding new record
  const [formData, setFormData] = useState({
    customer: null,
    customerSearch: '',
    product_id: null,
    measurement_id: null,
    quantity: 1,
    price: 50
  });

  // API Functions
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/customers/all');
      if (response.ok) {
        const result = await response.json();
        console.log('Customer API response:', result); // Debug log
        setCustomers(result.data || []);
      } else {
        console.error('Customer API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products');
      if (response.ok) {
        const result = await response.json();
        setProducts(result.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchMeasurements = async () => {
    try {
      const response = await fetch('http://localhost:5000/measurements');
      if (response.ok) {
        const result = await response.json();
        setMeasurements(result.measurements || []);
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
      setMeasurements([]);
    }
  };

  const fetchSales = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/sales?page=${page}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        setRecords(result.sales || []);
        
        // Update pagination state
        setPagination(result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 10,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData) => {
    try {
      const response = await fetch('http://localhost:5000/sales/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to create sale');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  };

  const updateSale = async (id, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/sales/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to update sale');
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  };

  const markSaleAsDelivered = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/sales/mark-delivered/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark sale as delivered');
      }
    } catch (error) {
      console.error('Error marking sale as delivered:', error);
      throw error;
    }
  };

  const revertSaleDelivery = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/sales/revert-delivery/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to revert sale delivery');
      }
    } catch (error) {
      console.error('Error reverting sale delivery:', error);
      throw error;
    }
  };

  const deleteSale = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/sales/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to delete sale');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  };

  // Initialize data
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchMeasurements();
    fetchSales();
  }, []);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.shopName.toLowerCase().includes(formData.customerSearch.toLowerCase())
  );

  // Debug logging
  console.log('Customers from API:', customers);
  console.log('Filtered customers:', filteredCustomers);
  console.log('Customer search term:', formData.customerSearch);

  const openAddDialog = () => {
    setFormData({
      customer: null,
      customerSearch: '',
      product_id: null,
      measurement_id: null,
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
      product_id: null,
      measurement_id: null,
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

  const addRecord = async () => {
    if (!formData.customer || !formData.product_id || !formData.measurement_id) {
      toast.error('Please fill all required fields', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#D97706',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
      return;
    }

    try {
      setLoading(true);
      
      const saleData = {
        customer_id: formData.customer.id,
        product_id: formData.product_id,
        measurement_id: formData.measurement_id,
        qty: formData.quantity,
        price: formData.price
      };

      await createSale(saleData);
      await fetchSales(); // Refresh the list
    closeAddDialog();
      
      toast.success('Sale record created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#059669',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Error creating sale record. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#DC2626',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (id) => {
    try {
      setLoading(true);
      await markSaleAsDelivered(id);
      await fetchSales(); // Refresh the list
      setShowConfirmDialog(null);
      
      toast.success('Sale marked as delivered successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#059669',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } catch (error) {
      console.error('Error marking sale as delivered:', error);
      
      // Check if it's an insufficient stock error
      if (error.message.includes('Insufficient stock')) {
        toast.error(error.message, {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#DC2626',
            color: '#fff',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        });
      } else {
        toast.error('Error marking sale as delivered. Please try again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#DC2626',
            color: '#fff',
            fontWeight: '500',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsPending = async (id) => {
    try {
      setLoading(true);
      await revertSaleDelivery(id);
      await fetchSales(); // Refresh the list
      
      toast.success('Sale reverted to pending successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#059669',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } catch (error) {
      console.error('Error reverting sale:', error);
      toast.error('Error reverting sale. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#DC2626',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (record) => {
    setEditingRecord({ 
      ...record, 
      customerSearch: '' // Initialize customer search field
    });
  };

  const saveEdit = async () => {
    if (!editingRecord) return;

    try {
      setLoading(true);
      
      const updateData = {
        customer_id: editingRecord.customer.id,
        product_id: editingRecord.product.id,
        measurement_id: editingRecord.measurement.id,
        qty: editingRecord.qty,
        price: editingRecord.price
      };

      await updateSale(editingRecord.id, updateData);
      await fetchSales(); // Refresh the list
      setEditingRecord(null);
      
      toast.success('Sale record updated successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#059669',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Error updating sale record. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#DC2626',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } finally {
      setLoading(false);
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
      <Toaster />

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
              <p className="text-slate-600">Add your first order</p>
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
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                                placeholder="Search customer shop name..."
                                value={editingRecord.customerSearch || ''}
                              onChange={(e) => setEditingRecord(prev => ({
                                ...prev,
                                  customerSearch: e.target.value
                                }))}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              />
                              {editingRecord.customerSearch && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                  {customers.filter(customer =>
                                    customer.shopName.toLowerCase().includes(editingRecord.customerSearch.toLowerCase())
                                  ).map(customer => (
                                    <div
                                      key={customer.id}
                                      onClick={() => setEditingRecord(prev => ({
                                        ...prev,
                                        customer: customer,
                                        customerSearch: ''
                                      }))}
                                      className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors text-sm"
                                    >
                                      <span className="font-medium text-gray-900">{customer.shopName}</span>
                                    </div>
                                  ))}
                                  {customers.filter(customer =>
                                    customer.shopName.toLowerCase().includes(editingRecord.customerSearch.toLowerCase())
                                  ).length === 0 && (
                                    <div className="p-2 text-gray-500 text-center text-sm">No customers found</div>
                                  )}
                                </div>
                              )}
                            </div>
                            {editingRecord.customer && !editingRecord.customerSearch && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs text-green-600 font-medium">Selected Customer</p>
                                    <p className="text-sm font-semibold text-green-900">{editingRecord.customer.shopName}</p>
                                  </div>
                                  <button
                                    onClick={() => setEditingRecord(prev => ({ 
                                      ...prev, 
                                      customer: null,
                                      customerSearch: ''
                                    }))}
                                    className="text-green-600 hover:text-green-800 font-medium text-xs"
                                  >
                                    Change
                                  </button>
                                </div>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <select
                                value={editingRecord.product.id}
                                onChange={(e) => setEditingRecord(prev => ({ 
                                  ...prev, 
                                  product: { ...prev.product, id: parseInt(e.target.value) }
                                }))}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              >
                                {products.map(product => (
                                  <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                              </select>
                              <select
                                value={editingRecord.measurement.id}
                                onChange={(e) => setEditingRecord(prev => ({ 
                                  ...prev, 
                                  measurement: { ...prev.measurement, id: parseInt(e.target.value) }
                                }))}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              >
                                {measurements.map(measurement => (
                                  <option key={measurement.id} value={measurement.id}>{measurement.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-slate-800 mb-1">{record.customer.shopName}</p>
                            <p className="text-sm text-slate-600">
                              {record.product.name} - {record.measurement.name}
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
                                value={editingRecord.qty}
                                onChange={(e) => setEditingRecord(prev => ({ 
                                  ...prev, 
                                  qty: parseInt(e.target.value) || 1,
                                  total_amount: (parseInt(e.target.value) || 1) * prev.price
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
                                  total_amount: prev.qty * (parseFloat(e.target.value) || 0)
                                }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-slate-600">Quantity & Price</p>
                            <p className="font-semibold text-slate-800">
                              {record.qty} × ₹{record.price} = ₹{record.total_amount.toFixed(2)}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Dates */}
                      <div>
                        <p className="text-sm text-slate-600">Created</p>
                        <p className="font-medium text-slate-800">
                          {new Date(record.created_date).toLocaleDateString()}
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

        {/* Pagination */}
        {records.length > 0 && pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total records)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchSales(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => fetchSales(page)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && (
                    <>
                      <span className="px-2 text-slate-400">...</span>
                      <button
                        onClick={() => fetchSales(pagination.totalPages)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          pagination.currentPage === pagination.totalPages
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => fetchSales(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Record Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Dialog Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Add Record</h3>
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
                              <span className="font-medium text-gray-900">{customer.shopName}</span>
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
                          <p className="font-semibold text-blue-900">{formData.customer.shopName}</p>
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
                        value={formData.product_id || ''}
                        onChange={(e) => updateFormData('product_id', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Unit Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                      <select
                        value={formData.measurement_id || ''}
                        onChange={(e) => updateFormData('measurement_id', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select Unit</option>
                        {measurements.map(measurement => (
                          <option key={measurement.id} value={measurement.id}>{measurement.name}</option>
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
                    disabled={!formData.customer || !formData.product_id || !formData.measurement_id || loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Creating...' : 'Add Record'}
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