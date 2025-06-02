"use client";
import { useState, useEffect } from "react";

interface Step {
  id: string;
  title: string;
  description: string;
  apiCall: (previousResults: any[]) => Promise<any>;
}

interface StepProgressProps {
  steps: Step[];
  onComplete?: (results: any[]) => void;
  onError?: (error: any, stepIndex: number) => void;
  autoStart?: boolean;
}

type StepStatus = "pending" | "loading" | "completed" | "error";

interface StepState {
  status: StepStatus;
  result?: any;
  error?: string;
}

export default function StepProgress({ 
  steps, 
  onComplete, 
  onError, 
  autoStart = false 
}: StepProgressProps) {
  const [stepStates, setStepStates] = useState<StepState[]>(
    steps.map(() => ({ status: "pending" }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (autoStart && !isRunning) {
      startProcess();
    }
  }, [autoStart]);

  const startProcess = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStepIndex(0);
    
    // Reset all steps to pending
    setStepStates(steps.map(() => ({ status: "pending" })));
    
    await executeSteps();
  };

  const executeSteps = async () => {
    const results: any[] = [];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      // Set current step to loading
      setStepStates(prev => prev.map((state, index) => 
        index === i ? { ...state, status: "loading" } : state
      ));

      try {
        // Pass all previous results to the current step
        const result = await steps[i].apiCall(results);
        results.push(result);
        
        // Set current step to completed with result
        setStepStates(prev => prev.map((state, index) => 
          index === i ? { status: "completed", result } : state
        ));
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        // Set current step to error
        setStepStates(prev => prev.map((state, index) => 
          index === i ? { status: "error", error: error.message || "An error occurred" } : state
        ));
        
        if (onError) {
          onError(error, i);
        }
        
        setIsRunning(false);
        return;
      }
    }
    
    setIsRunning(false);
    if (onComplete) {
      onComplete(results);
    }
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "loading":
        return (
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        );
      case "error":
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          </div>
        );
    }
  };

  const getStepContent = (stepState: StepState, stepIndex: number) => {
    if (stepState.status === "completed" && stepState.result) {
      return (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <strong>Result:</strong>
          </div>
          <pre className="text-xs text-green-700 mt-1 overflow-x-auto">
            {typeof stepState.result === 'string' 
              ? stepState.result 
              : JSON.stringify(stepState.result, null, 2)}
          </pre>
        </div>
      );
    }
    
    if (stepState.status === "error" && stepState.error) {
      return (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            <strong>Error:</strong> {stepState.error}
          </div>
        </div>
      );
    }
    
    if (stepState.status === "loading") {
      return (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">Processing...</div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={startProcess}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isRunning ? "Processing..." : "Start Process"}
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepState = stepStates[index];
          const isActive = currentStepIndex === index && isRunning;
          
          return (
            <div
              key={step.id}
              className={`p-4 border rounded-lg transition-all duration-200 ${
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : stepState.status === "completed"
                  ? "border-green-500 bg-green-50"
                  : stepState.status === "error"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start space-x-3">
                {getStepIcon(stepState.status)}
                <div className="flex-1" style={{width: "50%"}}>
                  <h3 className="text-lg font-medium text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {step.description}
                  </p>
                  {getStepContent(stepState, index)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 