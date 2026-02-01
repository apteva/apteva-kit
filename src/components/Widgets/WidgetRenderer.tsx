// No direct imports needed 'react';
import { Widget } from '../../types/widgets';
import { ActionEvent } from '../../types/actions';
import { Card, List, Button, ButtonGroup, Table, Form, Image, Flow } from './widget-library';

interface WidgetRendererProps {
  widget: Widget;
  onAction?: (action: ActionEvent) => void;
}

export function WidgetRenderer({ widget, onAction }: WidgetRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'card':
        return <Card widget={widget as any} onAction={onAction} />;
      case 'list':
        return <List widget={widget as any} onAction={onAction} />;
      case 'button':
        return <Button widget={widget as any} onAction={onAction} />;
      case 'button_group':
        return <ButtonGroup widget={widget as any} onAction={onAction} />;
      case 'table':
        return <Table widget={widget as any} onAction={onAction} />;
      case 'form':
        return <Form widget={widget as any} onAction={onAction} />;
      case 'image':
        return <Image widget={widget as any} />;
      case 'flow':
        return <Flow widget={widget as any} />;
      default:
        return (
          <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">Unknown widget type: {widget.type}</p>
            <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(widget, null, 2)}</pre>
          </div>
        );
    }
  };

  return <div className="apteva-widget">{renderWidget()}</div>;
}
