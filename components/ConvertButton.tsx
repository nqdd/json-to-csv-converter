import { Button } from '@/components/ui/button';

interface ConvertButtonProps {
  onConvert: () => void;
}

export default function ConvertButton({ onConvert }: ConvertButtonProps) {
  return (
    <Button onClick={onConvert} className="mb-4">
      Convert to CSV
    </Button>
  );
}
