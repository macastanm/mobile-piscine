import { View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";

export default function TodayScreen() {
	const { location } = useLocation();
	const isError = location.name === 'Error';

	return (
		<View style={styles.container}>
			{ isError ? (
				<View style={{ alignItems: 'center' }}>
					<Text style={styles.errorText}>{location.latitude}</Text>
					<Text style={styles.errorText}>{location.longitude}</Text>
				</View>
			) : (
				<View style={{ alignItems: 'center' }}>
					<Text style={styles.title}>Today</Text>
					<Text>{location.name}</Text>
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
