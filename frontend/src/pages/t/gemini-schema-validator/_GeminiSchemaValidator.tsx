import React, { useState, useEffect } from "react";
import ToolContainer from "@/components/tool/ToolContainer";
import ToolHead from "@/components/tool/ToolHead";
import GeminiSchemaValidatorSkeleton from "./_GeminiSchemaValidatorSkeleton";
import CopyButton from "@/components/ui/copy-button";
import { toast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/button";

const GeminiSchemaValidator: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleProcess = () => {
    setError("");
    toast.info("Processing your input...");
    try {
      // TODO: Implement your tool logic here
      setOutput("Processed result will appear here...");
      toast.success("Processing completed!");
    } catch (err) {
      setError("An error occurred while processing");
      setOutput("");
      toast.error("Processing failed");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <ToolContainer>
      <ToolHead
        name="Gemini Schema Validator"
        description="TODO: Add your tool description here. Make it compelling and SEO-friendly."
      />
      
      {!loaded ? (
        <GeminiSchemaValidatorSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Input
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your input here..."
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleProcess}
                  className="flex-1"
                  disabled={!input.trim()}
                >
                  Process
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Output
                  </label>
                  {output && (
                    <CopyButton
                      text={output}
                      className="ml-3"
                      title="Copy to clipboard"
                    />
                  )}
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
                />
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
              About Gemini Schema Validator
            </h3>
            <div className="text-slate-800 dark:text-slate-400 space-y-2">
              <p>
                TODO: Add information about what this tool does and how it works.
              </p>
              <p>
                <strong>Common uses:</strong> TODO: List common use cases for this tool.
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolContainer>
  );
};

export default GeminiSchemaValidator;
