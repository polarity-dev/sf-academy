import { useEffect } from 'react';
import './App.css';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import routes from './features/routes/routes.json'

function App() {
  const navigate = useNavigate()
  const match = useMatch(routes.root)

  // Redirect to login
  useEffect(() => { if (match) navigate(routes.login) })
  return (
    <div className="App">
      <header className="App-header">
        <Outlet />
      </header>
    </div>
  );
}

export default App;
