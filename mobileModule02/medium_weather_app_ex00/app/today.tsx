import { View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";

export default function TodayScreen() {
	const { location } = useLocation();
	const isError = location === 'Permission to access location was denied' || location === 'Error';

	return (
		<View style={styles.container}>
			{ isError ? (
				<Text style={styles.errorText}>
					Geolocation is not available, please enable it in your App settings
				</Text>
			) : (
				<View style={{ alignItems: 'center' }}>
					<Text style={styles.title}>Today</Text>
					<Text>{location}</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
	title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
	errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});
