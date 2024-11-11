import { DataSet, SGraphDataLiteral, SparamFiles } from '@/pages/Sparams.page';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { FileDropzone } from '../FileDropzone/FileDropzone';
import { HighlightButton, HighlightModal, HighlightShape } from '../ModebarButtons/HighlightButton';
import classes from './SparamGraph.module.css';

import { config } from '../../config';
import { AxesRange, SetAxesButton, SetAxesModal } from '../ModebarButtons/SetAxesButton';

// Color-blind friendly color palette
const okabe_ito_colors: string[] = [
    "#000000", // Black
    "#E69F00", // Light orange
    "#56B4E9", // Light blue
    "#009E73", // Green
    "#F0E442", // Yellow
    "#0072B2", // Dark blue
    "#D55E00", // Dark orange
    "#CC79A7", // Pink

]

interface SparamGraphProps {
    navCollapsed: boolean;
    fileData: Record<string, SparamFiles>;
    setFileData: Dispatch<SetStateAction<Record<string, SparamFiles>>>;
    sparams: Record<string, SparamFiles>;
    setSparams: Dispatch<SetStateAction<Record<string, SparamFiles>>>;
}

export function SparamGraph({ navCollapsed, fileData, setFileData, sparams, setSparams }: SparamGraphProps) {
    const width = "100%"
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    const [lineData, setLineData] = useState<any[]>([]);
    const [highlightModalOpened, { open: openHighlightModal, close: closeHighlightModal }] = useDisclosure(false); // Disclosure used for highlight modal
    const highlightButton = HighlightButton(openHighlightModal); // highlight area of graph button
    const [SetAxesModalOpened, { open: openSetAxesModal, close: closeSetAxesModal }] = useDisclosure(false); // Disclosure used for highlight modal
    const setAxesButton = SetAxesButton(openSetAxesModal); // highlight area of graph button
    const [highlights, setHighlights] = useState<HighlightShape[]>([]);
    const [axes, setAxes] = useState<AxesRange>({x0: null, x1: null, y0: null, y1: null});
    const [plotKey, setPlotKey] = useState(0);
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const timer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone

    /* Update the height to make our graph responsive to changes in window size */
    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight * 0.85);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerHeight]);


    /* Assign all of the sparams to an array of lines to plot */
    useEffect(() => {
        const allSObjects: DataSet[] = [];

        // Get each sparam, assign a color, and store it in allSObjects
        let i = 0;
        for (const filename in sparams) {
            const fileData = sparams[filename];
            for (const key in fileData) {
                if (key.startsWith('s')) {
                    // Assign the line color and then append it to the lineData list
                    (fileData[key] as any).color = okabe_ito_colors[i % okabe_ito_colors.length]
                    allSObjects.push(fileData[key])
                    i += 1
                }
            }
        }

        // Show dropzone when no data is present
        if (allSObjects.length === 0) {
            setDropzoneVisible(true);
        } else {
            setDropzoneVisible(false);
        }

        setLineData(allSObjects);
    }, [sparams]);

    /* Send the new files to the backend for processing */
    const getSparams = async (complexDataObjs: any[]) => {
        if (complexDataObjs.length !== 0) {
            try {
                const response = await fetch(`${config.api_url}/sparams`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(complexDataObjs)
                });

                if (!response.ok) {

                    notifications.show({
                        color: 'red',
                        title: 'Bad network response',
                        message: '',
                        classNames: classes,
                    })

                    throw new Error('Network response was not ok');
                }

                const responseData: Record<string, SparamFiles> = await response.json();
                console.log('Successfully sent data to the backend', responseData);

                // Append the new sparams data
                setSparams(prevSparams => ({
                    ...prevSparams,
                    ...responseData
                }));


            } catch (error) {
                console.error('Error sending data to the backend', error);

                notifications.show({
                    color: 'red',
                    title: 'Failed to upload files',
                    message: '',
                    classNames: classes,
                })
            }
        }
    };

    useEffect(() => {
        let files: any = []

        // Append files that we do not have previously computed sparams
        if (fileData != null) {
            Object.keys(fileData).forEach((fname) => {
                if (sparams && !(fname in sparams)) {
                    const obj: any = {};
                    obj[fname] = fileData[fname]
                    files.push(obj)
                }
            })
        }

        getSparams(files)

    }, [fileData]);

    useEffect(() => {
        setPlotKey(prevKey => prevKey + 1);
    }, [highlights, navCollapsed]);


    const handleLegendClick = (e: any) => {
        const [fname, sname] = e.data[e.curveNumber].name.split(" ");

        setSparams(prevSparams => {
            const updatedFileData = { ...prevSparams[fname] };
            const graphData = updatedFileData[sname] as unknown as SGraphDataLiteral;
            graphData.visible = !graphData.visible;
            return { ...prevSparams, [fname]: updatedFileData };
        });

        return false; // Prevent default legend click behavior
    };

    /* Handle when a file is dragged onto the window */
    const handleDragOver = () => {
        if (!dropzoneVisible) {
            setDropzoneVisible(true); // Set dropzone visible when a file is dragged over
        }
        if (timer.current) {
            clearTimeout(timer.current as number); // Clear any existing timer
        }
    };

    /* Handle when a dragged file leaves the window */
    const handleDragLeave = () => {
        // Delay hiding dropzone by 200 milliseconds to prevent flickering
        timer.current = setTimeout(() => {
            // FIXME: When dragging a file onto the screen and then off the screen,
            // should the dropzone text only be turned off if sparams has data?
            if (fileData && Object.keys(fileData).length > 0) {
                setDropzoneVisible(false);
            }
        }, 100);
    };

    // Handler for relayout event to detect when autoscale or manual axis changes happen
    const handleRelayout = (layout: any) => {
        if (layout['xaxis.autorange'] || layout['yaxis.autorange']) {

            // Check if the autoscale happened by verifying if ranges are not manually set
            const { 'xaxis.range[0]': x0, 'xaxis.range[1]': x1, 'yaxis.range[0]': y0, 'yaxis.range[1]': y1 } = layout;

            // Update the axes state accordingly, null means auto-scaling
            setAxes({
                x0: x0 ?? null,
                x1: x1 ?? null,
                y0: y0 ?? null,
                y1: y1 ?? null,
            });
        }
    };

    // Convert values to numbers, default to NaN if they are null or undefined
    const x0 = typeof axes.x0 === 'number'
        ? axes.x0
        : isNaN(parseFloat(String(axes.x0)))
            ? NaN
            : parseFloat(String(axes.x0)) / 1e9;

    const x1 = typeof axes.x1 === 'number'
        ? axes.x1
        : isNaN(parseFloat(String(axes.x1)))
            ? NaN
            : parseFloat(String(axes.x1)) / 1e9;

    const y0 = typeof axes.y0 === 'number'
        ? axes.y0
        : isNaN(parseFloat(String(axes.y0)))
            ? NaN
            : parseFloat(String(axes.y0)) / 1e9;

    const y1 = typeof axes.y1 === 'number'
        ? axes.y1
        : isNaN(parseFloat(String(axes.y1)))
            ? NaN
            : parseFloat(String(axes.y1)) / 1e9;

    // Ensure range is set only if both bounds are defined and valid
    const xRange = (isNaN(x0) && isNaN(x1)) ? undefined : [Math.min(x0, x1), Math.max(x0, x1)];
    const yRange = (isNaN(y0) && isNaN(y1)) ? undefined : [Math.min(y0, y1), Math.max(y0, y1)];

    return (
        <Container
            fluid
            w={width}
            style={{ height: height }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <HighlightModal 
                highlights={highlights} 
                setHighlights={setHighlights} 
                opened={highlightModalOpened} 
                close={closeHighlightModal} 
            />
            <SetAxesModal 
                axesRanges={axes} 
                setAxesRanges={setAxes} 
                opened={SetAxesModalOpened} 
                close={closeSetAxesModal} 
                allowedAxes={{xaxis: true, yaxis: true}} 
            />
            <Plot
                key={plotKey}
                data={
                    [
                        ...lineData.map((s) => ({
                            x: s.data.map((item: any) => item.frequency),
                            y: s.data.map((item: any) => item.value),
                            type: 'scatter',
                            mode: 'lines',
                            name: s.name,
                            line: { color: s.color },
                            visible: s.visible ? true : 'legendonly',
                        }))
                    ]
                }
                layout={{
                    title: '<b>[click to edit title]</b>',
                    font: {
                        family: "Open Sans, Arial", // System must have at least one of these fonts installed
                        color: "#444",
                        size: 16,
                    },
                    autosize: true,
                    margin: { autoexpand: true },
                    hovermode: 'x',
                    xaxis: {
                        ticksuffix: 'G',
                        title: 'Hz',
                        type: 'linear',
                        autorange: xRange === undefined ,
                        range: xRange,
                        exponentformat: 'SI',
                        showgrid: true,
                        gridcolor: "#eee",
                        gridwidth: 1,
                        hoverformat: '.3f',
                        zeroline: true,
                        zerolinecolor: "#444",
                        zerolinewidth: 1,
                        tickformatstops: [
                            {
                                dtickrange: [null, 0.01], // Apply this format when the zoom level is very high (small range)
                                value: '.3f' // Format to 3 decimal places
                            },
                            {
                                dtickrange: [0.01, 0.1], // Less zoomed in
                                value: '.2f' // Format to 2 decimal places
                            },
                            {
                                dtickrange: [0.1, 1], // Even less zoomed
                                value: '.1f' // Format to 1 decimal place
                            },
                            {
                                dtickrange: [1, null], // Default zoom level (or zoomed out)
                                value: '.0f' // Format to 0 decimal places
                            }
                        ],
                    },
                    yaxis: {
                        title: 'dB',
                        type: 'linear',
                        autorange: yRange === undefined,
                        range: yRange,
                        exponentformat: 'SI',
                        showgrid: true,
                        gridcolor: "#eee",
                        gridwidth: 1,
                        hoverformat: '.1f',
                        zeroline: true,
                        zerolinecolor: "#444",
                        zerolinewidth: 1,
                    },
                    legend: { bgcolor: '#eee', xanchor: 'left', y: 1, yanchor: 'top' },
                    shapes: highlights,
                }}
                style={{ width, height: '100%' }}
                useResizeHandler={true}
                config={{
                    displaylogo: false,
                    showTips: false,
                    editable: true,
                    modeBarButtonsToAdd: [highlightButton, setAxesButton],
                }}
                onLegendClick={handleLegendClick}
                onRelayout={handleRelayout}
            />

            { /* Dropzone is last in the container so react can render it on top*/}
            {dropzoneVisible &&
                <FileDropzone
                    fileData={fileData}
                    setFileData={setFileData}
                    dropzoneVisible={dropzoneVisible}
                    setDropzoneVisible={setDropzoneVisible}
                />
            }
        </Container>
    );
}