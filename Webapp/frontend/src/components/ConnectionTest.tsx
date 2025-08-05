import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';

export default function ConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('testing');
    setError('');

    try {
      // Test the backend health endpoint
      const response = await fetch('http://localhost:5000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatus('connected');
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (err: any) {
      setStatus('error');
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Backend server is not running. Please start the backend server with: cd backend && npm run dev');
      } else {
        setError(err.message || 'Connection failed');
      }
    }
  };

  if (status === 'connected') {
    return null; // Don't show anything if connected
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`p-4 rounded-lg border ${
        status === 'testing' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start">
          {status === 'testing' ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin mt-0.5 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
          )}
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              status === 'testing' ? 'text-blue-900' : 'text-red-900'
            }`}>
              {status === 'testing' ? 'Connecting to backend...' : 'Backend Connection Failed'}
            </h3>
            
            {status === 'error' && (
              <div className="mt-2">
                <p className="text-sm text-red-700 mb-3">{error}</p>
                <div className="space-y-1 text-xs text-red-600">
                  <p><strong>To fix this:</strong></p>
                  <p>1. Open a terminal in the backend folder</p>
                  <p>2. Run: <code className="bg-red-100 px-1 rounded">npm run dev</code></p>
                  <p>3. Wait for "Server running on port 5000"</p>
                </div>
                <button
                  onClick={testConnection}
                  className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Retry Connection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
