import React from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';

const url = 'http://tech.splinex-team.com/aicar/api/robocars/';

const App = () => {
  const [compassHeading, setCompassHeading] = React.useState(0);
  const [position, setPosition] = React.useState({});
  const [aicarId, setAicarId] = React.useState(1);
  const [isStart, setIsStart] = React.useState(false);
  const [timeout, setSendTimeout] = React.useState(500);

  const GeoData = () => {
    if (position && compassHeading && isStart && aicarId) {
      return (
        <View style={styles.pm10}>
          <Text>phone_accuracy: {position.coords.accuracy}</Text>
          <Text>phone_altitude: {position.coords.altitude}</Text>
          <Text>phone_heading: {compassHeading}</Text>
          <Text>phone_latitude: {position.coords.latitude}</Text>
          <Text>phone_longitude: {position.coords.longitude}</Text>
          <Text>phone_speed:{position.coords.speed}</Text>
          <Text>phone_time: {new Date().toISOString()}</Text>
        </View>
      );
    }
    return (
      <View style={styles.pm10}>
        <Text>Please press start</Text>
      </View>
    );
  };

  React.useEffect(() => {
    const degree_update_rate = 3;

    const timer = setTimeout(() => {
      Geolocation.getCurrentPosition((info) => setPosition(info));
      CompassHeading.start(degree_update_rate, (degree) => {
        setCompassHeading(degree);
      });

      if (position && compassHeading && isStart && aicarId) {
        fetch(`${url}${aicarId}/`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_accuracy: position.coords.accuracy,
            phone_altitude: position.coords.altitude,
            phone_heading: compassHeading,
            phone_latitude: position.coords.latitude,
            phone_longitude: position.coords.longitude,
            phone_speed: position.coords.speed,
            phone_time: new Date().toISOString(),
          }),
        }).then((r) => console.log('ok:', r.ok, 'status:', r.status));
      }
    }, timeout);

    return () => {
      clearTimeout(timer);
      CompassHeading.stop();
    };
  }, [aicarId, compassHeading, isStart, position, timeout]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <GeoData />
          <View style={styles.flexRow}>
            <Text>AiCar ID:</Text>
            <TextInput
              style={styles.textInput}
              value={`${aicarId}`}
              onChangeText={(text) => setAicarId(text)}
            />
          </View>
          <Button
            title={isStart ? 'Stop' : 'Start'}
            onPress={() => {
              setIsStart(!isStart);
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
  pm10: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
});

export default App;
