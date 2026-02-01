/**
 * Widget definitions for context injection
 */
export const WIDGET_DEFINITIONS = {
  card: {
    schema: 'title, description?, image?, footer?, actions?: [{type, label}]',
    example: '@ui:card[{"title": "Summary", "description": "Details here"}]'
  },
  list: {
    schema: 'items: [{id, title, subtitle?, description?, image?, metadata?: {any extra data}}], actions?: [{type, label}] - metadata is sent as action payload when clicked',
    example: '@ui:list[{"items": [{"id": "1", "title": "Item", "subtitle": "Info", "metadata": {"key": "value"}}]}]'
  },
  button_group: {
    schema: 'buttons: [{id, label, variant?}] - Use for standalone buttons only, NOT for form submits',
    example: '@ui:button_group[{"buttons": [{"id": "ok", "label": "OK"}]}]'
  },
  form: {
    schema: 'title?, fields: [{name, type: text|password|number|select|checkbox|textarea|date, label, required?, placeholder?, options?}], actions: [{type, label}] - Button is built-in via actions, do NOT add separate button',
    example: '@ui:form[{"title": "Settings", "fields": [{"name": "apiKey", "type": "password", "label": "API Key", "required": true}], "actions": [{"type": "save", "label": "Save"}]}]'
  },
  table: {
    schema: 'columns: [{key, label}], rows: [...], striped?, compact?',
    example: '@ui:table[{"columns": [{"key": "name", "label": "Name"}], "rows": [{"name": "A"}]}]'
  },
  image: {
    schema: 'src, alt, caption?',
    example: '@ui:image[{"src": "url", "alt": "desc"}]'
  },
  chart: {
    schema: 'chartType: line|bar|pie, data: {labels, datasets}',
    example: '@ui:chart[{"chartType": "bar", "data": {"labels": ["A"], "datasets": [{"label": "X", "data": [10]}]}}]'
  },
  flow: {
    schema: 'title, subtitle?, icon?: research|schedule|analyze|deploy|recurring|automation|data, steps: [{id, label, type?, color?: blue|purple|cyan|amber|emerald|rose|indigo|orange, status?: pending|active|completed|error|skipped}] - Horizontal pipeline. Use @label for agents. Types auto-detected from label.',
    example: '@ui:flow[{"title": "Deploy Pipeline", "icon": "deploy", "steps": [{"id": "1", "label": "Test", "color": "cyan"}, {"id": "2", "label": "Build", "color": "amber"}, {"id": "3", "label": "Deploy", "color": "rose"}]}]'
  }
} as const;

export type WidgetType = keyof typeof WIDGET_DEFINITIONS;

export const ALL_WIDGET_TYPES: WidgetType[] = Object.keys(WIDGET_DEFINITIONS) as WidgetType[];

// Widgets disabled from default context injection (still renderable if received)
const DISABLED_WIDGETS: WidgetType[] = ['flow'];
export const DEFAULT_WIDGET_TYPES: WidgetType[] = ALL_WIDGET_TYPES.filter(t => !DISABLED_WIDGETS.includes(t));

/**
 * Generate system prompt context describing available widgets
 */
export function generateWidgetContext(enabledWidgets?: WidgetType[]): string {
  const widgets = enabledWidgets || DEFAULT_WIDGET_TYPES;

  let context = `\n## UI Widgets
SYNTAX: @ui:type[{json}] - MUST use SQUARE BRACKETS [] around the JSON object.
CORRECT: @ui:list[{"items": [...]}]
WRONG: @ui:list{"items": [...]} (missing square brackets)

`;

  for (const type of widgets) {
    const def = WIDGET_DEFINITIONS[type];
    if (!def) continue;
    context += `${type}: ${def.schema} | ${def.example}\n`;
  }

  context += `\nPer-item "metadata" is sent as payload on action click.\n`;

  return context;
}

/**
 * Generate a compact version of widget context
 */
export function generateCompactWidgetContext(enabledWidgets?: WidgetType[]): string {
  const widgets = enabledWidgets || DEFAULT_WIDGET_TYPES;
  return `\nWidgets: @ui:type[{json}] - MUST use square brackets []. Example: @ui:list[{"items": [...]}]. Types: ${widgets.join(', ')}. Per-item "metadata" is sent as action payload.\n`;
}
