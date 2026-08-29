import { RouterProvider } from '@tanstack/react-router';
import { Center, Loader } from '@mantine/core';
import { useAppStore } from './app-store';
import { Onboarding } from './pages/Onboarding';
import { router } from './router';
export function App() {
  const { profile, loading } = useAppStore();
  if (loading)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  if (!profile) return <Onboarding />;
  return <RouterProvider router={router} />;
}
