import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SparamsPage } from './pages/Sparams.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SparamsPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
