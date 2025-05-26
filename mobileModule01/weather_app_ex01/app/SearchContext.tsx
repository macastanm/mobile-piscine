// app/context/SearchContext.tsx
import React, { createContext, useContext, useState } from 'react';

type SearchContextType = {
	searchValue: string;
	setSearchValue: (value: string) => void;
};

const SearchContext = createContext<SearchContextType>({
	searchValue: '',
	setSearchValue: () => {},
});

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [searchValue, setSearchValue] = useState('');

	return (
		<SearchContext.Provider value={{ searchValue, setSearchValue }}>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => useContext(SearchContext);
