import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home/home';

export const routes = {
    root: '/'
};

const AppRouter = (): JSX.Element => (
    <HashRouter>
        <Routes>
            <Route path={routes.root} element={<Home />} />
        </Routes>
    </HashRouter>
);

export default AppRouter;
