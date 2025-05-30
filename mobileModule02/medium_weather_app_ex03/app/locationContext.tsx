import React, { createContext, useContext, useState } from 'react';

type Location = {
	name: string;
	latitude: string;
	longitude: string;
};

type LocationContextType = {
	location: Location;
	setLocation: (location: Location) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [location, setLocation] = useState<Location>({
		name: '',
		latitude: '',
		longitude: '',
	});

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
