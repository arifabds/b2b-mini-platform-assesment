import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './lib/contexts/AuthContext';
import { ThemeProvider } from './lib/contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>

  );
}

export default App;

