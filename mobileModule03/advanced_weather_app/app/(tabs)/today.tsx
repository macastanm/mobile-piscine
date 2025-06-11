import {ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import {useLocation} from "@/app/locationContext";
import {useEffect, useState} from "react";
import {getWeatherDescription, getWeatherIcon} from "@/app/utils";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

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

	const temperatureChart = {
		labels: hourlyData.slice(0, 24).map((h, i) =>
			i % 2 === 0 ? `${parseInt(h.time.split(':')[0], 10)}h` : ''
		),
		datasets: [
			{
				data: hourlyData.slice(0, 24).map(h => h.temp),
			},
		],
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
							{location.name !== '' ? `${location.name}` : 'Today'}
						</Text>
						<LineChart
							data={temperatureChart}
							width={screenWidth - 32}
							height={220}
							yAxisSuffix="°C"
							chartConfig={{
								backgroundColor: "#ffffff",
								backgroundGradientFrom: "#ffffff",
								backgroundGradientTo: "#ffffff",
								decimalPlaces: 1,
								color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
								labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
								propsForDots: {
									r: "4",
									strokeWidth: "1",
									stroke: "#1e90ff",
								},
								propsForLabels: {
									fontSize: 8,
								},
							}}
							bezier
							style={styles.chart}
						/>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.hourScroll}
						>
							{hourlyData.map((hour, index) => (
								<View key={index} style={styles.hourCard}>
									<Text style={styles.hourTime}>{hour.time}</Text>
									<Text style={styles.hourTemp}>{hour.temp}°C</Text>
									<Text style={styles.hourIcon}>{getWeatherIcon(hour.code)}</Text>
									<Text style={styles.hourWind}>🌬️ {hour.wind} km/h</Text>
								</View>
							))}
						</ScrollView>
					</>
				)}
			</View>
		);
	}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
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
	hourScroll: {
		flexDirection: 'row',
		paddingHorizontal: 4,
		flexGrow: 1,
	},
	hourCard: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		padding: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		width: 90,
	},
	hourTime: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	hourTemp: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 2,
	},
	hourIcon: {
		fontSize: 24,
	},
	hourWind: {
		fontSize: 12,
		color: '#555',
		marginTop: 2,
		textAlign: 'center',
	},
});
