import { M } from 'vite/dist/node/types.d-aGj9QkWt';
import { Navbar } from './Navbar';

export default {
    component: Navbar,
    title: 'Navbar',
    tags: ['autodocs'],
};

export const Default = {
    args: {
        opened: true,
    },
};

export const Collapsed = {
    args: {
        opened: false,
    },
};