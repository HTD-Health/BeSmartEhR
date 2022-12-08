import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import PatientProfile from './pages/patient_profile/patient_profile';

import FormsList from 'pages/forms_list/forms_list';

export const routes = {
    root: '/',
    patientProfile: '/patient-profile',
    formsList: '/forms-list'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Navigate to={routes.patientProfile} />} />
            <Route path={routes.patientProfile} element={<PatientProfile />} />
            <Route path={routes.formsList} element={<FormsList />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
