import { useState } from 'react';

import StickyHeadTable from './table';

export default function DistributionOfPowers() {
    const [projectItem, ] = useState({});

    return (
        <div>
            <StickyHeadTable projectItem={projectItem} />
        </div>
    );
}
