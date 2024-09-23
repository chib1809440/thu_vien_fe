import { useState } from 'react';

import StickyHeadTable from './table';

export default function ControlPower() {
    const [projectItem, ] = useState({});

    return (
        <div>
            <StickyHeadTable projectItem={projectItem} />
        </div>
    );
}
