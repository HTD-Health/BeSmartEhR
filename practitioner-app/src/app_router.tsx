import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import PatientProfile from './pages/patient_profile/patient_profile';
import FillForm from "./pages/fill_form/fill_form";

import FormsContainer from 'pages/forms/forms_container';

export const routes = {
    root: '/',
    test: '/test',
    patientProfile: '/patient-profile',
    formsContainer: '/forms-list'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Navigate to={routes.patientProfile} />} />
            <Route path={routes.patientProfile} element={<PatientProfile />} />
            <Route path={routes.formsContainer} element={<FormsContainer />} />
            <Route path={routes.test} element={<FillForm />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
