import React, { useState } from 'react';
import { Group, Text, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { TbFileUpload, TbGraph, TbX } from 'react-icons/tb';
import classes from './SparamGraph.module.css'

const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page D', uv: 200, pv: 2400, amt: 2400 },
    { name: 'Page E', uv: 300, pv: 2400, amt: 2400 },
    { name: 'Page F', uv: 270, pv: 2400, amt: 2400 },
];

export function SparamGraph() {
    const [dropzoneVisible, setDropzoneVisible] = useState(true);

    const handleDrop = (files: File[]) => {
        console.log('accepted files', files);
        setDropzoneVisible(false);
    };

    const handleReject = (files: File[]) => {
        console.log('rejected files', files);
    };

    return (
        <div style={{ width: '100%', height: '100%', margin: '50px'}}>
            <LineChart width={1600} height={800} data={data}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" label={{ value: 'Hz', position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: 'dB', angle: -90, position: 'insideLeft', offset: -20 }} />
                <Tooltip />
            </LineChart>

            {dropzoneVisible ? (
                <Dropzone
                    onDrop={handleDrop}
                    onReject={handleReject}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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
            ) : (
                <Dropzone.FullScreen
                    onDrop={handleDrop}
                    onReject={handleReject}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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
                </Dropzone.FullScreen>
            )}
        </div>
    );
}
