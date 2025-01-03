import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">JSON Input</h2>
      {jsonInputs.map((input, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`json-input-${index}`}
              className="text-sm font-medium"
            >
              Input {index + 1}
            </label>
            {index > 0 && (
              <Button
                onClick={() => removeJsonInput(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
          <Textarea
            id={`json-input-${index}`}
            value={input}
            onChange={(e) => validateJSON(index, e.target.value)}
            placeholder={`Enter JSON data ${index + 1}`}
            className="min-h-[100px]"
          />
          {validationErrors[index] && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors[index]}
            </p>
          )}
        </div>
      ))}
      <Button onClick={addJsonInput} variant="outline" className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Input
      </Button>
    </div>
  );
}
