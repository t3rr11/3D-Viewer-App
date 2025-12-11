import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
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

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-950">
          <div className="max-w-2xl mx-auto p-8 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-red-500/50">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-400">
                Something went wrong
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                An error occurred while loading or displaying the 3D model.
              </p>

              <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
                <p className="text-sm font-semibold text-red-400 mb-2">
                  Error Details:
                </p>
                <p className="text-sm text-gray-300 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-400">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>Check if the model file is valid and not corrupted</li>
                <li>Ensure the file format is supported (STL, OBJ, GLTF, GLB)</li>
                <li>Try reloading the page or selecting a different model</li>
                <li>
                  If the file is very large, it may exceed browser memory limits
                </li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={this.resetError}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
