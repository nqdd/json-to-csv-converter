'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import JSONInput from '@/components/JSONInput';
import ResultDisplay from '@/components/ResultDisplay';
import ConvertButton from '@/components/ConvertButton';

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
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('input');
  const hasSetDefaultColumns = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedColumns));
    }
  }, [selectedColumns]);

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
        console.error(error);
        // Ignore invalid JSON
      }
    });
    const sortedColumns = Array.from(columns).sort((a, b) =>
      a.localeCompare(b)
    );
    setAvailableColumns(sortedColumns);

    // Default select all columns if none are selected
    if (!hasSetDefaultColumns.current && selectedColumns.length === 0) {
      setSelectedColumns(sortedColumns);
    }
    hasSetDefaultColumns.current = true;
  }, [jsonInputs, selectedColumns.length]);

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
      const mergedData = jsonInputs.map((input) => JSON.parse(input)).flat();

      if (mergedData.length === 0) {
        throw new Error('No valid JSON data provided');
      }

      const keys =
        selectedColumns.length > 0 ? selectedColumns : availableColumns;

      let csv = keys.join(',') + '\n';

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
      setCurrentTab('result');
    } catch (err) {
      setError('Error converting JSON to CSV: ' + (err as Error).message);
      setCsvResult('');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-10xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        JSON to CSV Converter
      </h1>
      <Card>
        <CardContent className="p-6">
          <Tabs
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value)}
            defaultValue="input"
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">JSON Input</TabsTrigger>
              <TabsTrigger value="result">CSV Result</TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              <JSONInput
                jsonInputs={jsonInputs}
                updateJsonInput={updateJsonInput}
                addJsonInput={addJsonInput}
                removeJsonInput={removeJsonInput}
              />
            </TabsContent>
            <TabsContent value="result">
              <ResultDisplay
                csvResult={csvResult}
                error={error}
                availableColumns={availableColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
              />
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <ConvertButton onConvert={convertToCSV} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
