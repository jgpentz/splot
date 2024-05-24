import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Container, Group, Text, rem } from '@mantine/core';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css';
import { SparamData } from '@/pages/Sparams.page';

const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page D', uv: 200, pv: 2400, amt: 2400 },
    { name: 'Page E', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page F', uv: 270, pv: 2400, amt: 2400 },
];


interface SparamGraphProps {
    sparams: SparamData[];
    setSparams: Dispatch<SetStateAction<SparamData[]>>;
}

export function SparamGraph({sparams, setSparams}: SparamGraphProps) {
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    const [lineData, setLineData] = useState([]);
    const timer = useRef<number | NodeJS.Timeout | null>(null); // Timer to delay hiding dropzone

    // This squelches the warning about XAxis and YAxis default props
    // see: https://github.com/recharts/recharts/issues/3615
    const error = console.error;
    console.error = (...args: any) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };

    
    /* Update the height to make our graph responsive to changes in window size */
    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight * 0.85);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerHeight]);

    useEffect(() => {
        const allSObjects = [];

        for (const filename in sparams) {
            const fileData = sparams[filename];
            for (const key in fileData) {
                if (key.startsWith('s')) {
                    allSObjects.push(fileData[key])
                }
            }
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

            const responseData: SparamData = await response.json();
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
            if (sparams.length === 0) {
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
            w='90%'
            style={{ height: height }} 
            p='50'
            onDragOver={handleDragOver} // Add drag over event listener
            onDragLeave={handleDragLeave} // Add drag leave event listener
        >
            <ResponsiveContainer>
                <LineChart>
                    <CartesianGrid  strokeDasharray="3 3" />
                    <XAxis dataKey="frequency" type="number" allowDuplicatedCategory={false} />
                    <YAxis dataKey="value" />
                    <Tooltip />
                    {lineData.map((s) => (
                        <Line dataKey="value" data={s.data} name={s.name} key={s.name} dot={false} />
                    ))}
                </LineChart>
            </ResponsiveContainer>

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
