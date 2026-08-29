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

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivities() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/activities/`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setActivities(normalizeItems(payload));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load activities.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchActivities();

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Activities</h2>
          <span className="badge bg-primary-subtle text-primary-emphasis">{activities.length} records</span>
        </div>

        {loading ? (
          <div className="text-muted">Loading activities...</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-muted">No activity records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Points</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id || activity.id || `${activity.type}-${activity.completedAt}`}>
                    <td>{activity.type || 'Unknown'}</td>
                    <td>{activity.durationMinutes ?? '—'} min</td>
                    <td>{activity.points ?? 0}</td>
                    <td>{activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Activities;
