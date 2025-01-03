import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface JSONInputProps {
  jsonInputs: string[];
  updateJsonInput: (index: number, value: string) => void;
  addJsonInput: () => void;
  removeJsonInput: (index: number) => void;
}

export default function JSONInput({
  jsonInputs,
  updateJsonInput,
  addJsonInput,
  removeJsonInput,
}: JSONInputProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>(
    new Array(jsonInputs.length).fill('')
  );

  const validateJSON = (index: number, value: string) => {
    try {
      JSON.parse(value);
      const newErrors = [...validationErrors];
      newErrors[index] = '';
      setValidationErrors(newErrors);
    } catch (error) {
      console.error(error);
      const newErrors = [...validationErrors];
      newErrors[index] = 'Invalid JSON';
      setValidationErrors(newErrors);
    }
    updateJsonInput(index, value);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">JSON Input</h2>
      {jsonInputs.map((input, index) => (
        <div key={index} className="mb-2">
          <Textarea
            value={input}
            onChange={(e) => validateJSON(index, e.target.value)}
            placeholder={`Enter JSON data ${index + 1}`}
            className="w-full p-2 border rounded"
          />
          {validationErrors[index] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors[index]}
            </p>
          )}
          {index > 0 && (
            <Button
              onClick={() => removeJsonInput(index)}
              variant="destructive"
              className="mt-2"
            >
              Remove Input
            </Button>
          )}
        </div>
      ))}
      <Button onClick={addJsonInput} className="mt-2">
        Add Another JSON Input
      </Button>
    </div>
  );
}
