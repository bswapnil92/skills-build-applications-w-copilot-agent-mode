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

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWorkouts() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/workouts/`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setWorkouts(normalizeItems(payload));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load workouts.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Workouts</h2>
          <span className="badge bg-secondary-subtle text-secondary-emphasis">{workouts.length} plans</span>
        </div>

        {loading ? (
          <div className="text-muted">Loading workouts...</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : workouts.length === 0 ? (
          <div className="text-muted">No workout suggestions available.</div>
        ) : (
          <div className="row g-3">
            {workouts.map((workout) => (
              <div key={workout._id || workout.id || workout.title} className="col-lg-6">
                <div className="card h-100 border-0 bg-secondary-subtle">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                      <h3 className="h5 mb-0">{workout.title || 'Workout plan'}</h3>
                      <span className="badge bg-dark text-white">{workout.fitnessLevel || 'All levels'}</span>
                    </div>
                    <p className="mb-2">{workout.description || 'No description provided.'}</p>
                    <small className="text-muted">Duration: {workout.durationMinutes ?? '—'} minutes</small>
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

export default Workouts;
