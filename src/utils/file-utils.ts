/**
 * File utilities for converting files to base64 and creating content blocks
 */

export interface ContentBlock {
  type: 'text' | 'image' | 'document';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

/**
 * Convert a File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Determine the content block type based on file MIME type
 */
export function getContentBlockType(mimeType: string): 'image' | 'document' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  return 'document';
}

/**
 * Check if a file type is supported for upload
 */
export function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return supportedTypes.includes(file.type);
}

/**
 * Convert a File to a content block for the agent API
 */
export async function fileToContentBlock(file: File): Promise<ContentBlock> {
  const base64 = await fileToBase64(file);
  const blockType = getContentBlockType(file.type);

  return {
    type: blockType,
    source: {
      type: 'base64',
      media_type: file.type,
      data: base64,
    },
  };
}

/**
 * Convert multiple files to content blocks
 */
export async function filesToContentBlocks(files: FileList | File[]): Promise<ContentBlock[]> {
  const fileArray = Array.from(files);
  const blocks = await Promise.all(
    fileArray.map(file => fileToContentBlock(file))
  );
  return blocks;
}

/**
 * Build a structured message with text and file attachments
 */
export async function buildMessageWithAttachments(
  text: string,
  files?: FileList | File[]
): Promise<string | ContentBlock[]> {
  // If no files, return simple text
  if (!files || files.length === 0) {
    return text;
  }

  // Build content blocks array
  const blocks: ContentBlock[] = [];

  // Add text block first if there's text
  if (text.trim()) {
    blocks.push({ type: 'text', text: text.trim() });
  }

  // Convert files to content blocks
  const fileBlocks = await filesToContentBlocks(files);
  blocks.push(...fileBlocks);

  return blocks;
}

/**
 * Get a human-readable file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Maximum file size (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Validate file for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isSupportedFileType(file)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large: ${formatFileSize(file.size)} (max ${formatFileSize(MAX_FILE_SIZE)})` };
  }
  return { valid: true };
}
