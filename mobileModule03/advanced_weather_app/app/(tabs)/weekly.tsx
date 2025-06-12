import {ScrollView, View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";
import {useEffect, useState} from "react";
import {getWeatherDescription} from "@/app/utils";

export default function WeeklyScreen() {
	const { location } = useLocation();
	const isError = location.name === 'Error';

	const [weeklyData, setWeeklyData] = useState<any[]>([]);

	useEffect(() => {
		const fetchWeeklyForecast = async () => {
			if (location.latitude && location.longitude && location.name !== 'Error') {
				try {
					const res = await fetch(
						`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
					);
					const data = await res.json();
					const {time, temperature_2m_min, temperature_2m_max, weathercode} = data.daily;
					const formatted = time.map((date: string, i: number) => ({
						date,
						min: temperature_2m_min[i],
						max: temperature_2m_max[i],
						code: weathercode[i],
					}));
					setWeeklyData(formatted);
				} catch (error) {
					console.error("Failed to fetch weekly forecast:", error);
				}
			}
		}
		fetchWeeklyForecast();
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
					<Text style={styles.title}>{location.name !== '' ? `${location.name}` : 'Weekly'}</Text>
					<ScrollView style={{ marginTop: 16 }} contentContainerStyle={{ paddingBottom: 16 }}>
						{weeklyData.map((day, index) => (
							<View key={index} style={styles.dayCard}>
								<Text style={styles.dayTitle}>{day.date}</Text>
								<Text style={styles.dayInfo}>
									{day.min}°C / {day.max}°C — {getWeatherDescription(day.code)}
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
	container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: 'transparent', },
	title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
	errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
	dayCard: {
		backgroundColor: '#f0f0f0',
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
	},
	dayTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	dayInfo: {
		fontSize: 14,
		color: '#555',
	},
});
