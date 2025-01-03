import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ColumnSelectorProps {
  jsonInputs: string[];
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

export default function ColumnSelector({
  jsonInputs,
  selectedColumns,
  setSelectedColumns,
}: ColumnSelectorProps) {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    const columns = new Set<string>();
    jsonInputs.forEach((input) => {
      try {
        const data = JSON.parse(input);
        if (Array.isArray(data)) {
          data.forEach((item) => {
            Object.keys(item).forEach((key) => columns.add(key));
          });
        } else {
          Object.keys(data).forEach((key) => columns.add(key));
        }
      } catch (error) {
        // Ignore invalid JSON
        console.error(error);
      }
    });
    const sortedColumns = Array.from(columns).sort((a, b) =>
      a.localeCompare(b)
    );
    setAvailableColumns(sortedColumns);

    // Default select all columns if none are selected
    if (selectedColumns.length === 0) {
      setSelectedColumns(sortedColumns);
    }
  }, [jsonInputs, selectedColumns.length, setSelectedColumns]);

  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== column));
    } else {
      setSelectedColumns(
        [...selectedColumns, column].sort((a, b) => a.localeCompare(b))
      );
    }
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns);
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Select Columns</h2>
      <div className="mb-2">
        <button
          onClick={handleSelectAll}
          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-2 py-1 bg-gray-500 text-white rounded"
        >
          Deselect All
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {availableColumns.map((column) => (
          <div key={column} className="flex items-center space-x-2">
            <Checkbox
              id={column}
              checked={selectedColumns.includes(column)}
              onCheckedChange={() => handleColumnToggle(column)}
            />
            <Label htmlFor={column}>{column}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
