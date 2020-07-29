/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

  React.useEffect(() => {
    const degree_update_rate = 3;

    const timer = setTimeout(() => {
      Geolocation.getCurrentPosition((info) => setPosition(info));
      console.log('position', position);

      CompassHeading.start(degree_update_rate, (degree) => {
        setCompassHeading(degree);

        console.log('compass', compassHeading);
      });

      if (position && compassHeading && isStart && aicarId) {
        console.log('post');

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
        }).then((r) => console.log(r));
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      CompassHeading.stop();
    };
  }, [aicarId, compassHeading, isStart, position]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <TextInput
            value={`${aicarId}`}
            onChangeText={(text) => setAicarId(text)}
          />
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

const styles = StyleSheet.create({});

export default App;
