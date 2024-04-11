import { useState } from 'react';
import { AppShell, Flex } from '@mantine/core';
import classes from './Aside.module.css'; // Import your CSS module for styling
import FileOptions from '../FileOptions/FileOptions';

interface AsideProps {
    setWidth: React.Dispatch<React.SetStateAction<number>>;
}

export function Aside({ setWidth }: AsideProps) {
    return (
        <AppShell.Aside>
                <FileOptions fname="File1.s2p" sparams={["S11", "S22"]}/>
                <FileOptions fname="File1.s2p" sparams={["S11", "S22"]}/>
        </AppShell.Aside>
    );
}
