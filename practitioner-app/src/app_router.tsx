import { BrowserRouter as HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import AssignedFormsContainer from 'pages/assigned_forms/assigned_forms_container';
import FilledFormsContainer from 'pages/filled_forms/filled_forms_container';
import FormsContainer from 'pages/forms/forms_container';
import FormFill from 'pages/form_fill/form_fill';
import PatientProfile from 'pages/patient_profile/patient_profile';
import ResponseView from 'pages/response_view/response_view';
import routes from 'routes';
import GoalsListPage from 'pages/goals/goals_list_page';

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Navigate to={routes.patientProfile} />} />
            <Route path={routes.patientProfile} element={<PatientProfile />} />
            <Route path={routes.formsList} element={<FormsContainer />} />
            <Route path={routes.filledForms} element={<FilledFormsContainer />} />
            <Route path={routes.assignedForms} element={<AssignedFormsContainer />} />
            <Route path={routes.formFill} element={<FormFill />} />
            <Route path={routes.responseView} element={<ResponseView />} />
            <Route path={routes.goals} element={<GoalsListPage />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
