import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">Todo</h1>
        <div className="layout-user">
          <span className="layout-email">{user?.email}</span>
          <button type="button" className="layout-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
