import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredColumns = availableColumns.filter((column) =>
    column.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Select Columns</h2>
      <div className="flex space-x-2">
        <Button onClick={handleSelectAll} variant="outline" size="sm">
          Select All
        </Button>
        <Button onClick={handleDeselectAll} variant="outline" size="sm">
          Deselect All
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
        {filteredColumns.map((column) => (
          <div key={column} className="flex items-center space-x-2">
            <Checkbox
              id={column}
              checked={selectedColumns.includes(column)}
              onCheckedChange={() => handleColumnToggle(column)}
            />
            <Label htmlFor={column} className="text-sm">
              {column}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
