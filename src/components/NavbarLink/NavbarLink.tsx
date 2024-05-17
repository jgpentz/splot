import { ActionIcon, AppShell, Center, Code, Group, Tooltip, UnstyledButton } from "@mantine/core";
import { IconType } from "react-icons";
import classes from './NavbarLink.module.css'

function CollapsedLink({ icon: Icon, label, active, onClick }: CollapsedData) {
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

interface CollapsedData {
    link: string;
    label: string;
    icon: IconType;
    active?: boolean;
    onClick?(): void;
};

export interface NavbarLinkData {
    link: string;
    label: string;
    icon: IconType;
};

type NavbarLinkProps = {
    selected: string;
    setSelected: any;
    collapsed: boolean;
    link_data: NavbarLinkData;
};

export function NavbarLink({selected, setSelected, collapsed, link_data}: NavbarLinkProps) {
    return (
        <>
            {collapsed ? (
                <CollapsedLink
                    icon={link_data.icon}
                    label={link_data.label}
                    active={link_data.label === selected}
                    onClick={(event) => {
                        event.preventDefault();
                        setSelected(link_data.label)
                    }}
                />
            ) : (
                <a
                    className={classes.link}
                    data-active={link_data.label === selected || undefined}
                    href={link_data.link}
                    key={link_data.label}
                    onClick={(event) => {
                        event.preventDefault();
                        setSelected(link_data.label)
                    }}
                >
                    <link_data.icon className={classes.linkIcon} data-expanded />
                    <span>{link_data.label}</span>
                </a>
            )}
        </>
    )
}