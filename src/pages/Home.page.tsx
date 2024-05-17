import { Aside } from '@/components/Aside/Aside';
import { Navbar } from '@/components/Navbar/Navbar';
import { SparamGraph } from '@/components/SparamGraph/SparamGraph';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure, useResizeObserver } from '@mantine/hooks';
import { useState } from 'react';

export function HomePage() {
  const [navCollapsed, { toggle: toggleNav }] = useDisclosure(false);

  return (
    <AppShell
      navbar={{
        width: navCollapsed ? 80 : 240,
        breakpoint: 'sm',
      }}
      aside={{ width: 300, breakpoint: "md" }}
      padding="md"
    >
      <Navbar collapsed={navCollapsed} toggle={toggleNav}/>
      <AppShell.Main><SparamGraph /></AppShell.Main>
      <Aside />
    </AppShell>
  );
}
