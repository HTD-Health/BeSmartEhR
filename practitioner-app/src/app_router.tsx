import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import PatientProfile from './pages/patient_profile/patient_profile';

import FormsContainer from 'pages/forms/forms_container';
import ResponsesContainer from 'pages/lists/responses_container';

export const routes = {
    root: '/',
    patientProfile: '/patient-profile',
    formsContainer: '/forms-list',
    responsesList: '/responses-list'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Navigate to={routes.patientProfile} />} />
            <Route path={routes.patientProfile} element={<PatientProfile />} />
            <Route path={routes.formsContainer} element={<FormsContainer />} />
            <Route path={routes.responsesList} element={<ResponsesContainer />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
