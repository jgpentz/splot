import { Aside } from './Aside';

export default {
    component: Aside,
    title: 'Aside',
    decorators: [(story: any) => <div style={{ width: '300px' }}>{story()}</div>],
    tags: ['autodocs'],
};

export const Default = {
    args: {
    },
};
