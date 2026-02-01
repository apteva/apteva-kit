// No direct imports needed 'react';
import { ButtonWidget } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';
import { cn } from '../../../utils';

interface ButtonProps {
  widget: ButtonWidget;
  onAction?: (action: ActionEvent) => void;
}

export function Button({ widget, onAction }: ButtonProps) {
  const { label, variant = 'primary', disabled = false } = widget.props;

  const variantClasses = {
    primary: 'bg-blue-500 !text-white hover:bg-blue-600',
    secondary: 'bg-neutral-500 !text-white hover:bg-neutral-600',
    outline: 'border-2 border-blue-500 !text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900',
    ghost: '!text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900',
  };

  return (
    <button
      onClick={() =>
        widget.actions?.[0] &&
        onAction?.({
          type: widget.actions[0].type,
          payload: widget.actions[0].payload,
          widgetId: widget.id,
          timestamp: new Date(),
        })
      }
      disabled={disabled}
      className={cn('px-4 py-2 rounded-lg font-medium transition-colors', variantClasses[variant], {
        'opacity-50 cursor-not-allowed': disabled,
      })}
    >
      {label}
    </button>
  );
}
