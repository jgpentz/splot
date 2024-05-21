import { Aside } from '@/components/Aside/Aside';
import { Navbar } from '@/components/Navbar/Navbar';
import { SparamGraph } from '@/components/SparamGraph/SparamGraph';
import { Testone } from '@/components/Test/testone';
import { AppShell } from '@mantine/core';
import { useDisclosure, } from '@mantine/hooks';

export function HomePage() {
  const [navCollapsed, { toggle: toggleNav }] = useDisclosure(false);

    return (
        <AppShell
            navbar={{
                width: (navCollapsed ? 80 : 240),
                breakpoint: 'xs',
                collapsed: { desktop: false, mobile: true}
            }}
            aside={{ 
                width: 300, 
                breakpoint: "md", 
                collapsed: { desktop: false, mobile: true }
            }}
        >
            <Navbar collapsed={navCollapsed} toggle={toggleNav}/>
            <AppShell.Main>
                <SparamGraph />
            </AppShell.Main>
            <Aside />
        </AppShell>
    );
}
