import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

import Feed from './pages/Feed';
import New from './pages/New';

import logo from './assets/logo.png';
import camera from './assets/camera.png';

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: <Image style={{ marginHorizontal: 20 }} source={logo} />,
          headerBackTitle: null,
          headerTintColor: '#000'
        }}
        mode="modal"
        // initialRouteName="New"
      >
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                  navigation.navigate('New');
                }}
              >
                <Image source={camera} />
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen
          name="New"
          component={New}
          options={{ headerTitle: 'Nova publicação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
