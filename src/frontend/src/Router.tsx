import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SparamsPage } from './pages/Sparams.page';
import { Dispatch, SetStateAction } from 'react';
import { VSWRPage } from './pages/VSWR.page';

interface RouterProps {
    navCollapsed: boolean;
    toggleNav: () => void;
    fileData: Record<string, string>;
    setFileData: Dispatch<SetStateAction<Record<string, string>>>;
}

export function Router({ navCollapsed, toggleNav, fileData, setFileData }: RouterProps) {
    const router = createBrowserRouter([
        {
            path: '/',
            element: 
                <SparamsPage 
                    navCollapsed={navCollapsed}
                    toggleNav={toggleNav}
                    fileData={fileData as any}
                    setFileData={setFileData as any} 
                />,
        },
        {
            path: '/vswr',
            element: 
                <VSWRPage 
                    navCollapsed={navCollapsed}
                    toggleNav={toggleNav}
                    fileData={fileData as any}
                    setFileData={setFileData as any} 
                />,
        },
    ]);

    return <RouterProvider router={router} />;
}