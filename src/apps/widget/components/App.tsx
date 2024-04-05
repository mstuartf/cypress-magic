import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHasRefreshed } from "../redux/slice";
import Resizer from "./Resizer";
import { selectSetupComplete } from "../redux/selectors";
import SetupComplete from "./SetupComplete";
import Setup from "./Setup";

function App() {
  const dispatch = useDispatch();
  const setupComplete = useSelector(selectSetupComplete);

  useEffect(() => {
    if (setupComplete) {
      dispatch(setHasRefreshed(true));
    }
  }, []);

  return <Resizer>{setupComplete ? <SetupComplete /> : <Setup />}</Resizer>;
}

export default App;
