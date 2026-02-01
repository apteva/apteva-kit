import { Widget } from '../types/widgets';

export interface ParsedSegment {
  type: 'text' | 'widget' | 'widget_pending';
  content?: string;
  widget?: Widget & { isStreaming?: boolean };
  pendingType?: string; // Widget type being streamed
}

export interface ParsedContent {
  segments: ParsedSegment[];
  hasWidgets: boolean;
  hasPendingWidget: boolean;
}

/**
 * Types that support incremental item streaming
 */
const STREAMABLE_WIDGET_TYPES = ['list', 'table'];

/**
 * Parse complete items from a partial JSON array string
 * Returns array of parsed items and whether there's more coming
 */
function parsePartialItemsArray(partialJson: string): { items: any[]; isStreaming: boolean } {
  const items: any[] = [];
  let isStreaming = false;

  // Find the "items" array start
  const itemsMatch = partialJson.match(/"items"\s*:\s*\[/);
  if (!itemsMatch) {
    return { items, isStreaming: false };
  }

  const arrayStart = partialJson.indexOf('[', itemsMatch.index);
  if (arrayStart === -1) {
    return { items, isStreaming: true };
  }

  // Try to find complete objects within the array
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let objectStart = -1;

  for (let i = arrayStart + 1; i < partialJson.length; i++) {
    const char = partialJson[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && objectStart !== -1) {
        // Complete object found
        const objectJson = partialJson.slice(objectStart, i + 1);
        try {
          const item = JSON.parse(objectJson);
          // Ensure item has an id
          if (!item.id) {
            item.id = `item-${items.length}-${simpleHash(objectJson)}`;
          }
          items.push(item);
        } catch (e) {
          // Invalid JSON, skip
        }
        objectStart = -1;
      }
    } else if (char === ']' && depth === 0) {
      // Array closed - not streaming anymore
      isStreaming = false;
      break;
    }
  }

  // If we didn't find a closing bracket, we're still streaming
  if (depth > 0 || objectStart !== -1) {
    isStreaming = true;
  }

  // Check if array is still open (no closing ])
  const afterItems = partialJson.slice(arrayStart);
  const closingBracket = findMatchingBracket(afterItems, 0);
  if (closingBracket === -1) {
    isStreaming = true;
  }

  return { items, isStreaming };
}

/**
 * Simple hash function to generate stable IDs from content
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Find the matching closing bracket, handling nested brackets
 */
function findMatchingBracket(text: string, startIndex: number): number {
  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '[' || char === '{') {
      depth++;
    } else if (char === ']' || char === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1; // No match found
}

/**
 * Parse text content and extract widgets from @ui:type[{props}] syntax
 */
export function parseWidgetsFromText(text: string): ParsedContent {
  const segments: ParsedSegment[] = [];
  let hasWidgets = false;
  let hasPendingWidget = false;
  let currentIndex = 0;
  let pendingWidgetType: string | null = null;

  // First, check if there's an incomplete widget at the end
  let processText = text;
  const lastWidgetStart = text.lastIndexOf('@ui:');

  if (lastWidgetStart !== -1) {
    // Check if this last @ui: pattern is complete
    const afterStart = text.slice(lastWidgetStart);
    const typeMatch = afterStart.match(/^@ui:(\w+)/);

    if (typeMatch) {
      const widgetType = typeMatch[1];
      const bracketOpenIndex = afterStart.indexOf('[');

      if (bracketOpenIndex === -1) {
        // No opening bracket yet - incomplete, show skeleton
        processText = text.slice(0, lastWidgetStart);
        pendingWidgetType = widgetType;
        hasPendingWidget = true;
      } else {
        // Has opening bracket, check if it's closed
        const fullBracketStart = lastWidgetStart + bracketOpenIndex;
        const bracketEnd = findMatchingBracket(text, fullBracketStart);

        if (bracketEnd === -1) {
          // Bracket not closed - incomplete widget
          // For streamable types (list, table), try to parse partial items
          if (STREAMABLE_WIDGET_TYPES.includes(widgetType)) {
            const partialContent = text.slice(fullBracketStart + 1);
            const { items, isStreaming } = parsePartialItemsArray(partialContent);

            if (items.length > 0) {
              // We have some items! Show them (with streaming indicator only if items array is incomplete)
              processText = text.slice(0, lastWidgetStart);
              const widgetId = `widget-${widgetType}-streaming-${simpleHash(partialContent)}`;

              // Add text before if any
              const textBefore = processText.replace(/[\s:;\-–—\.]+$/g, '').trim();
              if (textBefore) {
                segments.push({ type: 'text', content: textBefore });
              }

              // Add the widget - only show streaming indicator if items array itself is incomplete
              segments.push({
                type: 'widget',
                widget: {
                  type: widgetType,
                  id: widgetId,
                  props: widgetType === 'table' ? { rows: items, columns: [] } : { items },
                  isStreaming // Use actual streaming state from items array parsing
                }
              });

              hasWidgets = true;
              hasPendingWidget = false; // We're showing real content, not skeleton
              processText = ''; // All text handled
            } else {
              // No items yet, show skeleton
              processText = text.slice(0, lastWidgetStart);
              pendingWidgetType = widgetType;
              hasPendingWidget = true;
            }
          } else {
            // Non-streamable widget, show skeleton
            processText = text.slice(0, lastWidgetStart);
            pendingWidgetType = widgetType;
            hasPendingWidget = true;
          }
        }
      }
    }
  }

  // Clean up trailing whitespace before pending widget
  if (hasPendingWidget) {
    processText = processText.replace(/[\s:;\-–—\.]+$/g, '');
  }

  // Pattern to find @ui:type[ starts
  const startPattern = /@ui:(\w+)\[/g;

  let match;
  while ((match = startPattern.exec(processText)) !== null) {
    const widgetType = match[1];
    const bracketStart = match.index + match[0].length - 1; // Position of '['

    // Find the matching ']'
    const bracketEnd = findMatchingBracket(processText, bracketStart);

    if (bracketEnd === -1) {
      // No matching bracket - shouldn't happen after pre-processing, but skip just in case
      continue;
    }

    // Extract the JSON content (everything between [ and ])
    const jsonContent = processText.slice(bracketStart + 1, bracketEnd);

    // Add text before the widget
    if (match.index > currentIndex) {
      const textContent = processText.slice(currentIndex, match.index).trim();
      if (textContent) {
        segments.push({
          type: 'text',
          content: textContent
        });
      }
    }

    // Parse and add the widget
    try {
      // Trim and normalize JSON content
      const trimmedJson = jsonContent.trim();
      const parsed = JSON.parse(trimmedJson);
      // Generate stable ID based on widget type and content
      const widgetId = `widget-${widgetType}-${simpleHash(trimmedJson)}`;

      // Extract metadata and actions fields to widget root, rest goes to props
      const { metadata, actions, ...props } = parsed;

      segments.push({
        type: 'widget',
        widget: {
          type: widgetType,
          id: widgetId,
          props,
          ...(actions && { actions }),
          ...(metadata && { metadata })
        }
      });
      hasWidgets = true;
    } catch (e) {
      // JSON parsing failed - hide the raw syntax entirely
    }

    currentIndex = bracketEnd + 1;
    startPattern.lastIndex = currentIndex;
  }

  // Add remaining text (already cleaned of incomplete widgets)
  if (currentIndex < processText.length) {
    const remainingText = processText.slice(currentIndex).trim();
    if (remainingText) {
      segments.push({
        type: 'text',
        content: remainingText
      });
    }
  }

  // If no segments were created, use the processed text
  if (segments.length === 0 && processText.trim()) {
    segments.push({
      type: 'text',
      content: processText.trim()
    });
  }

  // Add pending widget skeleton at the end if we detected one
  if (pendingWidgetType) {
    segments.push({
      type: 'widget_pending',
      pendingType: pendingWidgetType
    });
  }

  return { segments, hasWidgets, hasPendingWidget };
}

/**
 * Check if text contains any widget syntax
 */
export function containsWidgets(text: string): boolean {
  return /@ui:\w+\[/.test(text);
}

/**
 * Strip widget syntax from text, returning only plain text content
 */
export function stripWidgets(text: string): string {
  const parsed = parseWidgetsFromText(text);
  return parsed.segments
    .filter(s => s.type === 'text' && s.content)
    .map(s => s.content)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
