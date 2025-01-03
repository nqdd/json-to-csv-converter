import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Download, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useVirtual } from 'react-virtual';

interface ResultDisplayProps {
  csvResult: string;
  error: string;
  availableColumns: string[];
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

export default function ResultDisplay({
  csvResult,
  error,
  availableColumns,
  selectedColumns,
  setSelectedColumns,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(csvResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    const blob = new Blob([csvResult], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  const rows = csvResult.trim().split('\n');
  const headers = rows[0].split(',');
  const data = rows.slice(1);

  const rowVirtualizer = useVirtual({
    size: data.length,
    parentRef,
    estimateSize: useCallback(() => 35, []),
    overscan: 5,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: headers.length,
    parentRef,
    estimateSize: useCallback(() => 200, []), // Update: Increased estimateSize for columns
    overscan: 5,
  });

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded">{error}</div>;
  }

  if (!csvResult) {
    return (
      <div className="text-gray-500 italic">
        No CSV result yet. Convert your JSON to see the result here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">CSV Result</h2>
      <div className="flex space-x-2 mb-4">
        <Button onClick={copyToClipboard} variant="outline">
          <Clipboard className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
        <Button onClick={downloadCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/3">
          <h3 className="text-lg font-semibold mb-2">Column Selection</h3>
          <div className="flex space-x-2 mb-2">
            <Button onClick={handleSelectAll} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={handleDeselectAll} variant="outline" size="sm">
              Deselect All
            </Button>
          </div>
          <div className="relative mb-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredColumns.map((column) => (
              <div key={column} className="flex items-center space-x-2 mb-1">
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
        <div className="w-2/3 overflow-x-auto">
          <div
            ref={parentRef}
            className="relative"
            style={{
              height: `400px`,
              width: `100%`,
              overflow: 'auto',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                width: `${columnVirtualizer.totalSize}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.virtualItems.map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  className={`absolute top-0 left-0 h-[35px] ${
                    virtualRow.index % 2 ? 'bg-gray-100' : 'bg-white'
                  }`}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {columnVirtualizer.virtualItems.map((virtualColumn) => (
                    <div
                      key={virtualColumn.index}
                      className="absolute top-0 left-0 h-full flex items-center px-2 border-b border-r overflow-hidden" // Update: Added overflow-hidden
                      style={{
                        width: `${virtualColumn.size}px`,
                        transform: `translateX(${virtualColumn.start}px)`,
                      }}
                    >
                      <span className="truncate">
                        {/* Update: Wrapped cell content in span with truncate class */}
                        {virtualRow.index === 0
                          ? headers[virtualColumn.index]
                          : data[virtualRow.index - 1].split(',')[
                              virtualColumn.index
                            ]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
