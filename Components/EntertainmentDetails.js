// Components/EntertainmentDetails.js
import React, { useMemo } from 'react';
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

// Детальная конфигурация по каждому развлечению
const ENTERTAINMENT_DETAILS = {
  thunderspin: {
    id: 'thunderspin',
    title: 'Thunder Spin',
    typeLabel: 'Slot machine',
    tag: 'High-volatility · Featured',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.thunderspin,
    isNew: true,
    isTonight: true,
    shortDescription:
      'Fast-paced slot with electric visuals, stacked wilds and bonus lightning rounds.',
    overview:
      'Thunder Spin is a high-energy slot designed for players who enjoy fast spins, bold visuals and the possibility of bigger swings. The reels are packed with lightning symbols, wilds and bonus icons that can trigger special features.',
    bullets: [
      'High-volatility slot with potential for larger but less frequent wins.',
      'Bonus feature may be triggered by multiple lightning symbols on the reels.',
      'Best experienced with a pre-set budget and session limit.',
    ],
    bestFor: [
      'Players who enjoy intense visual effects and sound.',
      'Guests who already have some experience with modern slots.',
      'Short but dynamic sessions rather than very long play.',
    ],
    tips: [
      'Decide your budget before you start and stick to it.',
      'Take breaks between sessions to keep the experience enjoyable.',
      'If you are new to slots, ask staff to explain basic terms first.',
    ],
  },

  live_show_a: {
    id: 'live_show_a',
    title: 'Live Show A',
    typeLabel: 'Live show',
    tag: 'Main stage · Tonight',
    time: '22:00 – 23:30',
    minBet: null,
    image: ENTERTAINMENT_IMAGES.show,
    isNew: false,
    isTonight: true,
    shortDescription:
      'Dynamic live performance with music, light effects and audience interaction.',
    overview:
      'Live Show A combines modern music, choreography and lighting to create a short, focused experience on the main stage. The show is designed so that guests can enjoy it both from the bar and from seated areas.',
    bullets: [
      'Scheduled performance with a clear start and end time.',
      'Some segments may invite light participation from the audience.',
      'Sound volume is optimized for the stage area, but can feel loud nearby.',
    ],
    bestFor: [
      'Guests who want a break from gaming and just watch a performance.',
      'Groups who prefer to stay together in one area for a while.',
      'Visitors who enjoy music, lights and stage shows.',
    ],
    tips: [
      'Arrive a bit earlier if you prefer a better view of the stage.',
      'Inform staff if you are sensitive to loud sound or bright flashes.',
      'Use this time as a reset between gaming sessions.',
    ],
  },

  slot_classic: {
    id: 'slot_classic',
    title: 'Golden Classic',
    typeLabel: 'Slot machine',
    tag: 'Classic reels',
    time: 'Available until 04:00',
    minBet: 'From 0.5 credit',
    image: ENTERTAINMENT_IMAGES.thunderspin,
    isNew: false,
    isTonight: true,
    shortDescription:
      'Traditional three-reel slot with a clean layout and familiar symbols.',
    overview:
      'Golden Classic offers a more relaxed style of play inspired by older land-based slot machines. It focuses on clear symbols, simple paylines and a steady rhythm without too many animations.',
    bullets: [
      'Three-reel layout with a limited number of paylines.',
      'Easy to follow for new players thanks to simple visuals.',
      'Perfect if you prefer a calmer, retro-style experience.',
    ],
    bestFor: [
      'Guests who are new to slots and want to learn.',
      'Players who dislike overly busy visuals and effects.',
      'Short, relaxed sessions with a clear view of each spin.',
    ],
    tips: [
      'Start with smaller bets to understand how payouts work.',
      'Ask staff if you want a quick explanation of the symbols.',
      'Use the game as a warm-up before trying more complex slots.',
    ],
  },

  tournament_blackjack: {
    id: 'tournament_blackjack',
    title: 'Blackjack Tournament',
    typeLabel: 'Tournament',
    tag: 'Seats limited',
    time: 'Starts at 23:00',
    minBet: 'Buy-in at desk',
    image: ENTERTAINMENT_IMAGES.show,
    isNew: true,
    isTonight: true,
    shortDescription:
      'Structured blackjack competition for players who enjoy strategy and rankings.',
    overview:
      'The Blackjack Tournament brings together guests who are comfortable with basic blackjack rules and enjoy a bit of structured competition. Players buy in, receive a fixed stack and play through timed rounds or set hands.',
    bullets: [
      'Limited number of seats, registration required at the main desk.',
      'Rules and scoring are explained before the tournament starts.',
      'Ideal for players who already understand standard blackjack.',
    ],
    bestFor: [
      'Regular blackjack players who like a challenge.',
      'Friends who want to compete in the same structured event.',
      'Guests who prefer clear rules and a defined start and end time.',
    ],
    tips: [
      'Arrive earlier to secure a seat and read the rules calmly.',
      'Ask staff about the exact prize structure and scoring.',
      'Keep in mind this is a game of chance and skill—play for fun, not pressure.',
    ],
  },

  spin1: {
    id: 'spin1',
    title: 'Beach Paradise',
    typeLabel: 'Slot machine',
    tag: 'Tropical vibes',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin1,
    isNew: false,
    isTonight: true,
    shortDescription:
      'Tropical slot with beach vibes, palm trees and ocean waves bringing paradise to your screen.',
    overview:
      'Beach Paradise transports you to a tropical island with palm trees swaying, crystal-clear waters and sandy beaches. This slot captures the essence of a perfect beach day with vibrant visuals and relaxing gameplay.',
    bullets: [
      'Tropical theme with beach and ocean symbols.',
      'Palm tree wilds and wave bonus features.',
      'Medium volatility perfect for relaxed sessions.',
    ],
    bestFor: [
      'Players who love tropical and beach themes.',
      'Guests seeking a relaxing, vacation-like experience.',
      'Those who enjoy colorful, vibrant slot games.',
    ],
    tips: [
      'Let the tropical vibes set a relaxed mood.',
      'Watch for palm tree symbols for bonus features.',
      'Enjoy the beach atmosphere while playing responsibly.',
    ],
  },

  spin2: {
    id: 'spin2',
    title: 'Sunset Waves',
    typeLabel: 'Slot machine',
    tag: 'Ocean breeze',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin2,
    isNew: false,
    isTonight: true,
    shortDescription:
      'Relaxing slot inspired by sunset over the ocean with smooth gameplay and refreshing bonus rounds.',
    overview:
      'Sunset Waves captures the magical moment when the sun sets over the ocean. With smooth, flowing gameplay and ocean-inspired bonus features, this slot offers a serene gaming experience.',
    bullets: [
      'Sunset and ocean wave bonus rounds.',
      'Smooth, flowing gameplay mechanics.',
      'Relaxing visual and audio experience.',
    ],
    bestFor: [
      'Players who enjoy calm, serene gaming sessions.',
      'Guests looking for a peaceful slot experience.',
      'Those who appreciate ocean and sunset themes.',
    ],
    tips: [
      'Enjoy the calming sunset atmosphere.',
      'Ocean wave bonuses can bring refreshing wins.',
      'Perfect for unwinding after a busy day.',
    ],
  },

  spin3: {
    id: 'spin3',
    title: 'Coconut Island',
    typeLabel: 'Slot machine',
    tag: 'Island treasure',
    time: 'Available all night',
    minBet: 'From 1 credit',
    image: ENTERTAINMENT_IMAGES.spin3,
    isNew: false,
    isTonight: true,
    shortDescription:
      'Exotic island adventure with hidden treasures, coconuts and tropical jackpots waiting to be discovered.',
    overview:
      'Coconut Island takes you on an adventure to a hidden tropical paradise where coconuts, treasure chests and island secrets await. Discover progressive jackpots and tropical bonuses in this exotic slot experience.',
    bullets: [
      'Island treasure and coconut bonus features.',
      'Progressive jackpot with tropical rewards.',
      'Adventure-themed gameplay with hidden surprises.',
    ],
    bestFor: [
      'Players seeking island adventure themes.',
      'Guests looking for treasure and jackpot opportunities.',
      'Those who enjoy exotic, tropical gaming experiences.',
    ],
    tips: [
      'Look for treasure chest symbols for big wins.',
      'Coconut bonuses can unlock island secrets.',
      'Set limits before exploring the island treasures.',
    ],
  },
};

export default function EntertainmentDetails({ route, navigation }) {
  const entertainmentId = route?.params?.entertainmentId;

  const config = useMemo(() => {
    if (!entertainmentId) return null;
    return ENTERTAINMENT_DETAILS[entertainmentId] || null;
  }, [entertainmentId]);

  const parentNav = navigation.getParent?.();

  const handleAskStaff = () => {
    if (parentNav) {
      parentNav.navigate('Service'); // таб Service
    }
  };

  if (!config) {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>{'‹'}</Text>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          </View>
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>Entertainment not found</Text>
            <Text style={styles.emptyText}>
              We could not find details for this item in your local configuration.
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const {
    title,
    typeLabel,
    tag,
    time,
    minBet,
    image,
    isNew,
    isTonight,
    shortDescription,
    overview,
    bullets,
    bestFor,
    tips,
  } = config;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.backIcon}>{'‹'}</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Image source={ICONS.fun} style={styles.headerIcon} resizeMode="contain" />
            <Text style={styles.headerTitle}>Entertainment details</Text>
            <Text style={styles.headerSubtitle}>
              Learn more before you decide how to spend your time.
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero card */}
          <View style={styles.heroCard}>
            <Image
              source={image}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlayTop}>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>{typeLabel}</Text>
              </View>
              <View style={styles.flagsRow}>
                {isTonight && (
                  <View style={styles.flagPill}>
                    <Text style={styles.flagText}>Tonight</Text>
                  </View>
                )}
                {isNew && (
                  <View style={[styles.flagPill, styles.flagPillNew]}>
                    <Text style={styles.flagTextNew}>New</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.heroOverlayBottom}>
              <Text style={styles.heroTitle}>{title}</Text>
              {tag ? <Text style={styles.heroTag}>{tag}</Text> : null}
              <View style={styles.heroMetaRow}>
                {time ? <Text style={styles.heroMeta}>{time}</Text> : null}
                {minBet ? (
                  <Text style={styles.heroMetaSeparator}>•</Text>
                ) : null}
                {minBet ? (
                  <Text style={styles.heroMeta}>{minBet}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Short description */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{shortDescription}</Text>
          </View>

          {/* Overview + bullets */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How it feels</Text>
            <Text style={styles.paragraph}>{overview}</Text>

            {bullets && bullets.length > 0 && (
              <View style={styles.bulletsBlock}>
                {bullets.map((item, index) => (
                  <View style={styles.bulletRow} key={`b-${index}`}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Best for */}
          {bestFor && bestFor.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Best for</Text>
              {bestFor.map((item, index) => (
                <View style={styles.bulletRow} key={`bf-${index}`}>
                  <View style={styles.bulletDotSoft} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          {tips && tips.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Tips</Text>
              {tips.map((item, index) => (
                <View style={styles.tipRow} key={`tip-${index}`}>
                  <Text style={styles.tipIndex}>{index + 1}.</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Call staff button */}
          <Pressable
            onPress={handleAskStaff}
            style={({ pressed }) => [
              styles.askButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.askButtonText}>Ask staff about this</Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backIcon: {
    color: PALETTE.text,
    fontSize: 18,
    marginRight: 4,
  },
  backText: {
    color: PALETTE.text,
    fontSize: 14,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 8,
    paddingRight: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accentSoft,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    color: PALETTE.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* Hero */
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.4)',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
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
    backgroundColor: 'rgba(79,240,210,0.2)',
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
  heroOverlayBottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },
  heroTitle: {
    color: PALETTE.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  heroTag: {
    color: PALETTE.accentSoft,
    fontSize: 13,
    marginBottom: 2,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroMeta: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  heroMetaSeparator: {
    color: PALETTE.dim,
    fontSize: 12,
    marginHorizontal: 4,
  },

  /* Cards */
  card: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  sectionTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  paragraph: {
    color: PALETTE.dim,
    fontSize: 13,
    lineHeight: 20,
  },
  bulletsBlock: {
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: PALETTE.accent,
    marginTop: 7,
    marginRight: 8,
  },
  bulletDotSoft: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: PALETTE.accentSoft,
    marginTop: 7,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    color: PALETTE.dim,
    fontSize: 13,
    lineHeight: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tipIndex: {
    color: PALETTE.accentSoft,
    fontSize: 13,
    marginRight: 6,
    marginTop: 2,
  },

  /* Ask staff button */
  askButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.accent,
    marginTop: 4,
  },
  askButtonText: {
    color: '#080C1F',
    fontSize: 14,
    fontWeight: '600',
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptyText: {
    color: PALETTE.dim,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },

  bottomSpacer: {
    height: 28,
  },
});
