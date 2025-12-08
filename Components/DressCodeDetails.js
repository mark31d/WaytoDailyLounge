// Components/DressCodeDetails.js
import React from 'react';
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

const IMAGES = {
  elegant: require('../assets/dress_elegant_sunday.png'),
  smart: require('../assets/dress_smart_casual.png'),
  neon: require('../assets/dress_neon_party.png'),
};

const ICONS = {
  allowed: require('../assets/ic_allowed.png'),
  notAllowed: require('../assets/ic_not_allowed.png'),
  tip: require('../assets/ic_tip.png'),
};

// Полное описание всех трёх дресс-кодов
const DRESS_CODES = {
  elegant: {
    key: 'elegant',
    title: 'Elegant Sunday',
    subtitle: 'Today’s dress code',
    dateLabel: 'Sunday · 18:00 – 03:00',
    heroImage: IMAGES.elegant,
    description:
      'Elegant Sunday is all about refined, evening-appropriate outfits. Think about a dinner in a good restaurant: clean lines, neat fabrics and well-polished shoes.',
    allowed: [
      'Shirts, blouses, polos and light knitwear',
      'Trousers, chinos, elegant dark jeans without rips',
      'Dresses and skirts of appropriate length',
      'Closed shoes, loafers, heels or neat boots',
    ],
    notAllowed: [
      'Sportswear and tracksuits',
      'Beachwear, flip-flops or sliders',
      'Ripped or heavily distressed clothing',
      'Caps, beanies or hoods up inside the venue',
    ],
    tips: [
      'Neutral or dark colors always look safe for Elegant Sunday.',
      'If you are unsure, go for a simple shirt and dark trousers.',
      'Outerwear can be left in the cloakroom to keep the lounge atmosphere.',
    ],
  },

  smart: {
    key: 'smart',
    title: 'Smart Casual Night',
    subtitle: 'Dress code for today',
    dateLabel: 'Friday · 19:00 – 04:00',
    heroImage: IMAGES.smart,
    description:
      'Smart Casual Night mixes comfort and style. You can be relaxed, but your look should still be clean and well-put-together, suitable for a modern lounge.',
    allowed: [
      'Smart T-shirts, polos, shirts and blouses',
      'Dark jeans or chinos without rips',
      'Casual dresses and skirts',
      'Clean sneakers, loafers or boots',
    ],
    notAllowed: [
      'Gym shorts, jerseys or active sportswear',
      'Very baggy or dirty clothing',
      'Beachwear, swimwear',
      'Flip-flops and house slippers',
    ],
    tips: [
      'A simple combination like jeans + shirt or blouse works perfectly.',
      'Avoid large logos and offensive prints on clothing.',
      'Choose clean footwear – sneakers are fine if they look fresh.',
    ],
  },

  neon: {
    key: 'neon',
    title: 'Neon Party Night',
    subtitle: 'Tonight’s theme',
    dateLabel: 'Saturday · 21:00 – 05:00',
    heroImage: IMAGES.neon,
    description:
      'Neon Party Night is bright, playful and bold. We welcome colors, glowing details and creative outfits, while keeping everything tasteful and comfortable.',
    allowed: [
      'Neon tops, graphic T-shirts, shiny fabrics',
      'Dark jeans, leather trousers, skirts or shorts of appropriate length',
      'Comfortable party shoes or clean sneakers',
      'Accessories with neon or reflective elements',
    ],
    notAllowed: [
      'Pure sportswear (training shorts, jerseys)',
      'Beachwear and swimwear',
      'Overly revealing or transparent outfits',
      'Dirty footwear or flip-flops',
    ],
    tips: [
      'Add at least one neon or bright element to your outfit.',
      'Make sure your shoes are comfortable enough for dancing.',
      'Avoid costumes or masks that can block visibility or disturb other guests.',
    ],
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
};

export default function DressCodeDetails({ route, navigation }) {
  const codeKey = route?.params?.codeKey; // 'elegant' | 'smart' | 'neon'
  const config = DRESS_CODES[codeKey];

  // Если вдруг забудешь передать codeKey – пусть сразу будет видно в деве
  if (!config) {
    console.warn('DressCodeDetails: unknown codeKey', codeKey);
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
          <View style={styles.centerFallback}>
            <Text style={styles.fallbackText}>
              Dress code configuration not found.
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const { title, subtitle, dateLabel, heroImage, description, allowed, notAllowed, tips } =
    config;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        {/* Верхняя панель с кнопкой назад */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.backIcon}>{'‹'}</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Картинка дресс-кода */}
          <View style={styles.heroCard}>
            <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay}>
              {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
              <Text style={styles.heroTitle}>{title}</Text>
              {dateLabel ? <Text style={styles.heroDate}>{dateLabel}</Text> : null}
            </View>
          </View>

          {/* Описание стиля */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Style overview</Text>
            <Text style={styles.paragraph}>{description}</Text>
          </View>

          {/* Allowed / Not allowed */}
          <View style={styles.row}>
            <View style={[styles.card, styles.halfCard]}>
              <View style={styles.sectionHeaderRow}>
                <Image source={ICONS.allowed} style={styles.sectionIcon} resizeMode="contain" />
                <Text style={styles.sectionTitle}>Allowed</Text>
              </View>
              {allowed.map((item, index) => (
                <View key={`allowed-${index}`} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.card, styles.halfCard, styles.cardDangerBorder]}>
              <View style={styles.sectionHeaderRow}>
                <Image source={ICONS.notAllowed} style={styles.sectionIcon} resizeMode="contain" />
                <Text style={[styles.sectionTitle, styles.sectionDanger]}>
                  Not allowed
                </Text>
              </View>
              {notAllowed.map((item, index) => (
                <View key={`not-${index}`} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, styles.bulletDotDanger]} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tips */}
          {tips && tips.length > 0 && (
            <View style={styles.card}>
              <View style={styles.sectionHeaderRow}>
                <Image source={ICONS.tip} style={styles.sectionIcon} resizeMode="contain" />
                <Text style={styles.sectionTitle}>Tips</Text>
              </View>
              {tips.map((item, index) => (
                <View key={`tip-${index}`} style={styles.tipRow}>
                  <Text style={styles.tipIndex}>{index + 1}.</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

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
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* Hero */
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.35)',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  heroOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  heroSubtitle: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  heroTitle: {
    color: PALETTE.text,
    fontSize: 22,
    fontWeight: '700',
  },
  heroDate: {
    color: PALETTE.dim,
    fontSize: 13,
    marginTop: 2,
  },

  card: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  halfCard: {
    flex: 1,
  },
  cardDangerBorder: {
    borderColor: 'rgba(255,107,107,0.6)',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    marginRight: 6,
    tintColor: PALETTE.accent,
  },
  sectionTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionDanger: {
    color: '#FF6B6B',
  },
  paragraph: {
    color: PALETTE.dim,
    fontSize: 14,
    lineHeight: 20,
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
    marginTop: 7,
    marginRight: 8,
    backgroundColor: PALETTE.accent,
  },
  bulletDotDanger: {
    backgroundColor: '#FF6B6B',
  },
  bulletText: {
    flex: 1,
    color: PALETTE.dim,
    fontSize: 14,
    lineHeight: 20,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tipIndex: {
    color: PALETTE.accentSoft,
    fontSize: 14,
    marginRight: 6,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 24,
  },
  centerFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: PALETTE.text,
    fontSize: 14,
  },
});
