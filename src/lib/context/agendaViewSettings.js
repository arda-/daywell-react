import { createContext, useContext } from "react";

const AgendaViewSettings = createContext();

export const AgendaViewSettingsProvider = ({
  idActiveTask,
  setIdActiveTask,
  children,
}) => {
  return (
    <AgendaViewSettings.Provider value={{ idActiveTask, setIdActiveTask }}>
      {children}
    </AgendaViewSettings.Provider>
  );
};

export const useAgendaViewSettings = () => {
  return useContext(AgendaViewSettings);
};
