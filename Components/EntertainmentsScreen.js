// Components/EntertainmentsScreen.js
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

const BG = require('../assets/bg.png');

const ICONS = {
  fun: require('../assets/ic_fun.png'),
};

const ENTERTAINMENT_IMAGES = {
  thunderspin: require('../assets/slot_thunderspin.png'),
  show: require('../assets/entertainment_show.png'),
  spin1: require('../assets/spin1.png'),
  spin2: require('../assets/spin2.png'),
  spin3: require('../assets/spin3.png'),
};

const PALETTE = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  accent: '#FF8A3C',
  accentSoft: '#FFB23C',
  text: '#F2F4FF',
  dim: '#8B90B2',
  success: '#4FF0D2',
};

// Типы для фильтра
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'slot', label: 'Slots' },
  { key: 'live', label: 'Live shows' },
  { key: 'tournament', label: 'Tournaments' },
];

// Статичные данные по развлечениям
const ENTERTAINMENTS = [
  {
    id: 'thunderspin',
    title: 'Thunder Spin',
    type: 'slot',
    typeLabel: 'Slot machine',
    tag: 'High-volatility · Featured',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.thunderspin,
    isNew: true,
    isTonight: true,
    description:
      'Fast-paced slot with electric visuals, stacked wilds and a chance to trigger bonus lightning rounds.',
  },
  {
    id: 'live_show_a',
    title: 'Live Show A',
    type: 'live',
    typeLabel: 'Live show',
    tag: 'Main stage · Tonight',
    time: '22:00 – 23:30',
    minBet: null,
    image: ENTERTAINMENT_IMAGES.show,
    isNew: false,
    isTonight: true,
    description:
      'Dynamic performance with music, light effects and interactive elements for the audience.',
  },
  {
    id: 'slot_classic',
    title: 'Golden Classic',
    type: 'slot',
    typeLabel: 'Slot machine',
    tag: 'Classic reels',
    time: 'Available until 04:00',
    minBet: 'From 0.5 credit',
    image: ENTERTAINMENT_IMAGES.thunderspin,
    isNew: false,
    isTonight: true,
    description:
      'Traditional three-reel experience with a modern neon touch, ideal for relaxed play.',
  },
  {
    id: 'spin1',
    title: 'Beach Paradise',
    type: 'slot',
    typeLabel: 'Slot machine',
    tag: 'Tropical vibes',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin1,
    isNew: false,
    isTonight: true,
    description:
      'Tropical slot with beach vibes, palm trees and ocean waves bringing paradise to your screen.',
  },
  {
    id: 'spin2',
    title: 'Sunset Waves',
    type: 'slot',
    typeLabel: 'Slot machine',
    tag: 'Ocean breeze',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin2,
    isNew: false,
    isTonight: true,
    description:
      'Relaxing slot inspired by sunset over the ocean with smooth gameplay and refreshing bonus rounds.',
  },
  {
    id: 'spin3',
    title: 'Coconut Island',
    type: 'slot',
    typeLabel: 'Slot machine',
    tag: 'Island treasure',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin3,
    isNew: false,
    isTonight: true,
    description:
      'Exotic island adventure with hidden treasures, coconuts and tropical jackpots waiting to be discovered.',
  },
  {
    id: 'tournament_blackjack',
    title: 'Blackjack Tournament',
    type: 'tournament',
    typeLabel: 'Tournament',
    tag: 'Seats limited',
    time: 'Starts at 23:00',
    minBet: 'Buy-in at desk',
    image: ENTERTAINMENT_IMAGES.show,
    isNew: true,
    isTonight: true,
    description:
      'Structured blackjack tournament for experienced players who enjoy strategy and competition.',
  },
];

export default function EntertainmentsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return ENTERTAINMENTS;
    return ENTERTAINMENTS.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const handleOpenDetails = (item) => {
    navigation.navigate('EntertainmentDetails', {
      entertainmentId: item.id,
    });
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerTagRow}>
                <Image source={ICONS.fun} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.headerTagText}>Entertainments</Text>
              </View>
              <Text style={styles.headerTitle}>Games & shows tonight</Text>
              <Text style={styles.headerSubtitle}>
                Explore slots, live shows and tournaments available in the venue.
              </Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersRow}>
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  style={({ pressed }) => [
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Info line */}
          <Text style={styles.infoText}>
            Showing {filteredList.length} option
            {filteredList.length === 1 ? '' : 's'} for tonight.
          </Text>

          {/* Cards */}
          <View style={styles.cardsColumn}>
            {filteredList.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleOpenDetails(item)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && { opacity: 0.92 },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <View style={styles.cardOverlayTop}>
                  <View style={styles.typePill}>
                    <Text style={styles.typePillText}>{item.typeLabel}</Text>
                  </View>
                  <View style={styles.flagsRow}>
                    {item.isTonight && (
                      <View style={styles.flagPill}>
                        <Text style={styles.flagText}>Tonight</Text>
                      </View>
                    )}
                    {item.isNew && (
                      <View style={[styles.flagPill, styles.flagPillNew]}>
                        <Text style={styles.flagTextNew}>New</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.cardOverlayBottom}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.tag ? (
                    <Text style={styles.cardTag}>{item.tag}</Text>
                  ) : null}
                  <View style={styles.metaRow}>
                    {item.time ? (
                      <Text style={styles.metaText}>{item.time}</Text>
                    ) : null}
                    {item.minBet ? (
                      <Text style={styles.metaText}>{item.minBet}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Hint */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>How it works</Text>
            <Text style={styles.hintText}>
              This list helps you quickly see what is available tonight. For
              detailed rules, payouts or registration for tournaments, please
              ask staff at your table or at the main desk.
            </Text>
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
    marginBottom: 14,
  },
  headerLeft: {
    paddingRight: 12,
  },
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
    lineHeight: 19,
  },

  /* Filters */
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
    marginRight: 8,
  },
  filterChipActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  filterChipText: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: PALETTE.accentSoft,
  },

  infoText: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 8,
  },

  /* Cards */
  cardsColumn: {
    marginBottom: 14,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.95)',
  },
  cardImage: {
    width: '100%',
    height: 220,
  },
  cardOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  typePillText: {
    color: PALETTE.accentSoft,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  flagsRow: {
    flexDirection: 'row',
  },
  flagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
    marginLeft: 6,
  },
  flagPillNew: {
    backgroundColor: 'rgba(79, 240, 210, 0.2)',
  },
  flagText: {
    color: PALETTE.accentSoft,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  flagTextNew: {
    color: PALETTE.success,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardOverlayBottom: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardTitle: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardTag: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: PALETTE.dim,
    fontSize: 12,
  },

  /* Hint */
  hintBox: {
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  hintTitle: {
    color: PALETTE.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  hintText: {
    color: PALETTE.dim,
    fontSize: 12,
    lineHeight: 18,
  },

  bottomSpacer: {
    height: 28,
  },
});
