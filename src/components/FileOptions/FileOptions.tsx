import { ActionIcon, Box, Collapse, Grid, Group, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react"
import classes from './FileOptions.module.css'; // Import your CSS module for styling
import { TbBorderStyle, TbBorderStyle2, TbChevronDown, TbChevronRight, TbEye, TbEyeClosed, TbMathXDivideY, TbMathXDivideY2, TbTrash, TbTriangle } from "react-icons/tb";

// Interface to define what an sparam should contain
interface sparam {
    ports: string;
}

// Interface to define the props for the FileOptions component
interface FileOptionsProps {
    fname: string;
    sparams: string[];
}

export default function FileOptions({ fname, sparams }: FileOptionsProps) {
    const [opened, setOpened] = useState(true)
    const [visible, setVisible] = useState(true)

    // Map through sparams to create options for each s param contained in the file
    const items = sparams.map((sparam) => (
        <Grid  className={classes.Sparams} columns={20}>
            <Grid.Col span={3}></Grid.Col>
            {/* Toggle visibility */}
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    {visible ? (
                        <TbEye color="black" size="1.5em"/> 
                    ) : (
                        <TbEyeClosed color="black" size="1.5em"/>
                    )}
                </ActionIcon>
            </Grid.Col>
            {/* S param name */}
            <Grid.Col span={5} className={classes.SparamText}>{sparam}</Grid.Col>
            {/* Select line style */}
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    <TbBorderStyle2 color="black" size="1.5em"/> 
                </ActionIcon>
            </Grid.Col>
            {/* Normalize to this sparam */}
            <Grid.Col span={3}>
                <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                    <TbTriangle color="black" size="1.5em"/> 
                </ActionIcon>
            </Grid.Col>
        </Grid>
    ));

    return(
        <>
            {/* Header section of the FileOptions component */}
            <Grid className={classes.Header} columns={20}>
                {/* Toggle visibility */}
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
                {/* Filename */}
                <Grid.Col span={8} className={classes.HeaderText}>{fname}</Grid.Col>
                {/* Do some math */}
                <Grid.Col span={3}>
                    <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                        {visible ? (
                            <TbMathXDivideY2 color="black" size="1.5em"/> 
                        ) : (
                            <TbMathXDivideY2 color="black" size="1.5em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
                {/* Delete this file */}
                <Grid.Col span={3}>
                    <ActionIcon className={classes.Icon} variant="transparent" onClick={() => setVisible((o) => !o)}>
                        {visible ? (
                            <TbTrash color="black" size="1.5em"/> 
                        ) : (
                            <TbTrash color="black" size="1.5em"/>
                        )}
                    </ActionIcon>
                </Grid.Col>
                {/* Collapse/expand the options for this file */}
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
            {/* Collapse section that shows/hides based on the opened state */}
            <Collapse in={opened} className={classes.CollapsedGroup} transitionDuration={0}>
                {items}
            </Collapse>
        </>
    )
}
