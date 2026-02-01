import { useState } from 'react';
import { FormWidget, FormField } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';

interface FormProps {
  widget: FormWidget;
  onAction?: (action: ActionEvent) => void;
}

export function Form({ widget, onAction }: FormProps) {
  const { title, fields } = widget.props;

  // Initialize form state with default values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? (field.type === 'checkbox' ? false : '');
    });
    return initial;
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (widget.actions?.[0] && onAction) {
      onAction({
        type: widget.actions[0].type,
        payload: { ...widget.actions[0].payload, formData },
        widgetId: widget.id,
        timestamp: new Date(),
      });
    }
  };

  const renderField = (field: FormField) => {
    const baseInputClass =
      'w-full px-3 py-2 rounded-lg border transition-colors ' +
      'border-neutral-200 dark:border-neutral-600 ' +
      'bg-neutral-50 dark:bg-neutral-800 ' +
      '!text-neutral-900 dark:!text-neutral-100 ' +
      'placeholder-neutral-400 dark:placeholder-neutral-500 ' +
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    switch (field.type) {
      case 'text':
      case 'password':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClass}
          />
        );

      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
            className={baseInputClass}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={baseInputClass}
          >
            <option value="">{field.placeholder || 'Select...'}</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-blue-500 focus:ring-blue-500"
            />
            <span className="!text-neutral-700 dark:!text-neutral-300">{field.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  const submitAction = widget.actions?.find((a) => a.type === 'submit') || widget.actions?.[0];

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="p-4">
        {title && (
          <h3 className="!text-lg font-semibold !text-neutral-900 dark:!text-white mb-4">
            {title}
          </h3>
        )}

        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.name} className={field.type === 'checkbox' ? '' : 'space-y-1'}>
              {field.type !== 'checkbox' && (
                <label className="block !text-sm font-medium !text-neutral-600 dark:!text-neutral-400">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {submitAction && (
        <div className="px-4 pb-4">
          <button
            type="submit"
            className="px-3 py-1.5 !text-sm rounded-lg font-medium transition-colors bg-blue-500 !text-white hover:bg-blue-600"
          >
            {submitAction.label || 'Submit'}
          </button>
        </div>
      )}
    </form>
  );
}
