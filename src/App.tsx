import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Index from './pages/Index';

function App() {
  return (
    <div className="min-h-screen bg-dashboard-dark flex flex-col">
      {/* Global Header */}
      <div className="w-full bg-dashboard-card/50 py-4 text-center border-b border-white/10 sticky top-0 z-50">
        <p className="text-xl text-white font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="text-sm text-dashboard-text mt-1">In the name of Allah, the Most Gracious, the Most Merciful</p>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Index />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <footer className="text-center text-dashboard-muted text-sm py-8 border-t border-white/10 bg-dashboard-card/50">
        <p>© 2024 SmartFIX Tech, Burton Upon Trent. All rights reserved.</p>
        <p className="mt-2">Website created and coded by Zaheer Asghar</p>
      </footer>
    </div>
  );
}

export default App;