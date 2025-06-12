import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useLocation } from "@/app/locationContext";
import { useEffect, useState } from "react";
import {getWeatherDescription, getWeatherIcon} from "@/app/utils";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get('window').width;

const formatDay = (dateStr: string) => {
	const date = new Date(dateStr);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${day}/${month}`;
};


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
					const { time, temperature_2m_min, temperature_2m_max, weathercode } = data.daily;
					const formatted = time.map((date: string, i: number) => ({
						date,
						day: formatDay(date),
						min: temperature_2m_min[i],
						max: temperature_2m_max[i],
						code: weathercode[i],
					}));
					setWeeklyData(formatted);
				} catch (error) {
					console.error("Failed to fetch weekly forecast:", error);
				}
			}
		};
		fetchWeeklyForecast();
	}, [location]);

	const chartData = {
		labels: weeklyData.map(day => day.day),
		datasets: [
			{
				data: weeklyData.map(day => day.min),
				color: () => '#3b82f6',
				strokeWidth: 2,
			},
			{
				data: weeklyData.map(day => day.max),
				color: () => '#ef4444',
				strokeWidth: 2,
			},
		],
		legend: ['Min Temp', 'Max Temp'],
	};

	return (
		<View style={styles.container}>
			{isError ? (
				<View style={{ alignItems: 'center' }}>
					<Text style={styles.errorText}>{location.latitude}</Text>
					<Text style={styles.errorText}>{location.longitude}</Text>
				</View>
			) : (
				<View style={{ flex: 1, width: '100%' }}>
					<Text style={styles.title}>
						{location.name !== '' ? `${location.name}` : 'Weekly'}
					</Text>

					{weeklyData.length > 0 && (
						<LineChart
							data={chartData}
							width={screenWidth - 32}
							height={220}
							chartConfig={{
								backgroundGradientFrom: "#ffffff",
								backgroundGradientTo: "#ffffff",
								color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
								labelColor: () => "#333",
								propsForDots: { r: "4" },
							}}
							style={styles.chart}
						/>
					)}

					<ScrollView style={styles.scrollList}>
						{weeklyData.map((day, index) => (
							<View key={index} style={styles.dayCard}>
								<Text style={styles.dayTitle}>{day.day}</Text>
								<Text style={styles.dayInfo}>
									{day.min}°C / {day.max}°C — {getWeatherIcon(day.code)} {getWeatherDescription(day.code)}
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
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 16,
		backgroundColor: 'transparent',
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	errorText: {
		color: 'red',
		fontSize: 16,
		textAlign: 'center',
	},
	chart: {
		marginVertical: 8,
		borderRadius: 8,
	},
	scrollList: {
		marginTop: 10,
	},
	dayCard: {
		backgroundColor: '#f3f4f6',
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
		marginHorizontal: 8,
	},
	dayTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	dayInfo: {
		fontSize: 16,
		color: '#333',
	},
});
