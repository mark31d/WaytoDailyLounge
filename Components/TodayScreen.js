// Components/TodayScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserProfile from './UserProfile';

const BG = require('../assets/bg.png');

const IMAGES = {
  elegant: require('../assets/dress_elegant_sunday.png'),
  smart: require('../assets/dress_smart_casual.png'),
  neon: require('../assets/dress_neon_party.png'),
};

const ICONS = {
  calendar: require('../assets/ic_calendar.png'),
  dress: require('../assets/ic_dresscode.png'),
  service: require('../assets/ic_service.png'),
  fun: require('../assets/ic_fun.png'),
};

const ENTERTAINMENT_IMAGES = {
  thunderspin: require('../assets/slot_thunderspin.png'),
  show: require('../assets/entertainment_show.png'),
};

const PALETTE = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  accent: '#FF8A3C',
  accentSoft: '#FFB23C',
  text: '#F2F4FF',
  dim: '#8B90B2',
};

// минимальная инфа по дресс-кодам (основной текст — в DressCodeDetails)
const DRESS_CONFIG = {
  elegant: {
    key: 'elegant',
    title: 'Elegant Sunday',
    shortLabel: 'Elegant',
    subtitle: 'Refined evening outfits',
    image: IMAGES.elegant,
  },
  smart: {
    key: 'smart',
    title: 'Smart Casual Night',
    shortLabel: 'Smart Casual',
    subtitle: 'Relaxed but neat style',
    image: IMAGES.smart,
  },
  neon: {
    key: 'neon',
    title: 'Neon Party Night',
    shortLabel: 'Neon Party',
    subtitle: 'Bright and bold looks',
    image: IMAGES.neon,
  },
};

// расписание дресс-кодов на неделю (Sun–Sat)
const WEEK = [
  { id: 'sun', label: 'Sun', full: 'Sunday', codeKey: 'elegant' },
  { id: 'mon', label: 'Mon', full: 'Monday', codeKey: 'smart' },
  { id: 'tue', label: 'Tue', full: 'Tuesday', codeKey: 'smart' },
  { id: 'wed', label: 'Wed', full: 'Wednesday', codeKey: 'smart' },
  { id: 'thu', label: 'Thu', full: 'Thursday', codeKey: 'smart' },
  { id: 'fri', label: 'Fri', full: 'Friday', codeKey: 'smart' },
  { id: 'sat', label: 'Sat', full: 'Saturday', codeKey: 'neon' },
];

// хайлайты на сегодня
const HIGHLIGHTS = [
  {
    key: 'thunderspin',
    title: 'Thunder Spin',
    tag: 'Popular slot',
    time: 'From 21:00',
    image: ENTERTAINMENT_IMAGES.thunderspin,
  },
  {
    key: 'show_a',
    title: 'Live Show A',
    tag: 'Main stage',
    time: '22:00 – 23:30',
    image: ENTERTAINMENT_IMAGES.show,
  },
];

export default function TodayScreen({ navigation }) {
  const todayIndex = useMemo(() => {
    const d = new Date();
    const day = d.getDay(); // 0..6, 0 = Sunday
    return day >= 0 && day < WEEK.length ? day : 0;
  }, []);

  const [activeIndex, setActiveIndex] = useState(todayIndex);

  const activeDay = WEEK[activeIndex];
  const activeDress = DRESS_CONFIG[activeDay.codeKey];

  const badgeText =
    activeIndex === todayIndex ? 'Today' : activeDay.full;

  const goToDressDetails = () => {
    navigation.navigate('DressCodeDetails', {
      codeKey: activeDress.key,
    });
  };

  const goToServiceTab = () => {
    const parent = navigation.getParent(); // BottomTabs
    if (parent) {
      parent.navigate('Service');
    }
  };

  const goToEntertainmentsTab = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Entertainments');
    }
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile */}
          <UserProfile />

          {/* Заголовок Today */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTagRow}>
                <Image source={ICONS.calendar} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.headerTagText}>Today</Text>
              </View>
              <Text style={styles.headerTitle}>Your visit at a glance</Text>
              <Text style={styles.headerSubtitle}>
                Dress code, highlights and quick actions in one screen.
              </Text>
            </View>
          </View>

          {/* Дресс-код карточка */}
          <View style={styles.sectionHeaderRow}>
            <Image source={ICONS.dress} style={styles.sectionIcon} resizeMode="contain" />
            <Text style={styles.sectionTitle}>Today’s dress code</Text>
          </View>

          <Pressable
            style={styles.dressCard}
            onPress={goToDressDetails}
          >
                <Image
              source={activeDress.image}
              style={styles.dressImage}
              resizeMode="cover"
            />
            <View style={styles.dressOverlayTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            </View>
            <View style={styles.dressOverlayBottom}>
              <Text style={styles.dressSubtitle}>
                {activeDress.shortLabel}
              </Text>
              <Text style={styles.dressTitle}>{activeDress.title}</Text>
              <Text style={styles.dressHint}>Tap to view full rules</Text>
            </View>
          </Pressable>

          {/* Горизонтальный скролл с неделей */}
          <View style={styles.sectionTopSpacing}>
            <Text style={styles.sectionLabel}>
              Dress code schedule
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekScrollContent}
          >
            {WEEK.map((day, index) => {
              const dress = DRESS_CONFIG[day.codeKey];
              const isActive = index === activeIndex;
              const isToday = index === todayIndex;
              return (
                <Pressable
                  key={day.id}
                  onPress={() => setActiveIndex(index)}
                  style={({ pressed }) => [
                    styles.weekChip,
                    isActive && styles.weekChipActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.weekDayLabel,
                      isActive && styles.weekDayLabelActive,
                    ]}
                  >
                    {day.label}
                    {isToday ? ' · Today' : ''}
                  </Text>
                  <Text
                    style={[
                      styles.weekDressLabel,
                      isActive && styles.weekDressLabelActive,
                    ]}
                  >
                    {dress.shortLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Быстрые действия */}
          <View style={styles.sectionHeaderRow}>
            <Image source={ICONS.service} style={styles.sectionIcon} resizeMode="contain" />
            <Text style={styles.sectionTitle}>Quick actions</Text>
          </View>
          <View style={styles.quickActionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.quickCard,
                pressed && { opacity: 0.8 },
              ]}
              onPress={goToServiceTab}
            >
              <View style={styles.quickIconWrapper}>
                <Image source={ICONS.service} style={styles.quickIcon} resizeMode="contain" />
              </View>
              <Text style={styles.quickTitle}>Call staff</Text>
              <Text style={styles.quickText}>
                Request waiter, technician, cleaner or security to your table.
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.quickCard,
                pressed && { opacity: 0.8 },
              ]}
              onPress={goToEntertainmentsTab}
            >
              <View style={styles.quickIconWrapper}>
                <Image source={ICONS.fun} style={styles.quickIcon} resizeMode="contain" />
              </View>
              <Text style={styles.quickTitle}>View entertainments</Text>
              <Text style={styles.quickText}>
                Explore slots, live shows and other activities for tonight.
              </Text>
            </Pressable>
          </View>

          {/* Хайлайты на сегодня */}
          <View style={styles.sectionHeaderRow}>
            <Image source={ICONS.fun} style={styles.sectionIcon} resizeMode="contain" />
            <Text style={styles.sectionTitle}>Tonight highlights</Text>
          </View>

          <View style={styles.highlightsColumn}>
            {HIGHLIGHTS.map((item) => (
              <Pressable
                key={item.key}
                style={({ pressed }) => [
                  styles.highlightCard,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={goToEntertainmentsTab}
              >
                <Image
                  source={item.image}
                  style={styles.highlightImage}
                  resizeMode="cover"
                />
                <View style={styles.highlightOverlay}>
                  <Text style={styles.highlightTag}>{item.tag}</Text>
                  <Text style={styles.highlightTitle}>{item.title}</Text>
                  <Text style={styles.highlightTime}>{item.time}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* Header */
  headerRow: {
    marginTop: 4,
    marginBottom: 16,
  },
  headerLeft: {},
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    tintColor: PALETTE.accentSoft,
  },
  headerTagText: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    color: PALETTE.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: PALETTE.dim,
    fontSize: 13,
  },

  /* Sections */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    tintColor: PALETTE.accent,
  },
  sectionTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTopSpacing: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionLabel: {
    color: PALETTE.dim,
    fontSize: 13,
  },

  /* Dress card */
  dressCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.4)',
  },
  dressImage: {
    width: '100%',
    height: 250,
  },
  dressOverlayTop: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  badgeText: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dressOverlayBottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  dressSubtitle: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  dressTitle: {
    color: PALETTE.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  dressHint: {
    color: PALETTE.dim,
    fontSize: 12,
  },

  /* Week chips */
  weekScrollContent: {
    paddingVertical: 6,
    paddingRight: 4,
  },
  weekChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
    marginRight: 8,
  },
  weekChipActive: {
    borderColor: 'rgba(255,138,60,0.7)',
    backgroundColor: 'rgba(17,21,46,0.95)',
  },
  weekDayLabel: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 2,
  },
  weekDayLabelActive: {
    color: PALETTE.accentSoft,
  },
  weekDressLabel: {
    color: PALETTE.text,
    fontSize: 13,
    fontWeight: '500',
  },
  weekDressLabelActive: {
    color: PALETTE.text,
  },

  /* Quick actions */
  quickActionsRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 12,
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  quickIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickIcon: {
    width: 26,
    height: 26,
    tintColor: PALETTE.accent,
  },
  quickTitle: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickText: {
    color: PALETTE.dim,
    fontSize: 12,
    lineHeight: 17,
  },

  /* Highlights */
  highlightsColumn: {
    marginTop: 4,
  },
  highlightCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  highlightImage: {
    width: '100%',
    height: 180,
  },
  highlightOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
  },
  highlightTag: {
    color: PALETTE.accentSoft,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  highlightTitle: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
  },
  highlightTime: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 1,
  },

  bottomSpacer: {
    height: 28,
  },
});
