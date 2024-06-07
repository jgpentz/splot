import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { ActionIcon } from '@mantine/core';
import { TbDownload } from 'react-icons/tb';

interface DownloadButtonProps {
  chartRef: React.RefObject<HTMLDivElement>;
}

export function DownloadButton({chartRef}: DownloadButtonProps) {
  const downloadChart = async () => {
    if (chartRef.current === null) {
      return;
    }

    const dataUrl = await toPng(chartRef.current, { cacheBust: true });
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = dataUrl;
    link.click();
  };
  return (
    <ActionIcon size="xl" variant="transparent" onClick={downloadChart}>
        <TbDownload style={{ width: 32, height: 32 }}/>
    </ActionIcon>
  )
  return <button onClick={downloadChart}>Download Chart</button>;
};
