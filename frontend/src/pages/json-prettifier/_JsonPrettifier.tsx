import React, { useEffect, useRef, useState } from 'react';

const JsonPrettifier: React.FC = () => {
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  const inputEditorRef = useRef<HTMLDivElement>(null);
  const outputEditorRef = useRef<HTMLDivElement>(null);
  const inputEditorInstanceRef = useRef<any>(null);
  const outputEditorInstanceRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !inputEditorRef.current || !outputEditorRef.current)
      return;

    const initEditors = async () => {
      try {
        const { default: JSONEditor } = await import('jsoneditor');
        await import('../../assets/jsoneditor.min.css');

        // Initialize input editor (code mode for user input)
        if (!inputEditorRef.current) return;
        inputEditorInstanceRef.current = new JSONEditor(
          inputEditorRef.current,
          {
            mode: 'code',
            onChangeText: (jsonString: string) => {
              handleInputChange(jsonString);
            },
            onError: (err: any) => {
              setError(err.message || 'Invalid JSON');
              setIsValid(false);
            },
            onValidationError: (errors: readonly any[]) => {
              if (errors.length > 0) {
                setError(errors[0].message || 'Validation error');
                setIsValid(false);
              } else {
                setError('');
                setIsValid(true);
              }
            },
          }
        );

        // Initialize output editor (view mode for formatted output)
        if (!outputEditorRef.current) return;
        outputEditorInstanceRef.current = new JSONEditor(
          outputEditorRef.current,
          {
            mode: 'view',
            enableSort: false,
            enableTransform: false,
          }
        );

        // Set initial sample JSON
        const sampleJson = {
          menu: {
            id: 'file',
            value: 'File',
            popup: {
              menuitem: [
                {
                  value: 'New',
                  onclick: 'CreateNewDoc()',
                },
                {
                  value: 'Open',
                  onclick: 'OpenDoc()',
                },
                {
                  value: 'Close',
                  onclick: 'CloseDoc()',
                },
              ],
            },
          },
        };

        inputEditorInstanceRef.current.set(sampleJson);
        formatAndDisplayJson(sampleJson);
      } catch (err) {
        console.error('Failed to initialize JSONEditor:', err);
      }
    };

    initEditors();

    return () => {
      if (inputEditorInstanceRef.current) {
        try {
          inputEditorInstanceRef.current.destroy();
        } catch (err) {
          // Ignore cleanup errors
        }
      }
      if (outputEditorInstanceRef.current) {
        try {
          outputEditorInstanceRef.current.destroy();
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isClient]);

  const handleInputChange = (jsonString: string) => {
    if (!jsonString.trim()) {
      setError('');
      setIsValid(null);
      if (outputEditorInstanceRef.current) {
        outputEditorInstanceRef.current.set({});
      }
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      setIsValid(true);
      setError('');
      formatAndDisplayJson(parsed);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON');
      setIsValid(false);
      if (outputEditorInstanceRef.current) {
        outputEditorInstanceRef.current.set({});
      }
    }
  };

  const formatAndDisplayJson = (json: any) => {
    if (outputEditorInstanceRef.current) {
      const formatted = JSON.stringify(json, null, indentSize);
      outputEditorInstanceRef.current.set(json);
    }
  };

  const handleIndentChange = (increment: boolean) => {
    const newIndent = increment ? indentSize + 1 : indentSize - 1;
    if (newIndent >= 1 && newIndent <= 8) {
      setIndentSize(newIndent);
      // Re-format the current JSON with new indent
      if (inputEditorInstanceRef.current && isValid) {
        try {
          const currentJson = inputEditorInstanceRef.current.get();
          formatAndDisplayJson(currentJson);
        } catch (err) {
          // Ignore errors during re-formatting
        }
      }
    }
  };

  const handleClear = () => {
    if (inputEditorInstanceRef.current) {
      inputEditorInstanceRef.current.set({});
    }
    if (outputEditorInstanceRef.current) {
      outputEditorInstanceRef.current.set({});
    }
    setError('');
    setIsValid(null);
  };

  const handleCopy = () => {
    if (outputEditorInstanceRef.current && isValid) {
      try {
        const currentJson = inputEditorInstanceRef.current?.get();
        if (currentJson) {
          const formatted = JSON.stringify(currentJson, null, indentSize);
          navigator.clipboard.writeText(formatted);
        }
      } catch (err) {
        // Ignore copy errors
      }
    }
  };

  if (!isClient) {
    return (
      <div className="json-prettifier max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            JSON Prettifier
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="json-prettifier max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          JSON Prettifier
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Real-time JSON formatting, validation, and error detection
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Left Panel - Input Editor */}
        <div className="xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Input JSON
            </label>
            <button
              onClick={handleClear}
              className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="relative">
            <div
              ref={inputEditorRef}
              className="h-96 border border-slate-300 rounded-lg dark:border-slate-600"
            />
            {isValid !== null && (
              <div className="mt-2 text-sm">
                {isValid ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Valid JSON
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Invalid JSON
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Controls */}
        <div className="xl:col-span-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Indent
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleIndentChange(false)}
                disabled={indentSize <= 1}
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                -
              </button>
              <span className="text-lg font-mono text-slate-900 dark:text-slate-100 min-w-[2rem] text-center">
                {indentSize}
              </span>
              <button
                onClick={() => handleIndentChange(true)}
                disabled={indentSize >= 8}
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
              spaces
            </span>
          </div>

          <div className="text-center">
            <button
              onClick={handleCopy}
              disabled={!isValid}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Copy Formatted
            </button>
          </div>
        </div>

        {/* Right Panel - Output Editor */}
        <div className="xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Formatted Output
            </label>
            {error && (
              <span className="text-sm text-red-600 dark:text-red-400">
                Error detected
              </span>
            )}
          </div>

          <div className="relative">
            <div
              ref={outputEditorRef}
              className="h-96 border border-slate-300 rounded-lg dark:border-slate-600"
            />
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <div className="font-medium mb-1">JSON Error:</div>
              <div className="text-sm">{error}</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
          About JSON Prettifier
        </h3>
        <div className="text-slate-600 dark:text-slate-400 space-y-2">
          <p>
            This enhanced JSON prettifier provides real-time formatting and
            validation using the powerful JSONEditor library. Features include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Real-time JSON validation as you type</li>
            <li>Instant formatting with customizable indentation</li>
            <li>Precise error location and detailed error messages</li>
            <li>Professional code editor with syntax highlighting</li>
            <li>Copy formatted JSON to clipboard</li>
            <li>Dynamic indent control (1-8 spaces)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JsonPrettifier;
