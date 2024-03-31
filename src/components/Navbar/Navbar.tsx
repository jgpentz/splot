import { ActionIcon, AppShell, Center, Code, Group, Tooltip, UnstyledButton } from "@mantine/core";
import { TbChartLine, TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand, TbSettings } from "react-icons/tb";
import classes from './Navbar.module.css'
import FrfLogo from "../FrfLogo/FrfLogo";
import { useState } from "react";

interface NavbarLinkProps {
  icon: typeof TbSettings;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function CollapsedLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Center>
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.linkCollapsed} data-active={active || undefined}>
                <Icon className={classes.icon} data-active={active || undefined} />
            </UnstyledButton>
        </Tooltip>
    </Center>
  );
}

const data = [
    { link: '', label: 'S Parameters', icon: TbChartLine },
    { link: '', label: 'Settings', icon: TbSettings },
];


// Child component receiving state and function as props
type NavbarProps = {
    opened: boolean;
    toggle: () => void;
};

export function Navbar({opened, toggle}: NavbarProps) {
    const [active, setActive] = useState<String>('S Parameters')

    const links = opened ? data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label)
            }}
        >
            <item.icon className={classes.linkIcon} data-expanded />
            <span>{item.label}</span>
        </a>
    )) : data.map((item) => (
        <CollapsedLink
            icon={item.icon}
            label={item.label}
            active={item.label === active}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label)
            }}
        />
    ))
  return (
    <AppShell.Navbar p="sm" className="{classes.navbar}">
        {opened ? (
            <>
                <Group gap={0}>
                    <FrfLogo width={170} height={50} />
                    <Tooltip label="Collapse" position="right" transitionProps={{ duration: 0 }}>
                        <ActionIcon
                            onClick={toggle}
                            size="xl"
                            aria-label="Collapse sidebar"
                            className={classes.collapse}
                            variant="transparent"
                        >
                            <TbLayoutSidebarLeftCollapse className={classes.icon}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <div className={classes.navbarMain}>
                    {links}
                </div>

                <div>
                    <Code>v0.0.1</Code>
                </div>
            </>
        ) : (
            <>
                <Center>
                    <Tooltip label="Expand" position="right" transitionProps={{ duration: 0 }}>
                        <ActionIcon
                            onClick={toggle}
                            size="xl"
                            aria-label="Expand sidebar"
                            className={classes.collapse}
                            variant="transparent"
                        >
                            <TbLayoutSidebarLeftExpand className={classes.icon}/>
                        </ActionIcon>
                    </Tooltip>

                </Center>

                <div className={classes.navbarMain}>
                    {links}
                </div>

                <div>
                    <Code>v0.0.1</Code>
                </div>
            </>
        )}
      </AppShell.Navbar>
  );
}
