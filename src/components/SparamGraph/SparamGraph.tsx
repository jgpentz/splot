import React, { useEffect, useState } from 'react';
import { Box, Container, Group, Text, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css';

enum ErrorCode {
  FileInvalidType = "file-invalid-type",
  FileTooLarge = "file-too-large",
  FileTooSmall = "file-too-small",
  TooManyFiles = "too-many-files",
}

interface FileError {
  message: string;
  code: ErrorCode | string;
}

const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page D', uv: 200, pv: 2400, amt: 2400 },
    { name: 'Page E', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page F', uv: 270, pv: 2400, amt: 2400 },
];

export function SparamGraph() {
    const [dropzoneVisible, setDropzoneVisible] = useState(true); // Initially, dropzone is invisible
    const [height, setHeight] = useState(window.innerHeight * 0.85);
    let timer; // Timer to delay hiding dropzone

    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight * 0.85);
        };
        
        window.addEventListener('resize', handleResize);
        console.log(height)
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerHeight]);

    const handleDrop = (files) => {
        console.log('accepted files', files);
        setDropzoneVisible(false); // Hide dropzone after file is dropped
    };

    const handleReject = (files) => {
        console.log('rejected files', files);
        setDropzoneVisible(false); // Hide dropzone if file is rejected
    };

    const handleDragOver = () => {
        if (!dropzoneVisible) {
            setDropzoneVisible(true); // Set dropzone visible when a file is dragged over
        }
        clearTimeout(timer); // Clear any existing timer
    };

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
                                Attach as many files as you like, each file should not exceed 5MB
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            )}
        </Container>
    );
}
