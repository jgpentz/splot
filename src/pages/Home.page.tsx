import { Aside } from '@/components/Aside/Aside';
import { Navbar } from '@/components/Navbar/Navbar';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure, useResizeObserver } from '@mantine/hooks';
import { useState } from 'react';

export function HomePage() {
  const [navCollapsed, { toggle: toggleNav }] = useDisclosure(false);
  const [asideWidth, setAsideWidth] = useState(300)

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
      <AppShell.Main>Main</AppShell.Main>
      <Aside setWidth={setAsideWidth}>

      </Aside>
    </AppShell>
  );
}
