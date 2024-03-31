import { Navbar } from '@/components/Navbar/Navbar';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function HomePage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      navbar={{
        width: desktopOpened ? 240 : 80,
        breakpoint: 'sm',
      }}
      aside={{ width: 300, breakpoint: "md" }}
      padding="md"
    >
      <Navbar opened={desktopOpened} toggle={toggleDesktop}/>
      <AppShell.Main>Main</AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
    </AppShell>
  );
}
