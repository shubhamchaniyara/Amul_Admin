import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, MapPin, Building, Phone, User, X, Edit3, Trash2, Check, XCircle, Menu, Package, FileText, ShoppingCart } from 'lucide-react';

const CustomerModule = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeMenu, setActiveMenu] = useState('customer');
  const [filters, setFilters] = useState({
    city: '',
    area_name: ''
  });
  
  const [formData, setFormData] = useState({
    shop_name: '',
    name: '',
    city: '',
    area_name: '',
    contact_no: ''
  });

  // Sample data for demonstration
  const sampleCustomers = [
    { id: 1, shop_name: 'Raj Electronics', name: 'Rajesh Patel', city: 'Surat', area_name: 'Varachha', contact_no: '9876543210' },
    { id: 2, shop_name: 'Modern Textiles', name: 'Amit Shah', city: 'Surat', area_name: 'Adajan', contact_no: '9876543211' },
    { id: 3, shop_name: 'City Mall', name: 'Priya Sharma', city: 'Ahmedabad', area_name: 'Satellite', contact_no: '9876543212' },
    { id: 4, shop_name: 'Tech Solutions', name: 'Kiran Modi', city: 'Surat', area_name: 'Varachha', contact_no: '9876543213' }
  ];

  // Initialize with sample data on first render
  React.useEffect(() => {
    if (customers.length === 0) {
      setCustomers(sampleCustomers);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For contact_no, only allow numeric input with max 10 digits
    if (name === 'contact_no') {
      // Remove any non-numeric characters and limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from affecting filters
    
    // Check if contact_no is provided and is valid (exactly 10 digits)
    const isContactValid = !formData.contact_no || (formData.contact_no.length === 10 && /^\d{10}$/.test(formData.contact_no));
    
    if (formData.shop_name && formData.city && isContactValid) {
      const newCustomer = {
        id: Date.now(),
        ...formData
      };
      setCustomers(prev => [...prev, newCustomer]);
      setFormData({
        shop_name: '',
        name: '',
        city: '',
        area_name: '',
        contact_no: ''
      });
      setIsModalOpen(false);
    } else if (formData.contact_no && formData.contact_no.length !== 10) {
      alert('Contact number must be exactly 10 digits');
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const cityMatch = !filters.city || 
        customer.city.toLowerCase().includes(filters.city.toLowerCase());
      const areaMatch = !filters.area_name || 
        customer.area_name.toLowerCase().includes(filters.area_name.toLowerCase());
      return cityMatch && areaMatch;
    });
  }, [customers, filters]);

  const clearFilters = () => {
    setFilters({ city: '', area_name: '' });
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    // Keep the modal open during editing
  };

  const handleSaveEdit = (customerId) => {
    if (editingCustomer.shop_name && editingCustomer.city) {
      const isContactValid = !editingCustomer.contact_no || (editingCustomer.contact_no.length === 10 && /^\d{10}$/.test(editingCustomer.contact_no));
      
      if (isContactValid) {
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId ? editingCustomer : customer
        ));
        setEditingCustomer(null);
      } else {
        alert('Contact number must be exactly 10 digits');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  };


  const handleDeleteCustomer = (customerId) => {
    setShowDeleteConfirm(customerId);
    setIsHistoryModalOpen(false);
  };

  const confirmDelete = (customerId) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const menuItems = [
    { id: 'customer', name: 'Customer', icon: Users, active: true },
    { id: 'manufacturing', name: 'Manufacturing', icon: Package, active: false },
    { id: 'record', name: 'Record', icon: FileText, active: false },
    { id: 'sell', name: 'Sell', icon: ShoppingCart, active: false }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 mb-6 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Amul Commodity</h1>
                
              </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex items-center space-x-1 bg-slate-100 rounded-2xl p-2 shadow-inner">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeMenu === item.id
                        ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:scale-105'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Left Side - Add Customer Button */}
            <div className="flex items-center mb-4 lg:mb-0 lg:ml-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add Customer</span>
              </button>
            </div>
            
            {/* Right Side - Filters */}
            <div className="flex-1 lg:max-w-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-slate-500" />
                  <h2 className="text-lg font-semibold text-slate-800">Filter Customers</h2>
                </div>
                {(filters.city || filters.area_name) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Filter by city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
                
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="area_name"
                    placeholder="Filter by area"
                    value={filters.area_name}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Customers ({filteredCustomers.length})
            </h2>
          </div>
          
          <div className="p-6">
            {filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredCustomers.map((customer) => (
                  <div 
                    key={customer.id} 
                    onClick={() => handleCustomerClick(customer)}
                    className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                  >

                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white bg-opacity-20 rounded-lg p-2">
                          <Building className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingCustomer?.id === customer.id ? (
                            <input
                              type="text"
                              value={editingCustomer.shop_name}
                              onChange={(e) => setEditingCustomer(prev => ({...prev, shop_name: e.target.value}))}
                              className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border-none outline-none text-lg font-semibold w-full"
                              placeholder="Shop name"
                            />
                          ) : (
                            <h3 className="font-semibold text-lg truncate">{customer.shop_name}</h3>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-lg p-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingCustomer?.id === customer.id ? (
                              <input
                                type="text"
                                value={editingCustomer.city}
                                onChange={(e) => setEditingCustomer(prev => ({...prev, city: e.target.value}))}
                                className="w-full px-2 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="City"
                              />
                            ) : (
                              <p className="font-medium text-slate-800 truncate">{customer.city}</p>
                            )}
                            <p className="text-xs text-slate-500">City</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 rounded-lg p-2">
                            <Building className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingCustomer?.id === customer.id ? (
                              <input
                                type="text"
                                value={editingCustomer.area_name || ''}
                                onChange={(e) => setEditingCustomer(prev => ({...prev, area_name: e.target.value}))}
                                className="w-full px-2 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Area"
                              />
                            ) : (
                              <p className="font-medium text-slate-800 truncate">{customer.area_name || 'Not specified'}</p>
                            )}
                            <p className="text-xs text-slate-500">Area</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="px-4 pb-4">
                      <div className="bg-slate-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors duration-200">
                        {editingCustomer?.id === customer.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-slate-500" />
                              <input
                                type="text"
                                value={editingCustomer.name || ''}
                                onChange={(e) => setEditingCustomer(prev => ({...prev, name: e.target.value}))}
                                className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Owner name"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <input
                                type="tel"
                                value={editingCustomer.contact_no || ''}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  setEditingCustomer(prev => ({...prev, contact_no: numericValue}));
                                }}
                                className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Contact number"
                                maxLength="10"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-slate-500" />
                              <span className="text-sm font-medium text-slate-700 truncate">{customer.name || 'Not specified'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">{customer.contact_no || 'Not provided'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No customers found</p>
                <p className="text-slate-400">Try adjusting your filters or add a new customer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Add New Customer</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter shop name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter owner name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter city"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  name="area_name"
                  value={formData.area_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter area name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter 10-digit contact number"
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  maxLength="10"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{selectedCustomer.shop_name}</h3>
                
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingCustomer?.id === selectedCustomer.id ? (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Cancel editing"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleSaveEdit(selectedCustomer.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Save changes"
                      >
                        <Check className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditCustomer(selectedCustomer)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Edit customer"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
                        title="Delete customer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeHistoryModal}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Customer Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h4>
                {editingCustomer?.id === selectedCustomer.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Shop Name *</label>
                        <input
                          type="text"
                          value={editingCustomer.shop_name}
                          onChange={(e) => setEditingCustomer(prev => ({...prev, shop_name: e.target.value}))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter shop name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Owner Name</label>
                        <input
                          type="text"
                          value={editingCustomer.name || ''}
                          onChange={(e) => setEditingCustomer(prev => ({...prev, name: e.target.value}))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter owner name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={editingCustomer.city}
                          onChange={(e) => setEditingCustomer(prev => ({...prev, city: e.target.value}))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter city"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Area</label>
                        <input
                          type="text"
                          value={editingCustomer.area_name || ''}
                          onChange={(e) => setEditingCustomer(prev => ({...prev, area_name: e.target.value}))}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter area name"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Number</label>
                        <input
                          type="tel"
                          value={editingCustomer.contact_no || ''}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setEditingCustomer(prev => ({...prev, contact_no: numericValue}));
                          }}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter 10-digit contact number"
                          maxLength="10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(selectedCustomer.id)}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedCustomer.shop_name}</p>
                        <p className="text-sm text-slate-600">Shop Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-lg p-2">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedCustomer.name || 'Not specified'}</p>
                        <p className="text-sm text-slate-600">Owner Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedCustomer.city}</p>
                        <p className="text-sm text-slate-600">City</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 rounded-lg p-2">
                        <Building className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedCustomer.area_name || 'Not specified'}</p>
                        <p className="text-sm text-slate-600">Area</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 rounded-lg p-2">
                        <Phone className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{selectedCustomer.contact_no || 'Not provided'}</p>
                        <p className="text-sm text-slate-600">Contact Number</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* History Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-indigo-100 rounded-lg p-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800">Transaction History</h4>
                </div>
                
                {/* Placeholder for history data */}
                <div className="text-center py-12">
                  <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <h5 className="text-lg font-medium text-slate-600 mb-2">No History Available</h5>
                  <p className="text-slate-500 mb-4">Transaction history will be displayed here once the backend is connected.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> This feature requires backend integration to fetch and display customer transaction history.
                    </p>
                  </div>
                </div>
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
                <div className="bg-red-100 rounded-full p-3">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Delete Customer</h3>
                  <p className="text-slate-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete this customer? All associated data will be permanently removed.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerModule;