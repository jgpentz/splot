import { TbChartLine } from 'react-icons/tb';
import { NavbarLink } from './NavbarLink';

export default {
    component: NavbarLink,
    title: 'NavbarLink',
    decorators: [(story: any) => <div style={{ width: '200px' }}>{story()}</div>],
    tags: ['autodocs'],
};

export const Default = {
    args: {
        selected: "S Params",
        collapsed: false,
        link_data: {
            link: "",
            label: "S Params",
            icon: TbChartLine
        }
    },
};

export const NotSelected = {
    args: {
        selected: "Smith Chart",
        collapsed: false,
        link_data: {
            link: "",
            label: "S Params",
            icon: TbChartLine
        }
    },
};

export const Collapsed = {
    args: {
        selected: "S Params",
        collapsed: true,
        link_data: {
            link: "",
            label: "S Params",
            icon: TbChartLine
        }
    },
};

export const CollapsedNotSelected = {
    args: {
        selected: "Smith Chart",
        collapsed: true,
        link_data: {
            link: "",
            label: "S Params",
            icon: TbChartLine
        }
    },
};