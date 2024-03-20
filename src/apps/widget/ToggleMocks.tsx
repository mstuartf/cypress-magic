import React from "react";
import Toggle from "./Toggle";
import { useDispatch, useSelector } from "react-redux";
import { selectMockNetworkRequests } from "./redux/selectors";
import { setMockNetworkRequests } from "./redux/slice";

const ToggleMocks = () => {
  const dispatch = useDispatch();
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  return (
    <Toggle
      label="Mock network requests"
      checked={mockNetworkRequests}
      onChange={() => {
        dispatch(setMockNetworkRequests(!mockNetworkRequests));
      }}
    />
  );
};

export default ToggleMocks;
