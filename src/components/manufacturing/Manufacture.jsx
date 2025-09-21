import React, { useState, useMemo } from 'react';
import { Plus, Search, Package, Calendar, Trash2, X, Factory, Edit3, Save, XCircle } from 'lucide-react';

const ManufacturingModule = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Pagination and Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    manufacturing_date: new Date().toISOString().split('T')[0],
    products: [
      {
        id: Date.now(),
        product: '',
        uom: '',
        quantity: ''
      }
    ]
  });

  // Static data for dropdowns
  const products = ['jeera', 'dhaniya', 'chana', 'tal', 'methi'];
  const uomOptions = ['100gm', '250gm', '500gm', '1kg'];

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

  // Initialize with sample data
  React.useEffect(() => {
    if (manufacturingOrders.length === 0) {
      setManufacturingOrders(sampleOrders);
    }
  }, []);

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      manufacturing_date: e.target.value
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      products: updatedProducts
    }));
  };

  const addProductLine = () => {
    const newProduct = {
      id: Date.now() + Math.random(),
      product: '',
      uom: '',
      quantity: ''
    };
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const removeProductLine = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        products: updatedProducts
      }));
    }
  };

  const handleDeleteOrder = (orderId) => {
    setShowDeleteConfirm(orderId);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      setManufacturingOrders(prev => prev.filter(order => order.id !== showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleSubmit = () => {
    const hasValidProducts = formData.products.every(p => 
      p.product && p.uom && p.quantity && parseInt(p.quantity) > 0
    );
    
    if (formData.manufacturing_date && hasValidProducts) {
      // Check if an order already exists for this date
      const existingOrderIndex = manufacturingOrders.findIndex(
        order => order.manufacturing_date === formData.manufacturing_date
      );
      
      if (existingOrderIndex !== -1) {
        // Merge products into existing order
        const existingOrder = manufacturingOrders[existingOrderIndex];
        const newProducts = formData.products.map(p => ({
          ...p,
          id: Date.now() + Math.random(),
          quantity: parseInt(p.quantity)
        }));
        
        const updatedOrder = {
          ...existingOrder,
          products: [...existingOrder.products, ...newProducts]
        };
        
        setManufacturingOrders(prev => 
          prev.map((order, index) => 
            index === existingOrderIndex ? updatedOrder : order
          )
        );
      } else {
        // Create new order
      const newOrder = {
        id: Date.now(),
        manufacturing_date: formData.manufacturing_date,
        products: formData.products.map(p => ({
          ...p,
            quantity: parseInt(p.quantity)
          }))
      };
      
      setManufacturingOrders(prev => [newOrder, ...prev]);
      }
      
      // Reset form
      setFormData({
        manufacturing_date: new Date().toISOString().split('T')[0],
        products: [
          {
            id: Date.now(),
            product: '',
            uom: '',
            quantity: ''
          }
        ]
      });
      setIsModalOpen(false);
    } else {
      alert('Please fill all required fields with valid data');
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
    console.log('=== FILTER DEBUG ===');
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Total Orders:', manufacturingOrders.length);
    
    // If no dates are set, return all orders
    if (!startDate && !endDate) {
      console.log('No filters applied - showing all orders');
      return manufacturingOrders;
    }
    
    const filtered = manufacturingOrders.filter(order => {
      const orderDate = order.manufacturing_date;
      console.log(`Checking order ${order.id} with date: ${orderDate}`);
      
      let matches = true;
      
      if (startDate) {
        const startMatch = orderDate >= startDate;
        console.log(`  Start check: ${orderDate} >= ${startDate} = ${startMatch}`);
        matches = matches && startMatch;
      }
      
      if (endDate) {
        const endMatch = orderDate <= endDate;
        console.log(`  End check: ${orderDate} <= ${endDate} = ${endMatch}`);
        matches = matches && endMatch;
      }
      
      console.log(`  Final result: ${matches ? 'INCLUDED' : 'EXCLUDED'}`);
      return matches;
    });
    
    console.log('Filtered results:', filtered.length, 'orders');
    console.log('=== END FILTER DEBUG ===');
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-green-50 p-4">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 rounded-lg p-2">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Manufacturing Dashboard</h1>
                {/* <p className="text-slate-600">Manage your manufacturing orders and production</p> */}
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
            <div className="border-t border-slate-200 pt-4">
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
                {/* <div className="mt-1 text-xs text-slate-500">
                  Filter: {startDate || 'No start'} to {endDate || 'No end'}
                </div> */}
              </div>
            </div>
          )}
          </div>
          
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
                        {editingOrder === order.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              defaultValue={order.manufacturing_date}
                              onBlur={(e) => updateOrderDate(order.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateOrderDate(order.id, e.target.value);
                                }
                              }}
                              className="bg-white bg-opacity-90 text-slate-800 px-2 py-1 rounded text-sm font-semibold"
                              autoFocus
                            />
                            <button
                              onClick={stopEditingOrder}
                              className="text-white hover:text-green-200 transition-colors"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-semibold">{formatDate(order.manufacturing_date)}</p>
                            <button
                              onClick={() => startEditingOrder(order.id)}
                              className="text-white text-opacity-70 hover:text-opacity-100 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
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
                  
                  {/* Column Headers */}
                  <div className="grid grid-cols-12 gap-2 items-center mb-3 px-3 py-2 bg-slate-100 rounded-lg">
                    <div className="col-span-4">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Product</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Measurement</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Quantity</p>
                      </div>
                    <div className="col-span-3">
                      </div>
                    </div>
                    
                  <div className="space-y-3">
                    {order.products.map((product) => (
                      <div key={product.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="grid grid-cols-12 gap-2 items-center">
                          {editingProduct === `${order.id}-${product.id}` ? (
                            <>
                              <div className="col-span-4">
                                <select
                                  defaultValue={product.product}
                                  onChange={(e) => updateProduct(order.id, product.id, 'product', e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-green-500"
                                >
                                  {products.map(p => (
                                    <option key={p} value={p} className="capitalize">{p}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-3">
                                <select
                                  defaultValue={product.uom}
                                  onChange={(e) => updateProduct(order.id, product.id, 'uom', e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-green-500"
                                >
                                  {uomOptions.map(uom => (
                                    <option key={uom} value={uom}>{uom}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="number"
                                  defaultValue={product.quantity}
                                  onChange={(e) => updateProduct(order.id, product.id, 'quantity', e.target.value)}
                                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-green-500"
                                  min="0"
                                  step="1"
                                />
                              </div>
                              <div className="col-span-3 flex justify-end space-x-1">
                                <button
                                  onClick={stopEditingProduct}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 p-1 rounded transition-colors"
                                  title="Save"
                                >
                                  <Save className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteProductFromOrder(order.id, product.id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-span-4">
                                <p className="text-sm font-medium text-slate-800 capitalize">{product.product}</p>
                              </div>
                              <div className="col-span-3">
                                <p className="text-sm text-slate-600">{product.uom}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-slate-600">{product.quantity}</p>
                      </div>
                              <div className="col-span-3 flex justify-end space-x-1">
                                <button
                                  onClick={() => startEditingProduct(order.id, product.id)}
                                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteProductFromOrder(order.id, product.id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                      </div>
                            </>
                          )}
                    </div>
                  </div>
                    ))}
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
                  value={formData.manufacturing_date}
                  onChange={handleDateChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Products Section */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-slate-700">
                    Products *
                  </label>
                </div>

                <div className="space-y-4">
                  {formData.products.map((product, index) => (
                    <div key={product.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Product
                          </label>
                          <select
                            value={product.product}
                            onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          >
                            <option value="">Select Product</option>
                            {products.map(p => (
                              <option key={p} value={p} className="capitalize">{p}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Unit of Measure
                          </label>
                          <select
                            value={product.uom}
                            onChange={(e) => handleProductChange(index, 'uom', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            required
                          >
                            <option value="">Select UOM</option>
                            {uomOptions.map(uom => (
                              <option key={uom} value={uom}>{uom}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                            placeholder="0"
                            min="0"
                            step="1"
                            required
                          />
                        </div>

                        <div className="flex items-end">
                          {formData.products.length > 1 && (
                            <button
                              onClick={() => removeProductLine(index)}
                              className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
};

export default ManufacturingModule;