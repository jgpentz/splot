import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, Container, Group, Text, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css';
import { SparamFile } from '@/pages/Sparams.page';

const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page D', uv: 200, pv: 2400, amt: 2400 },
    { name: 'Page E', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page F', uv: 270, pv: 2400, amt: 2400 },
];

interface SparamGraphProps {
    sparams: SparamFile[];
    setSparams: Dispatch<SetStateAction<SparamFile[]>>;
}

export function SparamGraph({sparams, setSparams}: SparamGraphProps) {
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    let timer; // Timer to delay hiding dropzone

    
    /* Update the heigh to make our graph responsive to changes in window size */
    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight * 0.85);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerHeight]);

    /* Send file data to backend, then store the processed data in sparams list */
    const processFileData = (files: File[]) => {
        const newSparams: SparamFile[] = []
        const regex = /^s\d+p$/;

        // Function to read a file as an ArrayBuffer and return a promise
        const readFileAsArrayBuffer = (file: File): Promise<SparamFile> => {
            return new Promise((resolve, reject) => {
                // Create a file reader and set up event handlers for the FileReader
                const reader = new FileReader();
                reader.onabort = () => reject('file reading aborted');
                reader.onerror = () => reject('file reading error');
                reader.onload = () => resolve({filename: file.name, data: reader.result});
                reader.readAsArrayBuffer(file); // Start reading the file
            });
        };

        // Go through each file, creating a new promise to process snp files
        const promises = [];
        for (let i = 0; i < files.length; i++) {
            const fname = files[i].name.split('.');
            const fext = fname[fname.length - 1].toLowerCase();

            // Only accept files that have an extension of sNp
            if(regex.test(fext)) {
                promises.push(readFileAsArrayBuffer(files[i]))
            }
        }

        // Wait for all file reading promises to resolve
        Promise.all(promises)
            .then(results => {
                results.forEach(result => {
                    // Add each resolved file data object to the newSparams array
                    newSparams.push(result);
                });
                // Update the sparams state with the new file data
                setSparams((prevSparams) => [...prevSparams, ...newSparams]);
            })
            .catch(error => {
                console.error(error);
            })

        // Send the new files to the backend for processing

    }

    /* Handle file drop */
    const handleDrop = (files: File[]) => {
        console.log('accepted files', files);
        setDropzoneVisible(false); // Hide dropzone after file is dropped
        processFileData(files)
    };

    /* Handle rejected file types */
    const handleReject = (files: File[]) => {
        console.log('rejected files', files);
        setDropzoneVisible(false); // Hide dropzone if file is rejected
    };

    /* Handle when a file is dragged onto the window */
    const handleDragOver = () => {
        if (!dropzoneVisible) {
            setDropzoneVisible(true); // Set dropzone visible when a file is dragged over
        }
        clearTimeout(timer); // Clear any existing timer
    };

    /* Handle when a dragged file leaves the window */
    const handleDragLeave = () => {
        // Delay hiding dropzone by 200 milliseconds to prevent flickering
        timer = setTimeout(() => {
            setDropzoneVisible(false);
        }, 50);
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
                <LineChart data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" label={{ value: 'Hz', position: 'insideBottom', offset: -10 }} />
                    <YAxis label={{ value: 'dB', angle: -90, position: 'insideLeft', offset: -20 }} />
                    <Tooltip />
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
