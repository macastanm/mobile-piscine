import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	useWindowDimensions,
	ImageBackground,
	Animated, Pressable,
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
			source={require('@/assets/images/background.png')}
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
				<View style={styles.customTabBar}>
					{routes.map((route, i) => {
						const isFocused = index === i;
						return (
							<Pressable
								key={route.key}
								onPress={() => setIndex(i)}
								style={styles.tabItem}
							>
								<MaterialCommunityIcons
									name={route.icon}
									size={24}
									color={isFocused ? 'white' : '#aaa'}
								/>
								<Text style={[styles.tabText, isFocused && { color: 'white' }]}>
									{route.title}
								</Text>
							</Pressable>
						);
					})}
				</View>
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
	},
	text: {
		fontSize: 24,
		color: 'white',
	},
	customTabBar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#3d7fba',
		paddingVertical: 15,
	},
	tabItem: {
		alignItems: 'center',
	},
	tabText: {
		fontSize: 12,
		color: '#aaa',
		marginTop: 2,
	},
});

