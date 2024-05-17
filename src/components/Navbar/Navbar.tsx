import { ActionIcon, AppShell, Center, Code, Group, Tooltip, UnstyledButton } from "@mantine/core";
import { TbChartLine, TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand, TbSettings } from "react-icons/tb";
import classes from './Navbar.module.css'
import FrfLogo from "../FrfLogo/FrfLogo";
import { useState } from "react";
import { NavbarLink, NavbarLinkData } from "../NavbarLink/NavbarLink";

const data = [
    { link: '', label: 'S Parameters', icon: TbChartLine },
    { link: '', label: 'Settings', icon: TbSettings },
    { link: '', label: 'stuff2', icon: TbSettings },
    { link: '', label: 'Stuff', icon: TbSettings },
];


// Child component receiving state and function as props
type NavbarProps = {
    collapsed: boolean;
    toggle: () => void;
};

export function Navbar({collapsed, toggle}: NavbarProps) {
    const [active, setActive] = useState<string>('S Parameters')

    return (
        <AppShell.Navbar p="sm" className="{classes.navbar}">
            {collapsed ? ( 
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

                    <div className={classes.navbarMainC}>
                        {data.map((item) => {
                            const link_data: NavbarLinkData = {
                                link: item.link,
                                label: item.label,
                                icon: item.icon
                            }

                            return (
                                <NavbarLink 
                                    selected={active} 
                                    setSelected={setActive} 
                                    collapsed={collapsed} 
                                    link_data={link_data}
                                />
                            );
                        })}
                    </div>

                    <div>
                        <Code>v0.0.1</Code>
                    </div>
                </>
            ) : (
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
                        {data.map((item) => {
                            const link_data: NavbarLinkData = {
                                link: item.link,
                                label: item.label,
                                icon: item.icon
                            }

                            return (
                                <NavbarLink 
                                    selected={active} 
                                    setSelected={setActive} 
                                    collapsed={collapsed} 
                                    link_data={link_data}
                                />
                            );
                        })}
                    </div>

                    <div>
                        <Code>v0.0.1</Code>
                    </div>
                </>
            )}
        </AppShell.Navbar>
    );
}
