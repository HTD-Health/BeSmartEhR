import { HashRouter, Route, Routes } from 'react-router-dom';

import FormsList from './pages/forms_list/forms_list';
import Home from './pages/home/home';
import ResponseView from './pages/response_view/response_view';

export const routes = {
    root: '/',
    assignedList: '/assigned-list',
    filledList: '/filled-list',
    responseView: '/filled-list/:responseId/view'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Home />} />
            <Route path={routes.assignedList} element={<FormsList status="ready" sort="-authored-on" />} />
            <Route path={routes.filledList} element={<FormsList status="completed" sort="-modified" />} />
            <Route path={routes.responseView} element={<ResponseView />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
