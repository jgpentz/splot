
import { Aside } from '@/components/Aside/Aside';
import { Navbar } from '@/components/Navbar/Navbar';
import { SparamGraph } from '@/components/SparamGraph/SparamGraph';
import { VSWRGraph } from '@/components/VSWRGraph/VSWRGraph';
import { AppShell } from '@mantine/core';
import { useDisclosure, } from '@mantine/hooks';
import { Dispatch, SetStateAction, useState } from 'react';

export interface SGraphDataPoint {
    frequency: number;
    value: number;
}

export interface SGraphDataLiteral{
    name: string;
    visible: boolean;
    color: string
    data: SGraphDataPoint[];
}

export interface DataSet {
    m: number[];
    n: number[];
    frequency: number[];
    [key: string]: SGraphDataLiteral |  number[];
}

export interface SparamFiles {
    [filename: string]: DataSet;
}


interface SparamsPageProps {
    navCollapsed: boolean;
    toggleNav: () => void;
    fileData: Record<string, SparamFiles>;
    setFileData: Dispatch<SetStateAction<Record<string, SparamFiles>>>;
}

export function VSWRPage({ navCollapsed, toggleNav, fileData, setFileData }: SparamsPageProps) {
    const [sparams, setSparams] = useState<Record<string, SparamFiles>>({});

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
                <VSWRGraph navCollapsed={navCollapsed} fileData={fileData} setFileData={setFileData} sparams={sparams} setSparams={setSparams}/>
            </AppShell.Main>
            <Aside fileData={fileData} setFileData={setFileData} sparams={sparams} setSparams={setSparams} />
        </AppShell>
    );
}
