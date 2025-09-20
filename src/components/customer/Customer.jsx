import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, MapPin, Building, Phone, User, X } from 'lucide-react';

const CustomerModule = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.shop_name && formData.name && formData.city && formData.area_name && formData.contact_no) {
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
                <p className="text-slate-600">Manage your customer database</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Search className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Filter Customers</h2>
            {(filters.city || filters.area_name) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="city"
                placeholder="Filter by city (e.g., Surat)"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50"
              />
            </div>
            
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="area_name"
                placeholder="Filter by area (e.g., Varachha)"
                value={filters.area_name}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50"
              />
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
          
          <div className="divide-y divide-slate-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.shop_name}</p>
                        <p className="text-sm text-slate-600">Shop Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-lg p-2">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-sm text-slate-600">Owner Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 rounded-lg p-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.city}</p>
                        <p className="text-sm text-slate-600">City</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 rounded-lg p-2">
                        <Building className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.area_name}</p>
                        <p className="text-sm text-slate-600">Area</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 rounded-lg p-2">
                        <Phone className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.contact_no}</p>
                        <p className="text-sm text-slate-600">Contact</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter owner name"
                  required
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
                  Area *
                </label>
                <input
                  type="text"
                  name="area_name"
                  value={formData.area_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter area name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter contact number"
                  required
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
    </div>
  );
};

export default CustomerModule;