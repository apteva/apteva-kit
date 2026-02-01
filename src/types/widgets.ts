import { Action } from './actions';

export interface Widget {
  type: string;
  id: string;
  props: Record<string, any>;
  actions?: Action[];
  /** Additional data not displayed but captured via onWidgetRender */
  metadata?: Record<string, any>;
  /** Whether the widget is still receiving streaming data */
  isStreaming?: boolean;
}

export interface CardWidget extends Widget {
  type: 'card';
  props: {
    title: string;
    description?: string;
    image?: string;
    footer?: string;
  };
}

export interface ButtonWidget extends Widget {
  type: 'button';
  props: {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    disabled?: boolean;
  };
}

export interface ButtonGroupWidget extends Widget {
  type: 'button_group';
  props: {
    layout?: 'horizontal' | 'vertical';
    buttons: Array<{
      id: string;
      label: string;
      variant?: 'primary' | 'secondary' | 'outline';
    }>;
  };
}

export interface FormWidget extends Widget {
  type: 'form';
  props: {
    title?: string;
    fields: FormField[];
  };
}

export interface FormField {
  name: string;
  type: 'text' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: any;
}

export interface ListWidget extends Widget {
  type: 'list';
  props: {
    items: ListItem[];
  };
}

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
  backgroundColor?: string;
}

export interface ChartWidget extends Widget {
  type: 'chart';
  props: {
    chartType: 'line' | 'bar' | 'pie' | 'doughnut';
    title?: string;
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
      }>;
    };
  };
}

export interface MapWidget extends Widget {
  type: 'map';
  props: {
    center: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
      id: string;
      position: { lat: number; lng: number };
      title: string;
      icon?: string;
    }>;
  };
}

export interface ImageWidget extends Widget {
  type: 'image';
  props: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface FlowStep {
  id: string;
  label: string;
  description?: string;
  type?: string; // time, agent, email, slack, build, test, deploy, push, generate, review, analyze
  status?: 'pending' | 'active' | 'completed' | 'error' | 'skipped';
  color?: 'blue' | 'purple' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'orange'; // explicit color for proposal mode
}

export interface FlowWidget extends Widget {
  type: 'flow';
  props: {
    title: string;
    subtitle?: string; // e.g., "Tomorrow 9:00 AM", "Every Monday"
    icon?: string; // research, schedule, analyze, deploy
    steps: FlowStep[];
  };
}

export interface GalleryWidget extends Widget {
  type: 'gallery';
  props: {
    images: Array<{
      id: string;
      src: string;
      alt: string;
      caption?: string;
    }>;
    layout?: 'grid' | 'carousel';
  };
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableWidget extends Widget {
  type: 'table';
  props: {
    columns: TableColumn[];
    rows: Array<Record<string, any>>;
    caption?: string;
    compact?: boolean;
    striped?: boolean;
  };
}
