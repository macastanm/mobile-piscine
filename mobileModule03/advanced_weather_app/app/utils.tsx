export const getWeatherDescription = (code: number | null) => {
	const descriptions: { [key: number]: string } = {
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		45: 'Fog',
		48: 'Depositing rime fog',
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		95: 'Thunderstorm',
	};
	return code !== null ? descriptions[code] || 'Unknown' : '';
};

export const getWeatherIcon = (code: number | null) => {
	const icons: { [key: number]: string } = {
		0: '☀️',
		1: '🌤️',
		2: '⛅',
		3: '☁️',
		45: '🌫️',
		48: '🌫️',
		51: '🌦️',
		53: '🌦️',
		55: '🌧️',
		61: '🌧️',
		63: '🌧️',
		65: '🌧️',
		71: '🌨️',
		73: '🌨️',
		75: '❄️',
		95: '⛈️',
	};
	return code !== null ? icons[code] || '❓' : '';
};
