import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Box, Container, Group, Text, rem } from '@mantine/core';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css';
import { DataSet, SGraphDataLiteral, SparamFiles } from '@/pages/Sparams.page';
import { toPng } from 'html-to-image'
import { DownloadButton } from '../DownloadButton/DownloadButton';

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
    sparams: Record<string, SparamFiles>;
    setSparams: Dispatch<SetStateAction<Record<string, SparamFiles>>>;
}

export function SparamGraph({sparams, setSparams}: SparamGraphProps) {
    const chartRef = useRef(null);
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    const [lineData, setLineData] = useState<any[]>([]);
    const [dummyData, setDummyData] = useState<SGraphDataLiteral>({
        name: 'DummyData.s2p',
        hide: false,
        color: okabe_ito_colors[0],
        data: [
            {frequency: 0, value: Math.random() * 50},
            {frequency: 2, value: Math.random() * 50},
            {frequency: 4, value: Math.random() * 50},
            {frequency: 6, value: Math.random() * 50},
            {frequency: 8, value: Math.random() * 50},
            {frequency: 10, value: Math.random() * 50},
        ]
    })
    const timer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone
    const dummyDataTimer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone

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

        if (allSObjects.length === 0) {
            setDropzoneVisible(true);
        }

        setLineData(allSObjects);
    }, [sparams]);

    // Send the new files to the backend for processing
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
        }
    };

    /* Send file data to backend, then store the processed data in sparams list */
    const getFileData = (files: File[]) => {
        const newFiles: File[] = []
        const regex = /^s\d+p$/;

        // Filter files that match the regex pattern
        const filteredFiles = files.filter(file => {
            const fname = file.name.split('.');
            const fext = fname[fname.length - 1].toLowerCase();
            return regex.test(fext);
        });

        filteredFiles.forEach(file => {
            newFiles.push(file)
        });

        // Only send files to backend if there were files with a snp extension
        if (newFiles.length > 0) {
            processFileData(newFiles);
        } else {
            // Have to set the dropzone back to visible if there are no sparams
            if (lineData.length === 0) {
                setDropzoneVisible(true);
            }
        }
    }

    /* Handle file drop */
    const handleDrop = (files: File[]) => {
        console.log('accepted files', files);
        setDropzoneVisible(false); // Hide dropzone after file is dropped
        getFileData(files)
    };

    /* Handle rejected file types */
    const handleReject = (files: FileRejection[]) => {
        console.log('rejected files', files);
        setDropzoneVisible(false); // Hide dropzone if file is rejected
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

    return (
        <Container
            fluid
            w='100%'
            style={{ height: height }} 
            p='50'
            onDragOver={handleDragOver} // Add drag over event listener
            onDragLeave={handleDragLeave} // Add drag leave event listener
        >
            <ResponsiveContainer ref={chartRef}>
                <LineChart>
                    <CartesianGrid  strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="frequency" 
                        type="number" 
                        allowDuplicatedCategory={false} 
                        height={50}
                    >
                        <Label value="GHz" offset={0} position="insideBottom" fontSize={20} />
                    </XAxis>
                    <YAxis 
                        dataKey="value" 
                    >
                        <Label value="dB" angle={-90} position="insideLeft" fontSize={20} />
                    </YAxis>
                    <Legend layout='vertical' align='right' verticalAlign='top' wrapperStyle={{ paddingLeft: "20px" }}/>
                    <Tooltip offset={50} labelFormatter={(value) => `${value} GHz`}/>
                    {/* When there is no data in the lineData array, display dummy data*/}
                    {lineData.length === 0 ? 
                    (
                        <Line 
                            key={"DummyData"} 
                            dataKey="value" 
                            data={dummyData.data} 
                            name={dummyData.name} 
                            hide={dummyData.hide} 
                            dot={false} 
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
                            />
                        )
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <DownloadButton chartRef={chartRef} />

            {dropzoneVisible && (
                <Dropzone
                    onDrop={handleDrop}
                    onReject={handleReject}
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
