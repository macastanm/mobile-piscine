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
				<>
					<Text style={styles.title}>
						{location.name !== '' ? `${location.name}` : 'Weekly'}
					</Text>
					{weeklyData.length > 0 && (
						<LineChart
							data={chartData}
							width={screenWidth - 32}
							height={220}
							chartConfig={{
								backgroundColor: 'rgba(255, 255, 255, 0.8)',
								backgroundGradientFrom: 'rgba(255, 255, 255, 0.8)',
								backgroundGradientTo: 'rgba(255, 255, 255, 0.8)',
								color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
								labelColor: () => "#333",
								propsForDots: { r: "4" },
							}}
							style={styles.chart}
						/>
					)}
					<View style={{flexDirection: 'row'}}>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={true}
						style={styles.dayScroll}>
						{weeklyData.map((day, index) => (
							<View key={index} style={styles.dayCard}>
								<Text style={styles.dayTime}>{day.day}</Text>
								<Text style={styles.dayIcon}>{getWeatherIcon(day.code)}</Text>
								<Text style={styles.dayTempMax}>{day.max}°C</Text>
								<Text style={styles.dayTempMax}>max</Text>
								<Text style={styles.dayTempMin}>{day.min}°C</Text>
								<Text style={styles.dayTempMin}>min</Text>
							</View>
						))}
					</ScrollView>
					</View>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 16,
		alignItems: 'center',
		gap: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		padding: 12,
		borderRadius: 8,
	},
	errorText: {
		color: 'red',
		fontSize: 16,
		textAlign: 'center',
	},
	chart: {
		borderRadius: 8,
		marginBottom: 20,
		textAlign: 'center',
	},
	dayScroll: {
		flexDirection: 'row',
		paddingHorizontal: 4,
		flexGrow: 1,
	},
	dayCard: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		width: 90,
	},
	dayTime: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 6,
	},
	dayTempMax: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 6,
		color: '#ef4444',
	},
	dayTempMin: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 6,
		color: '#3b82f6',
	},
	dayIcon: {
		fontSize: 24,
		marginBottom: 6,
	},
});
