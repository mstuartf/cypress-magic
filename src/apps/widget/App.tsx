import React from "react";
import { useSelector } from "react-redux";
import { selectIsRecording } from "../../redux/selectors";

function App() {
  const isR = useSelector(selectIsRecording);
  return <div>WIDGET {isR ? "t" : "f"}</div>;
}

export default App;
