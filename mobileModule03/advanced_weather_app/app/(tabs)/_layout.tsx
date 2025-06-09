import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	useWindowDimensions,
	ImageBackground,
	Animated,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CurrentlyScreen from "@/app/(tabs)/index";
import TodayScreen from "@/app/(tabs)/today";
import WeeklyScreen from "@/app/(tabs)/weekly";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const CurrentlyRoute = () => (
	<View style={styles.scene}>
		<CurrentlyScreen/>
	</View>
);

const TodayRoute = () => (
	<View style={styles.scene}>
		<TodayScreen/>
	</View>
);

const WeeklyRoute = () => (
	<View style={styles.scene}>
		<WeeklyScreen/>
	</View>
);

const renderScene = SceneMap({
	currently: CurrentlyRoute,
	today: TodayRoute,
	weekly: WeeklyRoute,
});

export default function TabViewBottomTabs() {
	const layout = useWindowDimensions();
	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'currently', title: 'Currently', icon: 'weather-cloudy' },
		{ key: 'today', title: 'Today', icon: 'calendar-today' },
		{ key: 'weekly', title: 'Weekly', icon: 'calendar-week' },
	]);

	const position = new Animated.Value(index);

	return (
		<ImageBackground
			source={require('@/assets/images/background.jpg')}
			style={styles.background}
			resizeMode="cover"
		>
			<View style={styles.container}>
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={(newIndex) => {
						setIndex(newIndex);
						position.setValue(newIndex);
					}}
					initialLayout={{ width: layout.width }}
					renderTabBar={() => null}
				/>

				<TabBar
					navigationState={{ index, routes }}
					jumpTo={(key) => {
						const i = routes.findIndex((r) => r.key === key);
						setIndex(i);
						position.setValue(i);
					}}
					style={styles.tabBar}
					indicatorStyle={styles.indicator}
					labelStyle={styles.label}
					position={position}
					renderIcon={({ route, focused, color }) => (
						<MaterialCommunityIcons
							name={route.icon}
							color={color}
							size={22}
							style={{ marginBottom: 4 }}
						/>
					)}
					renderLabel={({ route, color }) => (
						<Text style={[styles.label, { color }]}>{route.title}</Text>
					)}
				/>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	scene: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	text: {
		fontSize: 24,
		color: 'white',
	},
	tabBar: {
		backgroundColor: '#6200ee',
	},
	indicator: {
		backgroundColor: 'white',
	},
	label: {
		color: 'white',
	},
});
