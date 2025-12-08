// Components/CustomTabBar.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = {
  Today: require('../assets/ic_tab_today.png'),
  DressCode: require('../assets/ic_tab_dress.png'),
  MyNight: require('../assets/ic_tab_mynight.png'),
  Entertainments: require('../assets/ic_tab_fun.png'),
  Service: require('../assets/ic_tab_service.png'),
  Desk: require('../assets/ic_desk.png'),
};

const DEFAULT_COLORS = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  primary: '#FF8A3C',
  success: '#4FF0D2',
  danger: '#FF6B6B',
  text: '#F2F4FF',
  dim: '#8B90B2',
};

const TAB_LABELS = {
  Today: 'Today',
  DressCode: 'Dress code',
  MyNight: 'My night',
  Entertainments: 'Fun',
  Service: 'Service',
  Desk: 'Desk',
};

const CENTER_TAB = 'MyNight';

export default function CustomTabBar({ state, descriptors, navigation, colors }) {
  const insets = useSafeAreaInsets();
  const palette = { ...DEFAULT_COLORS, ...(colors || {}) };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: 'transparent',
          paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 8,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel ??
            options.title ??
            TAB_LABELS[route.name] ??
            route.name;

          const isFocused = state.index === index;
          const isCenter = route.name === CENTER_TAB;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconSource = ICONS[route.name];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tab,
                isCenter && styles.tabCenter,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View
                style={[
                  styles.tabInner,
                  isCenter && styles.tabInnerCenter,
                  isFocused && {
                    backgroundColor: 'rgba(255,138,60,0.14)',
                    borderColor: 'rgba(255,138,60,0.75)',
                  },
                  !isCenter && !isFocused && {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  },
                ]}
              >
                {iconSource && (
                  <Image
                    source={iconSource}
                    style={[
                      styles.icon,
                      isCenter && styles.iconCenter,
                      {
                        tintColor: isFocused
                          ? palette.primary
                          : palette.dim,
                      },
                    ]}
                    resizeMode="contain"
                  />
                )}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    {
                      color: isFocused ? palette.primary : palette.dim,
                    },
                    isCenter && styles.labelCenter,
                  ]}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(17,21,46,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabCenter: {
    flex: 1.2,
  },
  tabInner: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInnerCenter: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  icon: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  iconCenter: {
    width: 51,
    height: 51,
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
  },
  labelCenter: {
    fontSize: 10,
    fontWeight: '600',
  },
});
