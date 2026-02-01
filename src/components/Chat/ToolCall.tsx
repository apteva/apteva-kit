interface ToolCallProps {
  name: string;
  status: 'preparing' | 'running' | 'completed' | 'error';
  isReceiving?: boolean; // True when actively receiving chunks
  inputLength?: number; // Character count of tool input
  streamOutput?: string; // Accumulated output from tool_stream chunks
}

export function ToolCall({ name, status, isReceiving = false, inputLength = 0, streamOutput }: ToolCallProps) {
  if (status === 'preparing') {
    return (
      <div className="apteva-tool-card apteva-tool-card-preparing">
        <svg className="apteva-tool-icon apteva-tool-icon-spin" fill="none" viewBox="0 0 24 24">
          <circle className="apteva-tool-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="apteva-tool-spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="apteva-tool-label">
          <strong>{name}</strong>
          <span className="apteva-tool-status-text"> preparing...</span>
        </span>
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="apteva-tool-card apteva-tool-card-running">
        <svg className="apteva-tool-icon apteva-tool-icon-spin" fill="none" viewBox="0 0 24 24">
          <circle className="apteva-tool-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="apteva-tool-spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="apteva-tool-label">
          <strong>{name}</strong>
          {streamOutput ? (
            <span className="apteva-tool-stream-separator"> · </span>
          ) : null}
          {streamOutput ? (
            <span className="apteva-tool-stream-output">{streamOutput}</span>
          ) : (
            <>
              <span className="apteva-tool-status-text"> running</span>
              <span className="apteva-tool-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </>
          )}
        </span>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="apteva-tool-card apteva-tool-card-completed">
        <svg className="apteva-tool-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
        </svg>
        <span className="apteva-tool-label">{name}</span>
      </div>
    );
  }

  // Error state
  return (
    <div className="apteva-tool-card apteva-tool-card-error">
      <svg className="apteva-tool-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <span className="apteva-tool-label">{name} failed</span>
    </div>
  );
}
