import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { GameLayout } from './layouts/GameLayout';
import LoaderScreen from './screens/LoaderScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ModuleMapScreen } from './screens/ModuleMap';
import { LevelList } from './screens/LevelList';
import AuthPage from './screens/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
// import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router-dom';
import Level2 from './screens/Level2/Index';
import Level2GameNavigator from './screens/Level2/GameNavigator';
import Level3 from './screens/Level3/Index';
import Level4 from './screens/Level4/Index';
import InstructionsPage from './screens/InstructionsPage';
import BingoGame from './screens/BingoGame';
import SplashScreen from './components/ui/SplashScreen';
import Score from './components/Scores/Score';

// Route Error Component
function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorFallback
        error={new Error(`${error.status} ${error.statusText}`)}
        resetErrorBoundary={() => (window.location.href = '/')}
        title={`${error.status} - ${error.statusText}`}
        message={
          error.data?.message ||
          "The page you're looking for doesn't exist or encountered an error."
        }
      />
    );
  }

  return (
    <ErrorFallback
      error={error instanceof Error ? error : new Error('Unknown route error')}
      resetErrorBoundary={() => (window.location.href = '/')}
      title="Navigation Error"
      message="Something went wrong while navigating. Let's get you back on track."
    />
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading] = useState(false);

  const handleSplashComplete = () => setShowSplash(false);

  const router = createBrowserRouter([
    {
      element: (
        <GameLayout>
          <Outlet />
        </GameLayout>
      ),
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          path: '/',
          element: showSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <AuthPage />
          ),
        },
        { path: '/home', element: <ProtectedRoute><HomeScreen /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules', element: <ProtectedRoute><ModuleMapScreen /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId', element: <ProtectedRoute><LevelList /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/levels/1', element: <ProtectedRoute><BingoGame /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/levels/2', element: <ProtectedRoute><Level2 /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/games', element: <ProtectedRoute><Level2GameNavigator /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/levels/3', element: <ProtectedRoute><Level3 /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/levels/4', element: <ProtectedRoute><Level4 /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/modules/:moduleId/levels/4/gameboard2d', element: <ProtectedRoute><Level4 /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/auth', element: <AuthPage />, errorElement: <RouteErrorBoundary /> },
        { path: '/instructions', element: <ProtectedRoute><InstructionsPage /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '/scores', element: <ProtectedRoute><Score /></ProtectedRoute>, errorElement: <RouteErrorBoundary /> },
        { path: '*', element: <Navigate to="/" replace />, errorElement: <RouteErrorBoundary /> },
      ],
    },
  ]);

  if (isLoading) {
    return <LoaderScreen />;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  );
}

export default App;
