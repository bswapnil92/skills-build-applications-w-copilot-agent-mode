import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../App.jsx';

function normalizeItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const nestedKeys = ['results', 'items', 'data', 'docs', 'records'];

    for (const key of nestedKeys) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }

  return [];
}

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLeaderboard() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/leaderboard/`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setLeaders(normalizeItems(payload));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Leaderboard</h2>
          <span className="badge bg-success-subtle text-success-emphasis">{leaders.length} entries</span>
        </div>

        {loading ? (
          <div className="text-muted">Loading leaderboard...</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : leaders.length === 0 ? (
          <div className="text-muted">No leaderboard data available.</div>
        ) : (
          <div className="list-group">
            {leaders.map((entry, index) => (
              <div key={entry._id || entry.id || `${entry.userId}-${entry.teamId}-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">#{index + 1} · {entry.userId || 'Unknown athlete'}</div>
                  <small className="text-muted">Period: {entry.period || 'Current'}</small>
                </div>
                <span className="badge bg-dark rounded-pill fs-6">{entry.points ?? 0} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Leaderboard;
