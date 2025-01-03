import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TablePreview from './TablePreview';

interface ResultDisplayProps {
  csvResult: string;
  error: string;
}

export default function ResultDisplay({
  csvResult,
  error,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!csvResult) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">CSV Result</h2>
      <div className="mb-4">
        <TablePreview csvData={csvResult} />
      </div>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
        {csvResult}
      </pre>
      <div className="flex space-x-2">
        <Button onClick={copyToClipboard}>
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
        <Button onClick={downloadCSV}>Download CSV</Button>
      </div>
    </div>
  );
}
