import React, { useState, useMemo } from 'react';
import { Plus, Search, Package, Calendar, Trash2, X, Factory, Edit3, Save, XCircle } from 'lucide-react';

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ManufacturingModule = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  
  // Pagination and Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    manufacture_date: new Date().toISOString().split('T')[0],
    product_id: '',
    measurement_id: '',
    quantity: ''
  });

  // Sample manufacturing orders for demonstration
  const sampleOrders = [
    {
      id: 1,
      manufacturing_date: '2024-12-15',
      products: [
        { id: 1, product: 'jeera', uom: '1kg', quantity: 10 },
        { id: 2, product: 'dhaniya', uom: '500gm', quantity: 20 }
      ]
    },
    {
      id: 2,
      manufacturing_date: '2024-12-16',
      products: [
        { id: 3, product: 'chana', uom: '250gm', quantity: 50 },
        { id: 4, product: 'tal', uom: '1kg', quantity: 5 },
        { id: 5, product: 'methi', uom: '100gm', quantity: 100 }
      ]
    },
    {
      id: 3,
      manufacturing_date: '2024-12-17',
      products: [
        { id: 6, product: 'jeera', uom: '500gm', quantity: 30 },
        { id: 7, product: 'dhaniya', uom: '1kg', quantity: 15 }
      ]
    },
    {
      id: 4,
      manufacturing_date: '2024-12-18',
      products: [
        { id: 8, product: 'chana', uom: '1kg', quantity: 25 },
        { id: 9, product: 'tal', uom: '500gm', quantity: 40 }
      ]
    },
    {
      id: 5,
      manufacturing_date: '2024-12-19',
      products: [
        { id: 10, product: 'methi', uom: '250gm', quantity: 60 },
        { id: 11, product: 'jeera', uom: '1kg', quantity: 35 }
      ]
    }
  ];

  // Fetch products and measurements from API
  const fetchProductsAndMeasurements = async () => {
    try {
      const [productsRes, measurementsRes] = await Promise.all([
        fetch('http://localhost:5000/products'),
        fetch('http://localhost:5000/measurements')
      ]);
      
      if (productsRes.ok && measurementsRes.ok) {
        const productsData = await productsRes.json();
        const measurementsData = await measurementsRes.json();
        setProducts(productsData.data || []);
        setMeasurements(measurementsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching products/measurements:', error);
    }
  };

  // Fetch manufacturing data from API
  const fetchManufacturingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/manufactures/all');
      if (response.ok) {
        const result = await response.json();
        setManufacturingOrders(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching manufacturing data:', error);
    }
  };

  // Initialize data on component mount
  React.useEffect(() => {
    fetchProductsAndMeasurements();
    fetchManufacturingData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteOrder = (orderId) => {
    setShowDeleteConfirm(orderId);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        const response = await fetch(`http://localhost:5000/manufactures/${showDeleteConfirm}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setToast({ message: 'Manufacturing record deleted successfully!', type: 'success' });
          setShowDeleteConfirm(null);
          // Refresh data
          fetchManufacturingData();
        } else {
          const error = await response.json();
          setToast({ message: `Error: ${error.message}`, type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting manufacturing record:', error);
        setToast({ message: 'Failed to delete manufacturing record. Please try again.', type: 'error' });
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleSubmit = async () => {
    if (formData.manufacture_date && formData.product_id && formData.measurement_id && formData.quantity) {
      try {
        const response = await fetch('http://localhost:5000/manufactures/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: parseInt(formData.product_id),
            measurement_id: parseInt(formData.measurement_id),
            manufacture_date: formData.manufacture_date,
            quantity: parseInt(formData.quantity)
          })
        });

        if (response.ok) {
          const result = await response.json();
          setToast({ message: 'Manufacturing record created successfully!', type: 'success' });
          // Reset form
          setFormData({
            manufacture_date: new Date().toISOString().split('T')[0],
            product_id: '',
            measurement_id: '',
            quantity: ''
          });
          setIsModalOpen(false);
          // Refresh data
          fetchManufacturingData();
        } else {
          const error = await response.json();
          setToast({ message: `Error: ${error.message}`, type: 'error' });
        }
      } catch (error) {
        console.error('Error creating manufacturing record:', error);
        setToast({ message: 'Failed to create manufacturing record. Please try again.', type: 'error' });
      }
    } else {
      setToast({ message: 'Please fill all required fields', type: 'error' });
    }
  };

  // Edit order functions
  const startEditingOrder = (orderId) => {
    setEditingOrder(orderId);
  };

  const stopEditingOrder = () => {
    setEditingOrder(null);
  };

  const updateOrderDate = (orderId, newDate) => {
    setManufacturingOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, manufacturing_date: newDate }
          : order
      )
    );
    setEditingOrder(null);
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this manufacturing order?')) {
      setManufacturingOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  // Edit product functions
  const startEditingProduct = (orderId, productId) => {
    setEditingProduct(`${orderId}-${productId}`);
  };

  const stopEditingProduct = () => {
    setEditingProduct(null);
  };

  const updateProduct = (orderId, productId, field, value) => {
    setManufacturingOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? {
              ...order,
              products: order.products.map(product => 
                product.id === productId 
                  ? { ...product, [field]: field === 'quantity' ? parseInt(value) || 0 : value }
                  : product
              )
            }
          : order
      )
    );
  };

  const addProductToOrder = (orderId) => {
    const newProduct = {
      id: Date.now() + Math.random(),
      product: 'jeera',
      uom: '100gm',
      quantity: 1
    };
    
    setManufacturingOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, products: [...order.products, newProduct] }
          : order
      )
    );
  };

  const deleteProductFromOrder = (orderId, productId) => {
    setManufacturingOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              products: order.products.filter(product => product.id !== productId)
            }
          : order
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    // If no dates are set, return all orders
    if (!startDate && !endDate) {
      return manufacturingOrders;
    }
    
    const filtered = manufacturingOrders.filter(order => {
      const orderDate = order.manufacture_date;
      
      let matches = true;
      
      if (startDate) {
        const startMatch = orderDate >= startDate;
        matches = matches && startMatch;
      }
      
      if (endDate) {
        const endMatch = orderDate <= endDate;
        matches = matches && endMatch;
      }
      
      return matches;
    });
    
    return filtered;
  }, [manufacturingOrders, startDate, endDate]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  
  console.log('Pagination debug:', {
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    filteredOrdersLength: filteredOrders.length,
    currentOrdersLength: currentOrders.length,
    recordsPerPage
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  // Reset currentPage if it exceeds totalPages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 rounded-lg p-2">
              <Factory className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Manufacturing Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Filter</span>
            </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
              <span>New Order</span>
          </button>
        </div>
      </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Date Range:</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={clearFilters}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Reset
              </button>
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Showing {filteredOrders.length} orders ({currentOrders.length} on this page)
              {(startDate || endDate) && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Filtered
                </span>
              )}
            </div>
          </div>
        )}
        
      {/* Manufacturing Orders List */}
      <div className="space-y-4">
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{formatDate(order.manufacture_date)}</p>
                      <p className="text-green-100 text-sm">Manufacturing Date</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white p-1.5 rounded-lg transition-colors duration-200"
                      title="Delete Order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
                  
              {/* Card Body - Products */}
              <div className="p-4">
                {/* Product Information */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Product</p>
                      <p className="text-sm font-medium text-slate-800">{order.product?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Measurement</p>
                      <p className="text-sm text-slate-600">{order.measurement?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Quantity</p>
                      <p className="text-sm text-slate-600">{order.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <Factory className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-xl mb-2">No manufacturing orders found</p>
              <p className="text-slate-400">Create your first manufacturing order to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">Create Manufacturing Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Manufacturing Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Manufacturing Date *
              </label>
              <input
                type="date"
                name="manufacture_date"
                value={formData.manufacture_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Product Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product *
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>

            {/* Measurement Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Measurement *
              </label>
              <select
                name="measurement_id"
                value={formData.measurement_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select Measurement</option>
                {measurements.map(measurement => (
                  <option key={measurement.id} value={measurement.id}>{measurement.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter quantity"
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Delete Manufacturing Order</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to permanently delete this manufacturing order? 
              All associated products and data will be lost.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default ManufacturingModule;