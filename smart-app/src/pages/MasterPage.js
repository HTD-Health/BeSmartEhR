import { Outlet, NavLink } from "react-router-dom";

const Master = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            BeSmartE(h)R
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/patientEHR" activeClassName="active" >
                  Patient in EHR
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/patientSA" activeClassName="active" >
                  Patient as Standalone
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/providerEHR" activeClassName="active" >
                  Provider in EHR
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/providerSA" activeClassName="active" >
                  Patient as Standalone
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default Master;
