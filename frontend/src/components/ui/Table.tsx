import React from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (record: T) => void;
}

export function Table<T extends { id: string | number }>({ 
  data, 
  columns, 
  loading = false,
  onRowClick 
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-10 rounded mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-12 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column, index) => (
              <th 
                key={index}
                className="text-left py-3 px-4 font-semibold text-gray-700 text-sm"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr 
              key={record.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(record)}
            >
              {columns.map((column, index) => (
                <td key={index} className="py-3 px-4 text-sm text-gray-600">
                  {column.render 
                    ? column.render((record as any)[column.key], record)
                    : (record as any)[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}