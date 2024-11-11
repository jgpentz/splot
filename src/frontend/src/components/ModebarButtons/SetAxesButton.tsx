import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Accordion, ActionIcon, Button, Input, Modal, Text, Container, Tooltip } from '@mantine/core';
import Plotly from 'plotly.js-basic-dist';
import { MdAdd, MdCheck, MdClose } from 'react-icons/md';
import { TbTrash } from 'react-icons/tb';

export interface AxesRange {
	x0?: string | number | null;
	y0?: string | number | null;
	x1?: string | number | null;
	y1?: string | number | null;
}

interface allowedAxes {
	xaxis: boolean;
	yaxis: boolean;
}

interface SetAxesButtonProps {
	opened: boolean,
	close: () => void,
	axesRanges: AxesRange,
	setAxesRanges: Dispatch<SetStateAction<AxesRange>>,
	allowedAxes: allowedAxes
}

export function SetAxesModal({opened, close, axesRanges, setAxesRanges, allowedAxes}: SetAxesButtonProps) {
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof AxesRange) => {
		let value: string | null = event.target.value;
		if (value === '') {
			value = null
		}
		setAxesRanges(prevAxesRanges => {
			const updatedAxesRanges = {...prevAxesRanges, [field]: value}
			return updatedAxesRanges
		})
	};

	function formatValue(value: number | string | null | undefined) {
		return value === null || value === undefined ? '' : String(value);
	}

	return (
		<>
			<Modal opened={opened} onClose={close} title="Set Axes">
				<Container mb="1rem">
					<div style={{ display: 'flex', gap: '1rem' }}>
						<Input.Wrapper label='x0'>
							<Input 
								placeholder='1.00e9'
								value={formatValue(axesRanges.x0)} 
								disabled={!allowedAxes.xaxis} 
								onChange={(e) => handleInputChange(e, 'x0')} 
							/>
						</Input.Wrapper>
						<Input.Wrapper label='x1'>
							<Input 
								placeholder='1.00e9'
								value={formatValue(axesRanges.x1)} 
								disabled={!allowedAxes.xaxis} 
								onChange={(e) => handleInputChange(e, 'x1')} 
							/>
						</Input.Wrapper>
					</div>
					<div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
						<Input.Wrapper label='y0'>
							<Input 
								placeholder='1.00e9'
								value={formatValue(axesRanges.y0)} 
								disabled={!allowedAxes.yaxis} 
								onChange={(e) => handleInputChange(e, 'y0')} 
							/>
						</Input.Wrapper>
						<Input.Wrapper label='y1'>
							<Input 
								placeholder='1.00e9'
								value={formatValue(axesRanges.y1)} 
								disabled={!allowedAxes.yaxis} 
								onChange={(e) => handleInputChange(e, 'y1')} 
							/>
						</Input.Wrapper>
					</div>

				</Container>
			</Modal>
		</>
	)
}

export function SetAxesButton(open: () => void) {

	const setAxesButton = {
		name: 'Set Axes',
		icon: Plotly.Icons.pencil,
		click: () => {
			open();
		},
	};

	return setAxesButton;
};
