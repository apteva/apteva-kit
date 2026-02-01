export interface Action {
  type: string;
  label: string;
  payload: any;
  handler: 'client' | 'server';
  loadingText?: string;
}

export interface ActionEvent {
  type: string;
  payload: any;
  widgetId?: string;
  timestamp: Date;
}
