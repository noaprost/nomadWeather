import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width : SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "896b19481b5c3422e5945442f584c7bd";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [ok, setOk] = useState(true);
  const [region, setRegion] = useState("Loading...");
  const [days, setDays] = useState();
  const getWeather = async() => {
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
        <View style={styles.city}>
          <Text style={styles.cityName}>{region}</Text>
        </View>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.weather}
        >
         {days === undefined || days.length === 0 ? (<View style={{width: SCREEN_WIDTH, alignItems: "center"}}>
         <ActivityIndicator color="white" style={{marginTop: 10}} size="large" />
         </View>) 
         : 
         (days.map((day, index) => 
         <View key={index} style={styles.day}>
          <View style={{ 
              justifyContent: "space-evenly",
            }}>
            <Text style={styles.temp}>
              {parseFloat(day.temp.day).toFixed(1)}
            </Text>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          <View style={styles.icon}>
            <Fontisto name={icons[day.weather[0].main]} size={68} color="gold" />
          </View>
         </View>
         )
         )}
        </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "slateblue",
  },
  city: {
    flex: 1.4,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "gold",
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 30,
    marginRight: -30,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: "gold",
  },
  description: {
    marginTop: -30,
    fontSize: 40,
    color: "gold",
  },
  tinyText:{
    fontSize: 20,
    color: "gold",
  },
  icon: {
    marginTop: 100,
    marginLeft: 40,
    marginRight: -40,
  },
})
