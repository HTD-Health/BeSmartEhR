import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import FormFill from './pages/form_fill/form_fill';
import PatientProfile from './pages/patient_profile/patient_profile';

import FormsContainer from 'pages/forms/forms_container';

export const routes = {
    root: '/',
    patientProfile: '/patient-profile',
    formsContainer: '/forms-list',
    formFill: '/forms-list/:id/fill'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Navigate to={routes.patientProfile} />} />
            <Route path={routes.patientProfile} element={<PatientProfile />} />
            <Route path={routes.formsContainer} element={<FormsContainer />} />
            <Route path={routes.formFill} element={<FormFill />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
