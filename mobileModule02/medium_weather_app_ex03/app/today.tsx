import {ScrollView, View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";
import {useEffect, useState} from "react";
import {getWeatherDescription} from "@/app/utils";

export default function TodayScreen() {
	const { location } = useLocation();
	const isError = location.name === 'Error';

	const [hourlyData, setHourlyData] = useState<any[]>([]);
	useEffect(() => {
		const fetchTodayWeather = async () => {
			if (location.latitude && location.longitude && location.name !== 'Error') {
				const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
				try {
					const response = await fetch(
						`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,windspeed_10m,weathercode&timezone=auto&start_date=${today}&end_date=${today}`
					);
					const data = await response.json();
					const { time, temperature_2m, windspeed_10m, weathercode } = data.hourly;

					// Create combined hourly list
					const hourly = time.map((t: string, index: number) => ({
						time: t.split('T')[1], // "HH:MM"
						temp: temperature_2m[index],
						wind: windspeed_10m[index],
						code: weathercode[index],
					}));

					setHourlyData(hourly);
				} catch (error) {
					console.error('Hourly weather fetch failed', error);
				}
			}
		};
		fetchTodayWeather();
	}, [location]);

	return (
		<View style={styles.container}>
			{ isError ? (
				<View style={{ alignItems: 'center' }}>
					<Text style={styles.errorText}>{location.latitude}</Text>
					<Text style={styles.errorText}>{location.longitude}</Text>
				</View>
			) : (
				<View style={{ flex: 1 }}>
					<Text style={styles.title}>{location.name !== '' ? `${location.name}` : 'Today'}</Text>
					<ScrollView style={{ marginTop: 16 }} contentContainerStyle={{ paddingBottom: 16 }}>
						{hourlyData.map((hour, index) => (
							<View key={index} style={styles.hourBlock}>
								<Text style={styles.hourHeader}>{hour.time} - {hour.temp}°C</Text>
								<Text style={styles.hourDetails}>
									{hour.wind} km/h | {getWeatherDescription(hour.code)}
								</Text>
							</View>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
	title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
	errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
	hourBlock: {
		backgroundColor: '#f0f0f0',
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
	},
	hourHeader: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 4,
	},
	hourDetails: {
		fontSize: 14,
		color: '#555',
	},
});
