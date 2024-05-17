import { useState } from 'react';
import { AppShell, Flex } from '@mantine/core';
import classes from './Aside.module.css'; // Import your CSS module for styling
import FileOptions from '../FileOptions/FileOptions';


export function Aside() {
    return (
        <AppShell.Aside>
            <div className={classes.aside}>
                <FileOptions fname="File1.s2p" sparams={["S11", "S22"]}/>
                <FileOptions fname="File1.s2p" sparams={["S11", "S22"]}/>
            </div>
        </AppShell.Aside>
    );
}
