"use client";

import React, { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching and displaying errors gracefully
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console and potentially to error tracking service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 text-center mb-4 text-sm">
                {this.state.error?.message ||
                  "An unexpected error occurred. Please try again."}
              </p>
              <button
                onClick={this.resetError}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Try again
              </button>

              {process.env.NODE_ENV === "development" && (
                <details className="mt-6 text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-semibold">
                    Error details (Development only)
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-red-600 overflow-auto max-h-48">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
