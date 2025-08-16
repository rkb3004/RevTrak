import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Package, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { SparePart } from '../../types';
import { inventoryAPI } from '../../services/api';

export const Inventory: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const sparePartsData = await inventoryAPI.getSpareParts();
        setSpareParts(sparePartsData);
      } catch (error) {
        console.error('Failed to load inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredParts = spareParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || part.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(spareParts.map(part => part.category)));
  const lowStockParts = spareParts.filter(part => part.stock <= part.minStock);

  const getStockStatus = (part: SparePart) => {
    if (part.stock === 0) return { variant: 'error' as const, text: 'OUT OF STOCK' };
    if (part.stock <= part.minStock) return { variant: 'warning' as const, text: 'LOW STOCK' };
    return { variant: 'success' as const, text: 'IN STOCK' };
  };

  const partColumns = [
    {
      key: 'name',
      title: 'Part Details',
      render: (value: string, record: SparePart) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{record.partNumber}</p>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (value: string) => (
        <Badge variant="default">{value}</Badge>
      )
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (value: number, record: SparePart) => {
        const status = getStockStatus(record);
        return (
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{value} units</p>
            <Badge variant={status.variant} size="sm">{status.text}</Badge>
          </div>
        );
      }
    },
    {
      key: 'location',
      title: 'Location',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'supplier',
      title: 'Supplier'
    }
  ];

  const suppliers = [
    { name: 'AutoParts Pro', rating: 4.8, totalParts: 150, deliveryTime: '2-3 days' },
    { name: 'QuickFix Supply', rating: 4.5, totalParts: 89, deliveryTime: '1-2 days' },
    { name: 'Premium Parts Ltd', rating: 4.9, totalParts: 76, deliveryTime: '3-5 days' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage spare parts, stock levels, and suppliers</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Part
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{spareParts.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{lowStockParts.length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${spareParts.reduce((sum, part) => sum + (part.price * part.stock), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {lowStockParts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Low Stock Alerts</span>
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockParts.map(part => (
              <div key={part.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{part.name}</p>
                    <p className="text-sm text-gray-500">{part.partNumber}</p>
                  </div>
                  <Badge variant="error" size="sm">
                    {part.stock} left
                  </Badge>
                </div>
                <div className="mt-2">
                  <Button size="sm" variant="outline">
                    Reorder Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Spare Parts Inventory</CardTitle>
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search parts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <Table
              data={filteredParts}
              columns={partColumns}
              loading={loading}
            />
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {suppliers.map((supplier, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(supplier.rating))}
                      </div>
                      <span className="text-sm text-gray-600">{supplier.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{supplier.totalParts} parts available</p>
                    <p>Delivery: {supplier.deliveryTime}</p>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Catalog
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};