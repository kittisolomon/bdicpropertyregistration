import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import GovPropertyPortal from './pages/page';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <GovPropertyPortal />
        <Toaster />
      </div>
    </Router>
  );
}

export default App; 