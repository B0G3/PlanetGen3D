import React from "react";
import hexColor from "../../types/hexColor";

interface GlobalSettingsContextType {
    backgroundColor: hexColor;
    trajectories: boolean;

    setBackgroundColor: Function;
    setTrajectories: Function;
}

export const GlobalSettingsContext = React.createContext<GlobalSettingsContextType | null>(null);

export const useGlobalSettingsContext = (): GlobalSettingsContextType => {
    const context = React.useContext(GlobalSettingsContext);
    if (!context) {
      throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};