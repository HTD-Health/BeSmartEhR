import "./App.css";
import { useEffect } from "react";
import React from "react";
import ProviderStandaloneScopeWrapper from "./components/ProviderStandaloneScopeWrapper";

function App() {

  useEffect(() => {

    console.log('app launching');
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    //tutaj nasze tab-y będą
    <div className="App">
      <ProviderStandaloneScopeWrapper></ProviderStandaloneScopeWrapper>
    </div>
  );
}

export default App;
