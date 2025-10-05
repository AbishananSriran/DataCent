import { createContext, useContext, useState } from "react";

// 1. Create the context
const CurrentPlanContext = createContext();

// 2. Provider
export function CurrentPlanProvider({ children }) {
  const [currentPlan, setCurrentPlan] = useState({
    project_name: "",
    client_nodes: [],
    cloudflare_nodes: [],
    data_centers: [],
    routing: [],
    money_saved: 0,
    kwh_saved: 0,
    infrastructure_plan: "",
  });

  return (
    <CurrentPlanContext.Provider value={{ currentPlan, setCurrentPlan }}>
      {children}
    </CurrentPlanContext.Provider>
  );
}

// 3. Custom hook
export function useCurrentPlan() {
  return useContext(CurrentPlanContext);
}
