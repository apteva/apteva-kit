import { useEffect } from 'react';
import { WidgetsProps } from '../../types/components';
import { WidgetRenderer } from './WidgetRenderer';
import { cn } from '../../utils';

export function Widgets({
  widgets,
  onAction,
  onWidgetMount,
  layout = 'stack',
  spacing = 'normal',
  columns = 3,
  className,
}: WidgetsProps) {
  useEffect(() => {
    widgets.forEach((widget) => {
      onWidgetMount?.(widget.id);
    });
  }, [widgets, onWidgetMount]);

  const layoutClasses = {
    stack: 'flex flex-col',
    grid: `grid grid-cols-1 md:grid-cols-${columns}`,
    masonry: 'columns-1 md:columns-2 lg:columns-3',
  };

  const spacingClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6',
  };

  return (
    <div className={cn(layoutClasses[layout], spacingClasses[spacing], className)}>
      {widgets.map((widget) => (
        <WidgetRenderer key={widget.id} widget={widget} onAction={onAction} />
      ))}
    </div>
  );
}
