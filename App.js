// App.js
import 'react-native-gesture-handler'; // ← обязательно первой строкой
import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* ── Splash / Loader ── */
import Loader from './Components/Loader';

/* ── WinWay Lounge: основные экраны ── */
import TodayScreen from './Components/TodayScreen';
import DressCodeDetails from './Components/DressCodeDetails';

import ServiceScreen from './Components/ServiceScreen';
import RequestHistory from './Components/RequestHistory';
import StaffListScreen from './Components/StaffListScreen';

import ServiceDeskScreen from './Components/ServiceDeskScreen';
import TicketDetails from './Components/TicketDetails';

import EntertainmentsScreen from './Components/EntertainmentsScreen';
import EntertainmentDetails from './Components/EntertainmentDetails';

import MyNightScreen from './Components/MyNightScreen';

/* ── Кастомный таббар ── */
import CustomTabBar from './Components/CustomTabBar';

/* ── WinWay навигационная тема ── */
const WinWayTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#080C1F',   // общий фон
    card: '#11152E',         // фон карточек / таббара
    text: '#F2F4FF',
    border: '#1C2142',
    primary: '#FF8A3C',      // неоновый оранжевый
    notification: '#FFB23C',
  },
};

const PALETTE = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  accent: '#FF8A3C',
  accentSoft: '#FFB23C',
  text: '#F2F4FF',
  dim: '#8B90B2',
  aqua: '#4FF0D2',
  pink: '#FF4F8A',
};

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ── Today stack ── */
const TodayStack = createNativeStackNavigator();
function TodayFlow() {
  return (
    <TodayStack.Navigator screenOptions={{ headerShown: false }}>
      <TodayStack.Screen name="TodayMain" component={TodayScreen} />
      <TodayStack.Screen name="DressCodeDetails" component={DressCodeDetails} />
    </TodayStack.Navigator>
  );
}

/* ── Service stack ── */
const ServiceStack = createNativeStackNavigator();
function ServiceFlow() {
  return (
    <ServiceStack.Navigator screenOptions={{ headerShown: false }}>
      <ServiceStack.Screen name="ServiceMain" component={ServiceScreen} />
      <ServiceStack.Screen name="RequestHistory" component={RequestHistory} />
      <ServiceStack.Screen name="StaffList" component={StaffListScreen} />
    </ServiceStack.Navigator>
  );
}

/* ── Service Desk stack ── */
const DeskStack = createNativeStackNavigator();
function ServiceDeskFlow() {
  return (
    <DeskStack.Navigator screenOptions={{ headerShown: false }}>
      <DeskStack.Screen name="ServiceDeskMain" component={ServiceDeskScreen} />
      <DeskStack.Screen name="TicketDetails" component={TicketDetails} />
    </DeskStack.Navigator>
  );
}

/* ── Entertainments stack ── */
const EntertainmentsStack = createNativeStackNavigator();
function EntertainmentsFlow() {
  return (
    <EntertainmentsStack.Navigator screenOptions={{ headerShown: false }}>
      <EntertainmentsStack.Screen
        name="EntertainmentsMain"
        component={EntertainmentsScreen}
      />
      <EntertainmentsStack.Screen
        name="EntertainmentDetails"
        component={EntertainmentDetails}
      />
    </EntertainmentsStack.Navigator>
  );
}

/* ── My Night stack ── */
const MyNightStack = createNativeStackNavigator();
function MyNightFlow() {
  return (
    <MyNightStack.Navigator screenOptions={{ headerShown: false }}>
      <MyNightStack.Screen name="MyNightMain" component={MyNightScreen} />
    </MyNightStack.Navigator>
  );
}

/* ── Bottom Tabs ── */
function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Today"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          colors={{
            bg: PALETTE.bg,
            card: PALETTE.card,
            primary: PALETTE.accent,
            success: PALETTE.aqua,
            danger: PALETTE.pink,
            text: PALETTE.text,
            dim: PALETTE.dim,
            border: PALETTE.border,
          }}
        />
      )}
    >
      <Tab.Screen
        name="Today"
        component={TodayFlow}
        options={{ title: 'Today' }}
      />
      <Tab.Screen
        name="Service"
        component={ServiceFlow}
        options={{ title: 'Service' }}
      />
      <Tab.Screen
        name="Desk"
        component={ServiceDeskFlow}
        options={{ title: 'Desk' }}
      />
      <Tab.Screen
        name="Entertainments"
        component={EntertainmentsFlow}
        options={{ title: 'Fun' }}
      />
      <Tab.Screen
        name="MyNight"
        component={MyNightFlow}
        options={{ title: 'My Night' }}
      />
    </Tab.Navigator>
  );
}

/* ── Root app ── */
export default function App() {
  const [bootDone, setBootDone] = useState(false);

  useEffect(() => {
    // 6 секунд лаудера
    const t = setTimeout(() => {
      setBootDone(true);
    }, 6000);

    return () => clearTimeout(t);
  }, []);

  if (!bootDone) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={PALETTE.bg} />
      <NavigationContainer theme={WinWayTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={BottomTabs} />
          {/* сюда можно добавить модальные экраны при необходимости */}
        </RootStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
