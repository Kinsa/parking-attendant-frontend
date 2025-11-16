'use client';

import { useState } from 'react';

interface SearchResult {
  distance: number;
  vrm: string;
  session: 'partial' | 'full' | 'none';
  session_start: string | null;
  session_end: string | null;
}

interface ApiResponse {
  message: string;
  results: SearchResult[];
}

export default function Home() {
  const queryTo = '2025-11-11 23:00:00';
  const queryFrom = '2025-11-11 18:00:00';

  const [vrm, setVrm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vrm.trim()) {
      setError('Please enter a VRM');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setMessage('');

    try {
      // Replace with your actual API URL
      const response = await fetch(
          `http://localhost:8000/api/v1/vehicle?vrm=${encodeURIComponent(vrm)}&query_to=${encodeURIComponent(queryTo)}&query_from=${encodeURIComponent(queryFrom)}`
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: ApiResponse = await response.json();
      console.log('data', data);
      setResults(data.results);
      setMessage(data.message);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSessionBadgeColor = (session: string) => {
    switch (session) {
      case 'partial':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    }
  };

  const getSessionBadgeText = (session: string) => {
    switch (session) {
      case 'partial':
        return 'Ongoing';
      case 'full':
        return 'Session Expired';
      case 'none':
        return 'No Session Found';
      default:
        return 'Unknown';
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return null;
    // Convert "yyyy-mm-dd hh:mm:ss" to ISO 8601 "yyyy-mm-ddThh:mm:ss"
    return dateString.replace(' ', 'T');
  };

  const formatDisplayTime = (dateString: string | null) => {
    if (!dateString) return '';
    // Optional: format for display
    const date = new Date(formatDateTime(dateString) || '');
    return date.toLocaleString(); // or keep original format
  };

  const getTimeSinceExpiration = (dateString: string | null) => {
    if (!dateString) return '';

    const date = new Date(formatDateTime(dateString) || '').getTime();
    const now = new Date(formatDateTime(queryTo) || '').getTime();
    return now - date;
  }

  const oldResult = (dateString: string | null) => {
    if (!dateString) return '';

    const timeSinceExpiration = getTimeSinceExpiration(dateString);
    if (timeSinceExpiration === '') return '';

    return timeSinceExpiration > 1000 * 60 * 60 * 5
  }

  return (
      <main className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Parking Attendant Search</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="grid grid-cols-[minmax(0,_1fr)_auto] gap-y-2 gap-x-4">
            <label className="col-span-2" htmlFor="vrmSearch">Enter VRM (e.g., MA16 GXX)</label>
            <input
                id="vrmSearch"
                type="search"
                value={vrm}
                onChange={(e) => setVrm(e.target.value.toUpperCase())}
                className="col-start-1 row-start-2 px-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={loading}
                className="col-start-2 row-start-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-grey-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
        )}

        {/* API Message */}
        {message && (
            <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
              {message}
            </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>

              <div className="space-y-3">
                {results.map((result, index) => (
                    <div
                        key={index}
                        className={
                          `border rounded-lg p-4 hover:shadow-md transition-shadow ${result.distance == 0 ? 'border-purple-300' : 'border-grey-200'} ${oldResult(result.session_end) ? 'opacity-30' : ''}`
                        }
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className={`flex items-center gap-6` + (result.session !== 'none' ? '  mb-2' : '')}>
                            <span className="text-lg font-mono font-bold">
                              {result.vrm}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getSessionBadgeColor(
                                result.session
                              )}`}
                            >
                              {getSessionBadgeText(result.session)}
                            </span>
                          </div>

                          {result.session !== 'none' && (
                              <dl className="text-sm text-grey-600 space-y-1 flex flex-row gap-4">
                                <span>
                                  <dt className="font-bold">Session Start:</dt>
                                  <dd>
                                    <time dateTime={formatDateTime(result.session_start)}>{formatDisplayTime(result.session_start)}</time>
                                  </dd>
                                  </span>
                                  <span>
                                    <dt className="font-bold">Session End:</dt>
                                    <dd>
                                      <time dateTime={formatDateTime(result.session_end)}>{formatDisplayTime(result.session_end)}</time>
                                    </dd>
                                  </span>
                              </dl>
                          )}
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </main>
  );
}