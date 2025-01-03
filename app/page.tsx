'use client';

import { useState, useEffect } from 'react';
import JSONInput from '@/components/JSONInput';
import ColumnSelector from '@/components/ColumnSelector';
import ConvertButton from '@/components/ConvertButton';
import ResultDisplay from '@/components/ResultDisplay';

const LOCAL_STORAGE_KEY = 'jsonToCsvSelectedColumns';

export default function JSONToCSVConverter() {
  const [jsonInputs, setJsonInputs] = useState<string[]>(['']);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedColumns = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedColumns ? JSON.parse(storedColumns) : [];
    }
    return [];
  });
  const [csvResult, setCsvResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedColumns));
    }
  }, [selectedColumns]);

  const addJsonInput = () => {
    setJsonInputs([...jsonInputs, '']);
  };

  const updateJsonInput = (index: number, value: string) => {
    const newInputs = [...jsonInputs];
    newInputs[index] = value;
    setJsonInputs(newInputs);
  };

  const removeJsonInput = (index: number) => {
    const newInputs = jsonInputs.filter((_, i) => i !== index);
    setJsonInputs(newInputs);
  };

  const convertToCSV = () => {
    try {
      // Merge all JSON inputs
      const mergedData = jsonInputs.map((input) => JSON.parse(input)).flat();

      if (mergedData.length === 0) {
        throw new Error('No valid JSON data provided');
      }

      // Get all unique keys from the merged data
      const allKeys = Array.from(new Set(mergedData.flatMap(Object.keys)));

      // Filter keys based on selected columns, or use all if none selected
      const keys = selectedColumns.length > 0 ? selectedColumns : allKeys;

      // Create CSV header
      let csv = keys.join(',') + '\n';

      // Add data rows
      csv += mergedData
        .map((row) => {
          return keys
            .map((key) => {
              let cell = row[key] === undefined ? '' : row[key];
              cell = cell === null ? '' : cell;
              if (typeof cell === 'object') cell = JSON.stringify(cell);
              if (typeof cell === 'string') cell = cell.replace(/"/g, '""');
              if (
                cell.toString().includes(',') ||
                cell.toString().includes('"') ||
                cell.toString().includes('\n')
              ) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(',');
        })
        .join('\n');

      setCsvResult(csv);
      setError('');
    } catch (err) {
      setError('Error converting JSON to CSV: ' + (err as Error).message);
      setCsvResult('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">JSON to CSV Converter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <JSONInput
            jsonInputs={jsonInputs}
            updateJsonInput={updateJsonInput}
            addJsonInput={addJsonInput}
            removeJsonInput={removeJsonInput}
          />
          <ColumnSelector
            jsonInputs={jsonInputs}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
          />
          <ConvertButton onConvert={convertToCSV} />
        </div>
        <div>
          <ResultDisplay csvResult={csvResult} error={error} />
        </div>
      </div>
    </div>
  );
}
