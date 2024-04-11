import { ActionIcon, Box, Collapse, Grid, Group, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react"
import classes from './FileOptions.module.css'; // Import your CSS module for styling
import { TbBorderStyle, TbBorderStyle2, TbChevronDown, TbChevronRight, TbEye, TbEyeClosed, TbMathXDivideY, TbMathXDivideY2, TbTrash, TbTriangle } from "react-icons/tb";

interface sparam {
    ports: string;
}

interface FileOptionsProps {
    fname: string;
    sparams: string[];
}

export default function FileOptions({ fname, sparams }: FileOptionsProps) {
    const [opened, setOpened] = useState(true)
    const [visible, setVisible] = useState(true)

    const items = sparams.map((sparam) => (
        <Grid  className={classes.Sparams} columns={20}>
            <Grid.Col span={3}></Grid.Col>
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    {visible ? (
                        <TbEye color="black" size="1.5em"/> 
                    ) : (
                        <TbEyeClosed color="black" size="1.5em"/>
                    )}
                </ActionIcon>
            </Grid.Col>
            <Grid.Col span={5} className={classes.SparamText}>{sparam}</Grid.Col>
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    <TbBorderStyle2 color="black" size="1.5em"/> 
                </ActionIcon>
            </Grid.Col>
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    <TbTriangle color="black" size="1.5em"/> 
                </ActionIcon>
            </Grid.Col>
        </Grid>
    ));

    return(
        <>
            <Grid className={classes.Header} columns={20}>
                <Grid.Col span={3}>
                    <ActionIcon 
                        className={`${classes.Icon} ${classes.HeaderFirstIcon}`} 
                        variant="transparent" 
                        onClick={() => setVisible((o) => !o)}
                    >
                        {visible ? (
                            <TbEye color="black" size="1.5em"/> 
                        ) : (
                            <TbEyeClosed color="black" size="1.5em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={8} className={classes.HeaderText}>{fname}</Grid.Col>
                <Grid.Col span={3}>
                    <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                        {visible ? (
                            <TbMathXDivideY2 color="black" size="1.5em"/> 
                        ) : (
                            <TbMathXDivideY2 color="black" size="1.5em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={3}>
                    <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                        {visible ? (
                            <TbTrash color="black" size="1.5em"/> 
                        ) : (
                            <TbTrash color="black" size="1.5em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={3}>
                    <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setOpened((o) => !o)}>
                        {opened ? (
                            <TbChevronDown color="black" size="1.3em"/> 
                        ) : (
                            <TbChevronRight color="black" size="1.3em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
            </Grid>
            <Collapse in={opened} className={classes.CollapsedGroup} transitionDuration={0}>
                {items}
            </Collapse>
        </>
    )
}
