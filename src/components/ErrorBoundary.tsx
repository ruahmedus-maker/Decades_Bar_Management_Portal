'use client'; // Add this line at the very top

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          background: 'rgba(229, 62, 62, 0.1)', 
          border: '1px solid #e53e3e',
          borderRadius: '8px',
          margin: '20px',
          color: 'white'
        }}>
          <h3>⚠️ Something went wrong in this section</h3>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            This section has crashed. Please try refreshing the page.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 16px',
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}