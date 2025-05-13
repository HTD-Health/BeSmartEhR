import { CircularProgress } from '@mui/material';
import { JSX, useEffect, useState } from 'react';

import ContextWrapper from './launch_wrappers/context_wrapper';
import EhrWrapper from './launch_wrappers/ehr_wrapper';

const LaunchRouter = (): JSX.Element => {
    const [launchType, setLaunchType] = useState<'ehr' | 'context'>();

    useEffect(() => {
        // Detect launch type based on URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const contextParam = urlParams.get('context');

        if (contextParam) {
            setLaunchType('context');
        } else {
            setLaunchType('ehr');
        }
    }, []);

    if (!launchType) {
        return <CircularProgress />;
    }

    return launchType === 'ehr' ? <EhrWrapper /> : <ContextWrapper />;
};

export default LaunchRouter;
