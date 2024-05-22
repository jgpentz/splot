import { Aside } from '@/components/Aside/Aside';
import { Navbar } from '@/components/Navbar/Navbar';
import { SparamGraph } from '@/components/SparamGraph/SparamGraph';
import { AppShell } from '@mantine/core';
import { useDisclosure, } from '@mantine/hooks';
import { useState } from 'react';

export interface SparamData {
    filename: string;
    data: any;
}

export function SparamsPage() {
    const [navCollapsed, { toggle: toggleNav }] = useDisclosure(false);
    const [sparams, setSparams] = useState<SparamData[]>([]);
    console.log(sparams)

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
                <SparamGraph sparams={sparams} setSparams={setSparams}/>
            </AppShell.Main>
            <Aside />
        </AppShell>
    );
}
