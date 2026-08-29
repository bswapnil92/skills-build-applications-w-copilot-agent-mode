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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTeams() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/teams/`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setTeams(normalizeItems(payload));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load teams.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTeams();

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Teams</h2>
          <span className="badge bg-info-subtle text-info-emphasis">{teams.length} teams</span>
        </div>

        {loading ? (
          <div className="text-muted">Loading teams...</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : teams.length === 0 ? (
          <div className="text-muted">No teams created yet.</div>
        ) : (
          <div className="row g-3">
            {teams.map((team) => (
              <div key={team._id || team.id || team.name} className="col-md-6 col-xl-4">
                <div className="card h-100 border-0 bg-light-subtle">
                  <div className="card-body">
                    <h3 className="h5 mb-2">{team.name || 'Unnamed team'}</h3>
                    <p className="text-muted mb-0">Members: {Array.isArray(team.memberIds) ? team.memberIds.length : 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Teams;
