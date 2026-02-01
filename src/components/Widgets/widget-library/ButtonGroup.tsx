import { ButtonGroupWidget } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';
import { cn } from '../../../utils';

interface ButtonGroupProps {
  widget: ButtonGroupWidget;
  onAction?: (action: ActionEvent) => void;
}

export function ButtonGroup({ widget, onAction }: ButtonGroupProps) {
  const { layout = 'horizontal', buttons } = widget.props;

  const variantClasses = {
    primary: 'bg-blue-500 !text-white hover:bg-blue-600',
    secondary: 'bg-neutral-200 dark:bg-neutral-700 !text-neutral-800 dark:!text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600',
    outline: 'border border-neutral-300 dark:border-neutral-600 !text-neutral-700 dark:!text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  };

  // Find action for a specific button by id
  const getActionForButton = (buttonId: string) => {
    return widget.actions?.find(action => action.payload?.buttonId === buttonId) || widget.actions?.[0];
  };

  return (
    <div
      className={cn(
        'flex gap-2',
        layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}
    >
      {buttons.map((button) => {
        const action = getActionForButton(button.id);
        return (
          <button
            key={button.id}
            onClick={() => {
              if (action) {
                onAction?.({
                  type: action.type,
                  payload: { ...action.payload, buttonId: button.id },
                  widgetId: widget.id,
                  timestamp: new Date(),
                });
              }
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              variantClasses[button.variant || 'secondary']
            )}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}
