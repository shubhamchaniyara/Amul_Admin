import React, { useState, useMemo } from 'react';
import { Plus, Search, Package, Calendar, Trash2, X, Factory, Edit3, Save, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManufacturingModule = () => {
  const [manufacturingOrders, setManufacturingOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showProductDeleteConfirm, setShowProductDeleteConfirm] = useState(null);
  const [showDateDeleteConfirm, setShowDateDeleteConfirm] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Pagination and Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // API state
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
  
  // Helper function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    manufacturing_date: getCurrentDate(),
    products: [
      {
        id: Date.now(),
        product: '',
        uom: '',
        quantity: ''
      }
    ]
  });

  // Static data for dropdowns (fallback)
  const staticProducts = ['jeera', 'dhaniya', 'chana', 'tal', 'methi'];
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

  // API Functions
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

  const fetchManufactures = async (page = 1, filterStartDate = startDate, filterEndDate = endDate) => {
    try {
      setLoading(true);
      
      // Build query parameters
      let queryParams = `page=${page}&limit=10`;
      if (filterStartDate) {
        queryParams += `&startDate=${filterStartDate}`;
      }
      if (filterEndDate) {
        queryParams += `&endDate=${filterEndDate}`;
      }
      
      const response = await fetch(`http://localhost:5000/manufactures?${queryParams}`);
      if (response.ok) {
        const result = await response.json();
        const manufactures = result.manufactures || [];
        
        // Update pagination state
        setPagination(result.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0,
          limit: 10,
          hasNext: false,
          hasPrev: false
        });
        
        // Transform backend data to frontend format and group by date
        const ordersByDate = {};
        
        manufactures.forEach(manufacture => {
          const date = manufacture.manufacture_date;
          if (!ordersByDate[date]) {
            ordersByDate[date] = {
              id: `order-${date}`,
              manufacturing_date: date,
              products: []
            };
          }
          
          ordersByDate[date].products.push({
            id: manufacture.id,
            product: manufacture.product?.name || '',
            uom: manufacture.measurement?.name || '',
            quantity: manufacture.quantity
          });
        });
        
        const transformedOrders = Object.values(ordersByDate);
        setManufacturingOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching manufactures:', error);
      // Fallback to sample data
      setManufacturingOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const createManufacture = async (manufactureData) => {
    try {
      const response = await fetch('http://localhost:5000/manufactures/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manufactureData),
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to create manufacture');
      }
    } catch (error) {
      console.error('Error creating manufacture:', error);
      throw error;
    }
  };

  const updateManufacture = async (id, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/manufactures/${id}`, {
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
        throw new Error('Failed to update manufacture');
      }
    } catch (error) {
      console.error('Error updating manufacture:', error);
      throw error;
    }
  };

  const deleteManufacture = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/manufactures/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to delete manufacture');
      }
    } catch (error) {
      console.error('Error deleting manufacture:', error);
      throw error;
    }
  };

  // Initialize with API data
  React.useEffect(() => {
    fetchProducts();
    fetchMeasurements();
    fetchManufactures();
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

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        setLoading(true);
        await deleteManufacture(showDeleteConfirm);
        await fetchManufactures(); // Refresh the list
        setShowDeleteConfirm(null);
        toast.success('Manufacturing order deleted successfully!', {
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
        console.error('Error deleting manufacture:', error);
        toast.error('Error deleting manufacturing order. Please try again.', {
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
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleSubmit = async () => {
    const hasValidProducts = formData.products.every(p => 
      p.product && p.uom && p.quantity && parseInt(p.quantity) > 0
    );
    
    if (formData.manufacturing_date && hasValidProducts) {
      try {
        setLoading(true);
        
        // Create manufacture records for each product
        const manufacturePromises = formData.products.map(async (product) => {
          // Find product and measurement IDs
          const productObj = products.find(p => p.name === product.product) || 
                           staticProducts.find(p => p === product.product);
          const measurementObj = measurements.find(m => m.name === product.uom) || 
                               uomOptions.find(uom => uom === product.uom);
          
          if (!productObj || !measurementObj) {
            throw new Error(`Product or measurement not found: ${product.product}, ${product.uom}`);
          }
          
          const manufactureData = {
            product_id: productObj.id || 1, // fallback to 1 if no ID
            measurement_id: measurementObj.id || 1, // fallback to 1 if no ID
            manufacture_date: formData.manufacturing_date,
            quantity: parseInt(product.quantity)
          };
          
          return await createManufacture(manufactureData);
        });
        
        await Promise.all(manufacturePromises);
        
        // Refresh the manufactures list
        await fetchManufactures();
        
        // Reset form
        setFormData({
          manufacturing_date: getCurrentDate(),
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
        
        toast.success('Manufacturing order created successfully!', {
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
        console.error('Error creating manufacture:', error);
        toast.error('Error creating manufacturing order. Please try again.', {
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
    } else {
      toast.error('Please fill all required fields with valid data', {
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

  const updateProduct = async (orderId, productId, field, value) => {
    try {
      // Find the actual manufacture ID from the product
      const order = manufacturingOrders.find(o => o.id === orderId);
      const product = order?.products?.find(p => p.id === productId);
      
      if (product && product.id && typeof product.id === 'number') {
        // This is a real product from backend, update via API
        const updateData = {
          [field === 'product' ? 'product_id' : field === 'uom' ? 'measurement_id' : field]: 
            field === 'quantity' ? parseInt(value) || 0 : 
            field === 'product' ? products.find(p => p.name === value)?.id || 1 :
            field === 'uom' ? measurements.find(m => m.name === value)?.id || 1 :
            value
        };
        
        await updateManufacture(product.id, updateData);
        await fetchManufactures(); // Refresh the list
      } else {
        // This is a local product, update locally
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
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          fontWeight: '500',
        },
      });
    }
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

  const handleDateDeleteClick = (orderId) => {
    setShowDateDeleteConfirm(orderId);
  };

  const confirmDateDelete = async () => {
    if (!showDateDeleteConfirm) return;
    
    const orderId = showDateDeleteConfirm;
    
    try {
      const order = manufacturingOrders.find(o => o.id === orderId);
      if (!order || !order.products) return;
      
      // Delete all products for this date via API
      const deletePromises = order.products
        .filter(product => product.id && typeof product.id === 'number')
        .map(product => deleteManufacture(product.id));
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        await fetchManufactures(); // Refresh the list
        toast.success('All products for this date deleted successfully!', {
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
      } else {
        // No real products to delete, just remove locally
        setManufacturingOrders(prev => 
          prev.filter(order => order.id !== orderId)
        );
        toast.success('All products for this date deleted successfully!', {
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
      }
    } catch (error) {
      console.error('Error deleting all products for date:', error);
      toast.error('Error deleting products. Please try again.', {
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
      setShowDateDeleteConfirm(null);
    }
  };

  const cancelDateDelete = () => {
    setShowDateDeleteConfirm(null);
  };

  const handleProductDeleteClick = (orderId, productId) => {
    setShowProductDeleteConfirm({ orderId, productId });
  };

  const confirmProductDelete = async () => {
    if (!showProductDeleteConfirm) return;
    
    const { orderId, productId } = showProductDeleteConfirm;
    
    try {
      // Check if this is a real product from backend (has numeric ID)
      const order = manufacturingOrders.find(o => o.id === orderId);
      const product = order?.products?.find(p => p.id === productId);
      
      if (product && product.id && typeof product.id === 'number') {
        // This is a real product from backend, delete via API
        await deleteManufacture(product.id);
        await fetchManufactures(); // Refresh the list
        toast.success('Product deleted successfully!', {
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
      } else {
        // This is a local product, delete locally
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
        toast.success('Product deleted successfully!', {
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
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product. Please try again.', {
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
      setShowProductDeleteConfirm(null);
    }
  };

  const cancelProductDelete = () => {
    setShowProductDeleteConfirm(null);
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
    try {
      console.log('=== FILTER DEBUG ===');
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
      console.log('Total Orders:', manufacturingOrders?.length || 0);
      
      // Safety check for manufacturingOrders
      if (!manufacturingOrders || !Array.isArray(manufacturingOrders)) {
        console.log('No valid manufacturing orders data');
        return [];
      }
      
      // If no dates are set, return all orders
      if (!startDate && !endDate) {
        console.log('No filters applied - showing all orders');
        return manufacturingOrders;
      }
      
      const filtered = manufacturingOrders.filter(order => {
        if (!order || !order.manufacturing_date) {
          console.log(`Invalid order data:`, order);
          return false;
        }
        
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
    } catch (error) {
      console.error('Error in filteredOrders:', error);
      return [];
    }
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

  // Fetch data when filters change
  React.useEffect(() => {
    fetchManufactures(1, startDate, endDate);
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
    fetchManufactures(1, '', '');
  };

  return (
    <div className="w-full">
      <Toaster />
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
        {currentOrders && currentOrders.length > 0 ? (
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
                        </div>
                      )}
                      
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDateDeleteClick(order.id)}
                      className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white p-1.5 rounded-lg transition-colors duration-200"
                      title="Delete All Products for This Date"
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
                  {order.products && order.products.map((product) => (
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
                                {(products.length > 0 ? products : staticProducts).map(p => (
                                  <option key={p.id || p} value={p.name || p} className="capitalize">
                                    {p.name || p}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-3">
                              <select
                                defaultValue={product.uom}
                                onChange={(e) => updateProduct(order.id, product.id, 'uom', e.target.value)}
                                className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:ring-1 focus:ring-green-500"
                              >
                                {(measurements.length > 0 ? measurements : uomOptions).map(uom => (
                                  <option key={uom.id || uom} value={uom.name || uom}>
                                    {uom.name || uom}
                                  </option>
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
                                onClick={() => handleProductDeleteClick(order.id, product.id)}
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
                                onClick={() => handleProductDeleteClick(order.id, product.id)}
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
                <p className="text-slate-500 text-xl mb-2">No orders found</p>
                <p className="text-slate-400">Create your first order</p>
              </div>
              </div>
            )}
      </div>

      {/* Pagination */}
      {manufacturingOrders.length > 0 && pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchManufactures(pagination.currentPage - 1, startDate, endDate)}
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
                      onClick={() => fetchManufactures(page, startDate, endDate)}
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
                      onClick={() => fetchManufactures(pagination.totalPages, startDate, endDate)}
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
                onClick={() => fetchManufactures(pagination.currentPage + 1, startDate, endDate)}
                disabled={!pagination.hasNext}
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
              <h3 className="text-xl font-semibold text-slate-800">Create Order</h3>
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
                          {(products.length > 0 ? products : staticProducts).map(p => (
                            <option key={p.id || p} value={p.name || p} className="capitalize">
                              {p.name || p}
                            </option>
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
                          {(measurements.length > 0 ? measurements : uomOptions).map(uom => (
                            <option key={uom.id || uom} value={uom.name || uom}>
                              {uom.name || uom}
                            </option>
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
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Order'}
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
                <h3 className="text-lg font-semibold text-slate-800">Delete Order</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete this order? 
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

    {/* Product Delete Confirmation Modal */}
    {showProductDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Delete Product</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete this product?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelProductDelete}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmProductDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Date Delete Confirmation Modal */}
    {showDateDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Delete All Products for Date</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete ALL products for this manufacturing date? 
              This will remove all products associated with this date.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDateDelete}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDateDelete}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Delete All Products
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