import { Group, Text, rem } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import { TbFileUpload, TbGraph, TbPhoto, TbX } from 'react-icons/tb';

const data = [
    {name: 'Page A', uv: 400, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 300, pv: 2400, amt: 2400},
    {name: 'Page C', uv: 300, pv: 2400, amt: 2400},
    {name: 'Page D', uv: 200, pv: 2400, amt: 2400},
    {name: 'Page E', uv: 300, pv: 2400, amt: 2400},
    {name: 'Page F', uv: 270, pv: 2400, amt: 2400},
];
export function SparamGraph () {
    return (
        <>
            {data ? (
                <Dropzone
                    onDrop={(files) => console.log('accepted files', files)}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    >
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <TbFileUpload
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <TbX
                                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                            />
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
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                        </div>
                    </Group>
                </Dropzone>
            ) : (
                <LineChart width={1200} height={600} data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            )}
        </>
    )
}