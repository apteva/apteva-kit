import { useState, KeyboardEvent } from 'react';
import { PromptProps } from '../../types/components';
import { cn } from '../../utils';
import { aptevaClient } from '../../lib/apteva-client';

export function Prompt({
  agentId,
  placeholder = 'Enter your prompt...',
  initialValue = '',
  useMock = true,
  submitOn = 'button',
  debounceMs = 0,
  minLength = 0,
  maxLength,
  onSubmit,
  onResult,
  onChange,
  variant = 'inline',
  showSuggestions = false,
  className,
}: PromptProps) {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState(['Plan a trip', 'Write a description', 'Analyze data']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleSubmit = async () => {
    if (value.length < minLength) return;

    onSubmit?.(value);
    setIsLoading(true);

    try {
      if (useMock) {
        // MOCK MODE
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockResult = `Enhanced version: ${value} [AI-generated content]`;
        onResult?.(mockResult);
        setValue('');
      } else {
        // REAL API MODE
        const response = await aptevaClient.chat({
          agent_id: agentId,
          message: value,
        });
        onResult?.(response.message);
        setValue('');
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (submitOn === 'enter' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleBlur = () => {
    if (submitOn === 'blur' && value.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apteva-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
        />

        {submitOn === 'button' && (
          <button
            onClick={handleSubmit}
            disabled={isLoading || value.length < minLength}
            className="px-6 py-2 bg-apteva-500 text-white rounded-lg hover:bg-apteva-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Processing...' : 'Generate'}
          </button>
        )}
      </div>

      {maxLength && (
        <p className="text-xs text-neutral-500">
          {value.length} / {maxLength} characters
        </p>
      )}

      {showSuggestions && !value && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setValue(suggestion)}
              className="px-3 py-1 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <div className="w-4 h-4 border-2 border-apteva-500 border-t-transparent rounded-full animate-spin" />
          <span>AI is processing your request...</span>
        </div>
      )}
    </div>
  );
}
