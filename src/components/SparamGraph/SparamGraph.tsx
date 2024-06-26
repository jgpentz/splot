import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Container, FOCUS_CLASS_NAMES, Group, Text, rem } from '@mantine/core';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend, Brush, ReferenceArea } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css';
import { DataSet, SGraphDataLiteral, SGraphDataPoint, SparamFiles } from '@/pages/Sparams.page';
import { DownloadButton } from '../DownloadButton/DownloadButton';
import { notifications } from '@mantine/notifications';

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

const initialState = {
  data: [],
  refAreaLeft: "",
  refAreaRight: "",
  left: "dataMin",
  right: "dataMax",
  bottom: "dataMin",
  top: "dataMax",
  animation: true
};

interface SparamGraphProps {
    sparams: Record<string, SparamFiles>;
    setSparams: Dispatch<SetStateAction<Record<string, SparamFiles>>>;
}

export function SparamGraph({sparams, setSparams}: SparamGraphProps) {
    const chartRef = useRef(null);
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const [fileUploading, setFileUploading] = useState(false);
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    const [title, setTitle] = useState("[click to edit title]");
    const [lineData, setLineData] = useState<any[]>([]);
    const [state, setState] = useState(initialState);
    const [dummyData, setDummyData] = useState<SGraphDataLiteral>({
        name: 'DummyData.s2p',
        hide: false,
        color: okabe_ito_colors[0],
        data: Array.from({ length: 7 }, (_, i) => ({
            frequency: i * 2,
            value: Math.random() * 50
        }))
    })
    const timer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone
    const dummyDataTimer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone
    const { refAreaLeft, refAreaRight, left, right, bottom, top } = state;

    // This squelches the warning about XAxis and YAxis default props
    // see: https://github.com/recharts/recharts/issues/3615
    const error = console.error;
    console.error = (...args: any) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };

    /* Effect to regenerate random values every 3 seconds when lineData is empty */
    useEffect(() => {
        if (lineData.length === 0) {
            setState(initialState)
            dummyDataTimer.current = setInterval(() => {
                regenerateRandomValues();
            }, 3000);
        } else {
            clearInterval(dummyDataTimer.current as number);
        }

        return () => {
            clearInterval(dummyDataTimer.current as number);
        };

    }, [lineData]);

    /* Function to regenerate random values in DummyData.data */
    const regenerateRandomValues = () => {
        const newData = dummyData.data.map(item => ({
            ...item,
            value: Math.random() * 50
        }));
        setDummyData(prev => ({ ...prev, data: newData })); // Update DummyData state
    };

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
        }

        // Update the x/y axis domains
        if (allSObjects.length > 0) {
            let { left, right } = state;

            // Dummy data does not append to lines, so the getAxisYdomain doesn't work in that case
            const [bottom, top] = getAxisYDomain(
                parseFloat(left),
                parseFloat(right),
                "value", 
                1
            );

            setState((prevState: any) => ({
                ...prevState,
                left,
                right,
                bottom,
                top,
            }));
        }

        setLineData(allSObjects);
    }, [sparams]);

    /* Send the new files to the backend for processing */
    const processFileData = async (files: File[]) => {
        try {
            const formData = new FormData();

            // Append each file to the FormData object
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('http://localhost:8080/sparams', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                setFileUploading(false)
                if (lineData.length > 0){
                    setDropzoneVisible(false)
                }

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

            setDropzoneVisible(false)
            setFileUploading(false)

            // Append the new sparams data
            setSparams(prevSparams => ({
                ...prevSparams,
                ...responseData
            }));

        } catch (error) {
                console.error('Error sending data to the backend', error);
                setFileUploading(false)
                if (lineData.length > 0){
                    setDropzoneVisible(false)
                }

                notifications.show({
                    color: 'red',
                    title: 'Failed to upload files',
                    message: '',
                    classNames: classes,
                })
        }
    };

    /* Send file data to backend, then store the processed data in sparams list */
    const getFileData = (files: File[]) => {
        const newFiles: File[] = []
        const acceptedFiles = new Set()
        const regex = /^s\d+p$/;

        // Filter files that match the regex pattern
        const filteredFiles = files.filter(file => {
            const fname = file.name.split('.');
            const fext = fname[fname.length - 1].toLowerCase();
            return regex.test(fext);
        });

        filteredFiles.forEach(file => {
            acceptedFiles.add(file.name)
            newFiles.push(file)
        });

        // Notify of bad file extensions
        const rejectedFiles: string[] = []
        files.forEach(file => {
            if (!acceptedFiles.has(file.name)) {
                rejectedFiles.push(file.name)
            }
        })
        if (rejectedFiles.length) {
            notifications.show({
                color: 'red',
                title: 'Bad file extension',
                message: rejectedFiles.join(', '),
                classNames: classes,
            })
        }

        // Only send files to backend if there were files with a snp extension
        if (newFiles.length > 0) {
            processFileData(newFiles);
        } else {
            setFileUploading(false)
            // Have to set the dropzone back to visible if there are no sparams
            if (lineData.length === 0) {
                setDropzoneVisible(true);
            } else {
                setDropzoneVisible(false);
            }
        }
    }

    /* Handle file drop */
    const handleDrop = (files: File[]) => {
        console.log('received files', files);
        setFileUploading(true)
        getFileData(files)
    };

    /* Handle rejected file types */
    const handleReject = (files: FileRejection[]) => {
        console.log('rejected files', files);

        setFileUploading(false)
        if (lineData.length > 0) {
            setDropzoneVisible(false)
        }

        const fnames: string[] = [] 
        files.forEach(file => {
            fnames.push(file.file.name)
        })

        notifications.show({
            color: 'red',
            title: 'Bad file extension',
            message: fnames.join(', '),
            classNames: classes,
        })
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
            if(Object.keys(sparams).length !== 0){
                setDropzoneVisible(false);
            }
        }, 100);
    };

    /* Calculate the y axis domain based on min/max values */
    const getAxisYDomain = (
        from: number,
        to: number,
        ref: string,
        offset: number
    ) => {
        let bottom: null | number = null
        let top: null | number = null

        lineData.forEach((line) => {
            if (line.hide === false) {
                const refData = line.data.filter((d: SGraphDataPoint) => d.frequency >= from && d.frequency <= to);
                refData.forEach((d: any) => {
                    if (top === null || d[ref] > top) {
                        top = d[ref];
                    }
                    if (bottom === null || d[ref] < bottom) {
                        bottom = d[ref];
                    } 
                });
            }
        });

        // Round bottom and top
        if (bottom && top) {
            bottom = Math.floor((bottom - offset) / 10) * 10
            top = Math.ceil((top + offset) / 10) * 10
        }

        return [(bottom ?? 0), (top ?? 0)];
    };

    const formatXAxis = (tickItem: number) => {
        if (tickItem % 1 != 0) {
            return String(tickItem.toFixed(2));
        } else {
            return String(tickItem)
        }
    }

    /* Provides click and drag zoom functionality to plot */
    const zoom = useCallback(() => {
        let { refAreaLeft, refAreaRight, data } = state;

        if (refAreaLeft === refAreaRight || refAreaRight === "") {
            setState((prevState) => ({
                ...prevState,
                refAreaLeft: "",
                refAreaRight: ""
            }));
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        // yAxis domain
        const [bottom, top] = getAxisYDomain(
            parseFloat(refAreaLeft), 
            parseFloat(refAreaRight), 
            "value", 
            1
        );

    console.log(parseFloat(refAreaLeft).toFixed(1))
        setState((prevState: any) => ({
            ...prevState,
            refAreaLeft: "",
            refAreaRight: "",
            data: data.slice(),
            left: refAreaLeft,
            right: refAreaRight,
            bottom,
            top,
        }));
    }, [state]);

    const zoomOut = () => {
        setState(initialState)
    }

    /* Allow sparams to be hidden/visible from the legend */
    const handleLegendClick = (value: string) => {
        const fname = value.split(" ")[0]
        const sname = value.split(" ")[1]

        setSparams(prevSparams => {
            const updatedFileData = { ...prevSparams[fname] };

            // Have to cast to unknown first before casting to GraphData Literal
            // because the TypeScript compiler doesn't understand that
            // updatedFileData is of type DataSet.  It thinks it has type SparamFiles
            if (sname) {
                (updatedFileData[sname] as unknown as SGraphDataLiteral).hide = !(updatedFileData[sname] as unknown as SGraphDataLiteral).hide;
            } else {
                for (const key in updatedFileData) {
                    if (key.startsWith('s')) {
                        // Ensure updatedFileData[key] is treated as a GraphLiteral
                        (updatedFileData[key] as unknown as SGraphDataLiteral).hide = !(updatedFileData[key] as unknown as SGraphDataLiteral).hide;
                    }
                }
            }
            return { ...prevSparams, [fname]: updatedFileData };
        });
    }

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value);
    };

    console.log(bottom, top)
    return (
        <Container
            fluid
            w='100%'
            style={{ height: height }} 
            p='50'
            onDragOver={handleDragOver} // Add drag over event listener
            onDragLeave={handleDragLeave} // Add drag leave event listener
            onDoubleClick={zoomOut}
        >
            {/* Editable Chart Title */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={handleTitleChange} 
                    style={{ fontSize: '24px', textAlign: 'center', width: '100%', border: 'none', outline: 'none' }}
                />
            </div>
            <ResponsiveContainer ref={chartRef}>
                <LineChart 
                    onMouseDown={(e: any) => setState((prevState) => ({ ...prevState, refAreaLeft: e.activeLabel }))}
                    onMouseMove={(e: any) => refAreaLeft && setState((prevState) => ({ ...prevState, refAreaRight: e.activeLabel }))}
                    onMouseUp={zoom}
                    style={{ cursor: 'crosshair', userSelect: 'none'}}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="frequency" 
                        type="number" 
                        allowDuplicatedCategory={false} 
                        height={50}
                        domain = {[left, right]}
                        allowDataOverflow
                        unit="G"
                        tickFormatter={formatXAxis}
                    >
                        <Label 
                            value="Hz" 
                            offset={0} 
                            position="insideBottom" 
                            fontSize={20} 
                        />
                    </XAxis>
                    <YAxis 
                        dataKey="value" 
                        domain={lineData.length === 0 ? [0, 50] : [bottom, top]}
                        allowDataOverflow={left !== "dataMin"}
                        scale="linear"
                    >
                        <Label 
                            value="dB" 
                            angle={-90} 
                            position="insideLeft" 
                            fontSize={20} 
                        />
                    </YAxis>
                    <Legend 
                        layout='vertical' 
                        align='right' 
                        verticalAlign='top' 
                        wrapperStyle={{ paddingLeft: "20px" }}
                        onClick={props => handleLegendClick(props.value)}
                    />
                    <Tooltip offset={75} labelFormatter={(value) => `${value} GHz`} />

                    {/* When there is no data in the lineData array, display dummy data*/}
                    {lineData.length === 0 ? 
                    (
                        <Line 
                            key={"DummyData"} 
                            type="basis"
                            dataKey="value" 
                            data={dummyData.data} 
                            name={dummyData.name} 
                            hide={dummyData.hide} 
                            dot={false} 
                            animationDuration={1000}
                        />
                    ) : ( 
                        lineData.map((s) => (
                            <Line 
                                key={s.name} 
                                dataKey="value" 
                                data={s.data} 
                                name={s.name} 
                                hide={s.hide} 
                                dot={false} 
                                stroke={s.color}
                                strokeWidth={2}
                                animationDuration={500}
                            />
                        )
                    ))}

                    {refAreaLeft && refAreaRight && (
                        <ReferenceArea
                            x1={refAreaLeft}
                            x2={refAreaRight}
                            strokeOpacity={0.3}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
            <DownloadButton chartRef={chartRef} />

            {dropzoneVisible && (
                <Dropzone
                    onDrop={handleDrop}
                    onReject={handleReject}
                    loading={fileUploading}
                    maxSize={5 * 1024 ** 2}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '15%',
                    }}
                >
                    <Group style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <TbFileUpload
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <TbX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <TbGraph
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                            />
                        </Dropzone.Idle>
                        <div>
                            <Text size="xl" inline>
                                Drag SnP files here or click to select files
                            </Text>
                            <Text size="sm" inline mt={7}>
                                Attach as many files as you like
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            )}
        </Container>
    );
}
