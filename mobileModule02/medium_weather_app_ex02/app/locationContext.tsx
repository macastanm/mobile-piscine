import React, { createContext, useContext, useState } from 'react';

type LocationContextType = {
	location: string;
	setLocation: (location: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [location, setLocation] = useState<string>('');

	return (
		<LocationContext.Provider value={{ location, setLocation }}>
			{children}
		</LocationContext.Provider>
	);
};

export const useLocation = () => {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error('useLocation must be used within a LocationProvider');
	}
	return context;
};
