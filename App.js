import React from 'react';
import {
  SafeAreaView,
  TextInput,
  Alert,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';

const url = 'http://tech.splinex-team.com/aicar/api/robocars/';

const App = () => {
  const [compassHeading, setCompassHeading] = React.useState(0);
  const [position, setPosition] = React.useState({});
  const [aicarId, setAicarId] = React.useState(1);
  const [isStart, setIsStart] = React.useState(false);
  const [timeout, setSendTimeout] = React.useState(200);

  const GeoData = () => {
    if (position && compassHeading && isStart && aicarId) {
      return (
        <View style={styles.card}>
          <Text>accuracy: {position.coords.accuracy}</Text>
          <Text>altitude: {position.coords.altitude}</Text>
          <Text>heading: {compassHeading}</Text>
          <Text>latitude: {position.coords.latitude}</Text>
          <Text>longitude: {position.coords.longitude}</Text>
          <Text>speed: {position.coords.speed}</Text>
          <Text>time: {new Date().toISOString()}</Text>
        </View>
      );
    }
    return (
      <View style={styles.card}>
        <Text>Please press start</Text>
      </View>
    );
  };

  React.useEffect(() => {
    const degree_update_rate = 0;
    let watchId;

    const timer = setTimeout(() => {
      Geolocation.getCurrentPosition((info) => setPosition(info));
      CompassHeading.start(degree_update_rate, (degree) => {
        setCompassHeading(degree);
      });
      watchId = Geolocation.watchPosition(
        (pos) => {
          setPosition(pos);
        },
        (e) => Alert(e.message),
      );

      if (position && compassHeading && isStart && aicarId) {
        console.log(position);

        const data = {
          phone_accuracy: position.coords.accuracy,
          phone_altitude: position.coords.altitude,
          phone_heading: compassHeading,
          phone_latitude: position.coords.latitude,
          phone_longitude: position.coords.longitude,
          phone_speed: position.coords.speed,
          phone_time: new Date().toISOString(),
        };

        fetch(`${url}${aicarId}/`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then((r) => {
          console.log('ok:', r.ok, 'status:', r.status);
          console.log('data:', JSON.stringify(data, null, 2));
        });
      }
    }, timeout);

    return () => {
      clearTimeout(timer);
      CompassHeading.stop();
      Geolocation.clearWatch(watchId);
    };
  }, [aicarId, compassHeading, isStart, position, timeout]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <GeoData />
          <View style={{...styles.card, ...styles.flexRow}}>
            <Text>AiCar ID:</Text>
            <TextInput
              style={styles.textInput}
              value={`${aicarId}`}
              onChangeText={(text) => setAicarId(text)}
            />
          </View>
          <TouchableOpacity
            style={{...styles.card, ...styles.flexRow}}
            onPress={() => setIsStart(!isStart)}>
            <Text>{isStart ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    padding: 10,
    backgroundColor: '#eee',
    width: '100%',
    height: '100%',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderColor: '#999',
    borderBottomWidth: 1,
    padding: 5,
    flex: 1,
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 9,
  },
});

export default App;
