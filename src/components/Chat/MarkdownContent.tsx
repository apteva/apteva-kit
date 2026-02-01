import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// Check if URL points to an image
function isImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(url);
}

function parseInlineMarkdown(text: string, keyPrefix: string = ''): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Combined regex for inline elements:
  // 1. Images: ![alt](url)
  // 2. Links: [text](url)
  // 3. Bold: **text** or __text__
  // 4. Inline code: `code`
  const inlineRegex = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|(\*\*|__)(.+?)\5|`([^`]+)`/g;

  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined || match[2] !== undefined) {
      // Image: ![alt](url)
      const alt = match[1] || '';
      const src = match[2];
      result.push(
        <img
          key={`${keyPrefix}img${key++}`}
          src={src}
          alt={alt}
          className="apteva-md-img"
        />
      );
    } else if (match[3] !== undefined || match[4] !== undefined) {
      // Link: [text](url)
      const linkText = match[3];
      const href = match[4];

      // Check if link URL is an image - render as image instead
      if (isImageUrl(href)) {
        result.push(
          <img
            key={`${keyPrefix}img${key++}`}
            src={href}
            alt={linkText}
            className="apteva-md-img"
          />
        );
      } else {
        result.push(
          <a
            key={`${keyPrefix}a${key++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="apteva-md-link"
          >
            {linkText}
          </a>
        );
      }
    } else if (match[5] !== undefined) {
      // Bold: **text** or __text__
      result.push(<strong key={`${keyPrefix}b${key++}`}>{match[6]}</strong>);
    } else if (match[7] !== undefined) {
      // Inline code: `code`
      result.push(
        <code key={`${keyPrefix}code${key++}`} className="apteva-md-inline-code">
          {match[7]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check for headings (## or ###)
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      result.push(
        <h2 key={`h2${key++}`} className="apteva-md-h2">
          {parseInlineMarkdown(h2Match[1], `${key}`)}
        </h2>
      );
      i++;
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) {
      result.push(
        <h3 key={`h3${key++}`} className="apteva-md-h3">
          {parseInlineMarkdown(h3Match[1], `${key}`)}
        </h3>
      );
      i++;
      continue;
    }

    // Check for unordered list item (-, *, +)
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
    if (ulMatch) {
      const listItems: React.ReactNode[] = [];
      const indent = ulMatch[1].length;

      while (i < lines.length) {
        const itemMatch = lines[i].match(/^(\s*)([-*+])\s+(.*)$/);
        if (itemMatch && itemMatch[1].length === indent) {
          listItems.push(
            <li key={`li${key++}`} className="apteva-md-li">{parseInlineMarkdown(itemMatch[3], `${key}`)}</li>
          );
          i++;
        } else {
          break;
        }
      }

      result.push(
        <ul key={`ul${key++}`} className="apteva-md-ul">
          {listItems}
        </ul>
      );
      continue;
    }

    // Check for ordered list item (1., 2., etc.)
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const listItems: React.ReactNode[] = [];
      const indent = olMatch[1].length;

      while (i < lines.length) {
        const itemMatch = lines[i].match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (itemMatch && itemMatch[1].length === indent) {
          listItems.push(
            <li key={`li${key++}`} className="apteva-md-li">{parseInlineMarkdown(itemMatch[3], `${key}`)}</li>
          );
          i++;
        } else {
          break;
        }
      }

      result.push(
        <ol key={`ol${key++}`} className="apteva-md-ol">
          {listItems}
        </ol>
      );
      continue;
    }

    // Check for markdown table
    const tableMatch = line.match(/^\|(.+)\|$/);
    if (tableMatch && i + 1 < lines.length) {
      // Check if next line is separator (|---|---|)
      const separatorLine = lines[i + 1];
      const separatorMatch = separatorLine.match(/^\|([\s:-]+\|)+$/);

      if (separatorMatch) {
        // Parse header
        const headerCells = line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());

        // Skip header and separator lines
        i += 2;

        // Parse body rows
        const bodyRows: string[][] = [];
        while (i < lines.length) {
          const rowMatch = lines[i].match(/^\|(.+)\|$/);
          if (rowMatch) {
            const cells = lines[i].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
            bodyRows.push(cells);
            i++;
          } else {
            break;
          }
        }

        result.push(
          <div key={`table-wrapper${key++}`} className="apteva-md-table-wrapper">
            <table className="apteva-md-table">
              <thead>
                <tr>
                  {headerCells.map((cell, idx) => (
                    <th key={`th${idx}`} className="apteva-md-th">{parseInlineMarkdown(cell, `th${key}${idx}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr key={`tr${rowIdx}`}>
                    {row.map((cell, cellIdx) => (
                      <td key={`td${cellIdx}`} className="apteva-md-td">{parseInlineMarkdown(cell, `td${key}${rowIdx}${cellIdx}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Regular line - parse inline markdown and preserve line breaks
    if (line === '') {
      result.push(<br key={`br${key++}`} />);
    } else {
      result.push(
        <span key={`p${key++}`}>
          {parseInlineMarkdown(line, `${key}`)}
          {i < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }
    i++;
  }

  return result;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`apteva-md ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
}
