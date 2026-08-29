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

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const response = await fetch(`${getApiBaseUrl()}/users/`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setUsers(normalizeItems(payload));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load users.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Users</h2>
          <span className="badge bg-warning-subtle text-warning-emphasis">{users.length} athletes</span>
        </div>

        {loading ? (
          <div className="text-muted">Loading users...</div>
        ) : error ? (
          <div className="alert alert-danger mb-0">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-muted">No users available.</div>
        ) : (
          <div className="row g-3">
            {users.map((user) => (
              <div key={user._id || user.id || user.email} className="col-md-6 col-xl-4">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 mb-1">{user.name || 'Unnamed user'}</h3>
                    <p className="text-muted mb-2">{user.email || 'No email provided'}</p>
                    <span className="badge bg-primary-subtle text-primary-emphasis">{user.fitnessLevel || 'beginner'}</span>
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

export default Users;
