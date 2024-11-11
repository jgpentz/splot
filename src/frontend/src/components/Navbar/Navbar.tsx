import { ActionIcon, AppShell, Center, Code, Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { TbChartLine, TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand, TbSettings, TbWaveSawTool } from "react-icons/tb";
import classes from './Navbar.module.css'
import FrfLogo from "../FrfLogo/FrfLogo";
import { useEffect, useState } from "react";
import { NavbarLink, NavbarLinkData } from "../NavbarLink/NavbarLink";
import GitlabLogo from "../GitlabLogo/GitlabLogo";
import { useNavigate } from "react-router-dom";
import { config } from '../../config';
import { notifications } from "@mantine/notifications";

// Navigation links
const links = [
    { link: '/', label: 'S Parameters', icon: TbChartLine },
    { link: '/vswr', label: 'VSWR', icon: TbWaveSawTool },
];

const __version__ = "0.3.4"


// Type definition for the props passed into Navbar component
type NavbarProps = {
    collapsed: boolean;
    toggle: () => void;
};

export function Navbar({collapsed, toggle}: NavbarProps) {
    const [repoUrl, setRepoUrl] = useState("");

    /* Update the height to make our graph responsive to changes in window size */
    useEffect(() => {
        getRepoUrl()
    }, []);

    const getRepoUrl = async () => {
        try {
            const response = await fetch(`${config.api_url}/repo_url`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {

                notifications.show({
                    color: 'red',
                    title: 'Could not fetch repo url',
                    message: '',
                    classNames: classes,
                })

                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            // Update the repo url
            setRepoUrl(responseData);
        } catch (error) {
            console.error('Error sending data to the backend', error);

            notifications.show({
                color: 'red',
                title: 'Failed to fetch gitlab repo url',
                message: '',
                classNames: classes,
            })
        }
    };
    
    return (
        <AppShell.Navbar p="sm" className="{classes.navbar}">
            {collapsed ? ( 
                /* Collapsed navbar only shows expand button, link icons, and version */
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

                    {/* Render each link that exists in the links variable*/}
                    <div className={classes.navbarMainC}>
                        {links.map((item, index) => {
                            const link_data: NavbarLinkData = {
                                link: item.link,
                                label: item.label,
                                icon: item.icon
                            }

                            return (
                                <NavbarLink 
                                    key={`${item.link}-${index}`}
                                    collapsed={collapsed} 
                                    link_data={link_data}
                                />
                            );
                        })}
                    </div>

                    {/* Semantic version */}
                    <div>
                        <Group pl={6}>
                            <a 
                                href={repoUrl} 
                                target='_blank' 
                                rel='noreferrer'
                            >
                                <Tooltip 
                                    label="Source code" 
                                    position="right" 
                                    transitionProps={{ duration: 0 }}
                                >
                                    <ActionIcon 
                                        w={40} 
                                        h={40}
                                        variant="transparent"
                                    >
                                        <GitlabLogo width={100} height={100}/>
                                    </ActionIcon>
                                </Tooltip>
                            </a>
                        </Group>
                        <Code>v{__version__}</Code>
                    </div>
                </>
            ) : (
                /* Full size navbar shows logo, links with icons and name, and version */
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

                    {/* Render each link that exists in the links variable*/}
                    <div className={classes.navbarMain}>
                        {links.map((item, index) => {
                            const link_data: NavbarLinkData = {
                                link: item.link,
                                label: item.label,
                                icon: item.icon
                            }

                            return (
                                <NavbarLink 
                                    key={`${item.link}-${index}`}
                                    collapsed={collapsed} 
                                    link_data={link_data}
                                />
                            );
                        })}
                    </div>

                    {/* Semantic version */}
                    <div>
                        <Group pl={6} justify="space-between">
                            <a 
                                href={repoUrl} 
                                target='_blank' 
                                rel='noreferrer'
                            >
                                <Tooltip 
                                    label="Source code" 
                                    position="right" 
                                    transitionProps={{ duration: 0 }}
                                >
                                    <ActionIcon 
                                        w={40} 
                                        h={40}
                                        variant="transparent"
                                    >
                                        <GitlabLogo width={100} height={100}/>
                                    </ActionIcon>
                                </Tooltip>
                            </a>
                            <Code>v{__version__}</Code>
                        </Group>
                    </div>
                </>
            )}
        </AppShell.Navbar>
    );
}
