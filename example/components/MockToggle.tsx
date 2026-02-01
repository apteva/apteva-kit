interface MockToggleProps {
  useMock: boolean;
  onChange: (value: boolean) => void;
}

export function MockToggle({ useMock, onChange }: MockToggleProps) {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
            {useMock ? '🎭 Mock Mode' : '🌐 Live API'}
          </span>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            {useMock ? 'Using simulated responses' : 'Connecting to real API'}
          </p>
        </div>
        <button
          onClick={() => onChange(!useMock)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            useMock ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useMock ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
    </div>
  );
}
