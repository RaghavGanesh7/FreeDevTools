import React, { useState } from "react";

const JsonPrettifier: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const formatJson = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter some JSON to format");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON format");
      setIsValid(false);
      setOutput("");
    }
  };

  const minifyJson = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter some JSON to minify");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON format");
      setIsValid(false);
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(null);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const valid = validateJson(value);
      setIsValid(valid);
      if (!valid) {
        setError("Invalid JSON format");
      } else {
        setError("");
      }
    } else {
      setIsValid(null);
      setError("");
    }
  };

  return (
    <div className="json-prettifier max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          JSON Prettifier
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Format, minify, and validate your JSON data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Indent Size:
            </label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 rounded-md bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Input JSON
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste your JSON here..."
              className={`w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-slate-100 ${
                isValid === null
                  ? "border-slate-300 dark:border-slate-600"
                  : isValid
                  ? "border-green-300 dark:border-green-600"
                  : "border-red-300 dark:border-red-600"
              }`}
            />
            {isValid !== null && (
              <div
                className={`mt-2 text-sm ${
                  isValid
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={formatJson}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Format
            </button>
            <button
              onClick={minifyJson}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Minify
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Output
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="Formatted or minified JSON will appear here..."
                className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
              />
              {output && (
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
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
            This tool helps you format, minify, and validate JSON data. It can
            be useful for:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Making JSON more readable with proper indentation</li>
            <li>Reducing file size by removing unnecessary whitespace</li>
            <li>Validating JSON syntax before using it in your applications</li>
            <li>Converting between different formatting styles</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JsonPrettifier;
