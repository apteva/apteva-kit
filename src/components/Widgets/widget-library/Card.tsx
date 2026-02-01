// No direct imports needed 'react';
import { CardWidget } from '../../../types/widgets';
import { ActionEvent } from '../../../types/actions';

interface CardProps {
  widget: CardWidget;
  onAction?: (action: ActionEvent) => void;
}

export function Card({ widget, onAction }: CardProps) {
  const { title, description, image, footer } = widget.props;

  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}

      <div className="p-4">
        <h3 className="!text-lg font-semibold !text-neutral-900 dark:!text-white">{title}</h3>
        {description && <p className="!text-neutral-600 dark:!text-neutral-400 mt-2">{description}</p>}
      </div>

      {(footer || (widget.actions && widget.actions.length > 0)) && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 flex justify-between items-center">
          {footer && <span className="!text-sm !text-neutral-600 dark:!text-neutral-400">{footer}</span>}

          {widget.actions && widget.actions.length > 0 && (
            <div className="flex gap-2">
              {widget.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onAction?.({
                      type: action.type,
                      payload: action.payload,
                      widgetId: widget.id,
                      timestamp: new Date(),
                    })
                  }
                  className="px-3 py-1.5 !text-sm rounded-lg font-medium transition-colors bg-blue-500 !text-white hover:bg-blue-600"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
