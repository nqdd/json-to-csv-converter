import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface ConvertButtonProps {
  onConvert: () => void;
}

export default function ConvertButton({ onConvert }: ConvertButtonProps) {
  return (
    <Button onClick={onConvert} className="w-full">
      <FileDown className="w-4 h-4 mr-2" />
      Convert to CSV
    </Button>
  );
}
