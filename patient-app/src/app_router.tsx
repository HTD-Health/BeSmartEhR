import { HashRouter, Route, Routes } from 'react-router-dom';

import FormsList from './pages/forms_list/forms_list';
import Home from './pages/home/home';

export const routes = {
    root: '/',
    assignedList: '/assigned-list',
    filledList: '/filled-list'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Home />} />
            <Route path={routes.assignedList} element={<FormsList status="ready" sort="-authored-on" />} />
            <Route path={routes.filledList} element={<FormsList status="completed" sort="authored-on" />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
