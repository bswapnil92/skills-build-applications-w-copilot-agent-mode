import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const navItems = [
  { label: 'Users', to: '/users' },
  { label: 'Teams', to: '/teams' },
  { label: 'Activities', to: '/activities' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Workouts', to: '/workouts' },
];

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (codespaceName && codespaceName.trim()) {
    return `https://${codespaceName.trim()}-8000.app.github.dev/api`;
  }

  return 'http://localhost:8000/api';
}

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const apiBaseUrl = getApiBaseUrl();

  return (
    <div className="container py-4">
      <header className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <p className="text-uppercase text-primary fw-bold mb-1">OctoFit Tracker</p>
            <h1 className="mb-0">Fitness dashboard</h1>
          </div>
          <div className="text-md-end">
            <span className="badge bg-light text-dark border">API: {apiBaseUrl}</span>
          </div>
        </div>
      </header>

      <div className="alert alert-warning border-0 shadow-sm" role="alert">
        {codespaceName && codespaceName.trim()
          ? `Using GitHub Codespaces API base: ${apiBaseUrl}`
          : 'VITE_CODESPACE_NAME is not set. The app is using the local fallback API base: http://localhost:8000/api.'}
      </div>

      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-4 px-3 py-2 mb-4 shadow-sm">
        <div className="container-fluid px-0">
          <span className="navbar-brand me-3">Navigation</span>
          <div className="navbar-nav d-flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link rounded-pill px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-white-50'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
export { getApiBaseUrl };
