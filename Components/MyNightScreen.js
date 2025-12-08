// Components/MyNightScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../assets/bg.png');

const ICONS = {
  header: require('../assets/ic_mynight.png'),
  pin: require('../assets/ic_pin.png'),
  clock: require('../assets/ic_clock.png'),
  check: require('../assets/ic_allowed.png'),
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
  success: '#4FF0D2',
};

const STORAGE_KEYS = {
  mood: '@winway_mynight_mood',
  table: '@winway_mynight_table',
  plan: '@winway_mynight_plan',
  reminders: '@winway_mynight_reminders',
};

const MOODS = [
  {
    key: 'relaxed',
    label: 'Relaxed',
    desc: 'Calm pace, quieter zones, simple games.',
  },
  {
    key: 'social',
    label: 'Social',
    desc: 'Chat with friends, mix of games and shows.',
  },
  {
    key: 'high_energy',
    label: 'High energy',
    desc: 'Louder music, neon zones, dynamic games.',
  },
];

const REMINDERS = [
  {
    key: 'breaks',
    label: 'Take a short break every 45 min',
  },
  {
    key: 'water',
    label: 'Drink water regularly',
  },
  {
    key: 'budget',
    label: 'Stay within my budget',
  },
];

const ENTERTAINMENTS = [
  {
    id: 'thunderspin',
    title: 'Thunder Spin',
    tag: 'High-volatility slot',
    time: 'Available all night',
    image: ENTERTAINMENT_IMAGES.thunderspin,
  },
  {
    id: 'live_show_a',
    title: 'Live Show A',
    tag: 'Main stage · 22:00 – 23:30',
    time: 'Tonight only',
    image: ENTERTAINMENT_IMAGES.show,
  },
];

export default function MyNightScreen({ navigation }) {
  const [mood, setMood] = useState('relaxed');
  const [table, setTable] = useState('');
  const [planIds, setPlanIds] = useState([]);
  const [reminderKeys, setReminderKeys] = useState([]);

  // загрузка сохранённого состояния
  useEffect(() => {
    (async () => {
      try {
        const [moodRaw, tableRaw, planRaw, remRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.mood),
          AsyncStorage.getItem(STORAGE_KEYS.table),
          AsyncStorage.getItem(STORAGE_KEYS.plan),
          AsyncStorage.getItem(STORAGE_KEYS.reminders),
        ]);

        if (moodRaw) setMood(moodRaw);
        if (tableRaw) setTable(tableRaw);
        if (planRaw) {
          const parsed = JSON.parse(planRaw);
          if (Array.isArray(parsed)) setPlanIds(parsed);
        }
        if (remRaw) {
          const parsed = JSON.parse(remRaw);
          if (Array.isArray(parsed)) setReminderKeys(parsed);
        }
      } catch (e) {
        console.warn('MyNightScreen: load error', e);
      }
    })();
  }, []);

  // авто-сохранение настроения
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.mood, mood).catch((e) =>
      console.warn('MyNightScreen: save mood error', e)
    );
  }, [mood]);

  // авто-сохранение стола
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.table, table).catch((e) =>
      console.warn('MyNightScreen: save table error', e)
    );
  }, [table]);

  // авто-сохранение плана
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(planIds)).catch(
      (e) => console.warn('MyNightScreen: save plan error', e)
    );
  }, [planIds]);

  // авто-сохранение напоминаний
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.reminders,
      JSON.stringify(reminderKeys)
    ).catch((e) => console.warn('MyNightScreen: save reminders error', e));
  }, [reminderKeys]);

  const moodConfig = useMemo(
    () => MOODS.find((m) => m.key === mood) || MOODS[0],
    [mood]
  );

  const parentNav = navigation.getParent?.();

  const handleTogglePlan = (id) => {
    setPlanIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleReminder = (key) => {
    setReminderKeys((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const handleOpenEntertainments = () => {
    if (parentNav) parentNav.navigate('Entertainments');
  };

  const handleOpenService = () => {
    if (parentNav) parentNav.navigate('Service');
  };

  const isPlanned = (id) => planIds.includes(id);
  const hasAnyPlan = planIds.length > 0;

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
                <Image source={ICONS.header} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.headerTagText}>My night</Text>
              </View>
              <Text style={styles.headerTitle}>Your plan for tonight</Text>
              <Text style={styles.headerSubtitle}>
                Choose your mood, set your table and pick what you want to do.
              </Text>
            </View>
          </View>

          {/* Mood */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Tonight mood</Text>
            <Text style={styles.sectionHint}>
              This helps you keep the evening in the style you prefer.
            </Text>

            <View style={styles.moodsRow}>
              {MOODS.map((m) => {
                const isActive = mood === m.key;
                return (
                  <Pressable
                    key={m.key}
                    onPress={() => setMood(m.key)}
                    style={({ pressed }) => [
                      styles.moodCard,
                      isActive && styles.moodCardActive,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.moodLabel,
                        isActive && styles.moodLabelActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                    <Text style={styles.moodDesc}>{m.desc}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.moodSummaryBox}>
              <Text style={styles.moodSummaryLabel}>Current choice</Text>
              <Text style={styles.moodSummaryText}>
                Tonight you prefer a{' '}
                <Text style={styles.moodSummaryHighlight}>
                  {moodConfig.label.toLowerCase()}
                </Text>{' '}
                evening — use this screen to stay consistent with that plan.
              </Text>
            </View>
          </View>

          {/* Table & time */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>My table / zone</Text>
            <Text style={styles.sectionHint}>
              Save your table so you can quickly mention it when calling staff.
            </Text>

            <View style={styles.tableRow}>
              <View style={styles.tableIconWrapper}>
                <Image source={ICONS.pin} style={styles.tableIcon} resizeMode="contain" />
              </View>
              <TextInput
                placeholder="e.g. A12, VIP 3, Lounge C"
                placeholderTextColor="rgba(139,144,178,0.7)"
                value={table}
                onChangeText={setTable}
                style={styles.tableInput}
              />
            </View>

            <View style={styles.tableChipsRow}>
              {['A12', 'VIP 1', 'Zone B', 'Lounge C'].map((preset) => (
                <Pressable
                  key={preset}
                  onPress={() => setTable(preset)}
                  style={({ pressed }) => [
                    styles.tableChip,
                    table === preset && styles.tableChipActive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text
                    style={[
                      styles.tableChipText,
                      table === preset && styles.tableChipTextActive,
                    ]}
                  >
                    {preset}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.tableHintRow}>
              <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
              <Text style={styles.tableHintText}>
                If you move to another table, update this field so staff always
                know where to find you.
              </Text>
            </View>
          </View>

          {/* Planned entertainments */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderLeft}>
                <Image source={ICONS.fun} style={styles.sectionIcon} resizeMode="contain" />
                <Text style={styles.sectionTitle}>Planned entertainments</Text>
              </View>
              <Pressable
                onPress={handleOpenEntertainments}
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={styles.linkButtonText}>Open list</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionHint}>
              Mark what you want to try tonight. This does not reserve anything,
              it just keeps your personal checklist.
            </Text>

            <View style={styles.entCardsColumn}>
              {ENTERTAINMENTS.map((item) => {
                const planned = isPlanned(item.id);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleTogglePlan(item.id)}
                    style={({ pressed }) => [
                      styles.entCard,
                      planned && styles.entCardPlanned,
                      pressed && { opacity: 0.9 },
                    ]}
                  >
                    <Image
                      source={item.image}
                      style={styles.entImage}
                      resizeMode="contain"
                    />
                    <View style={styles.entOverlay}>
                      <View style={styles.entHeaderRow}>
                        <Text style={styles.entTitle}>{item.title}</Text>
                        <View
                          style={[
                            styles.entCheckWrapper,
                            planned && styles.entCheckWrapperActive,
                          ]}
                        >
                          <Image
                            source={ICONS.check}
                            resizeMode="contain"
                            style={[
                              styles.entCheckIcon,
                              planned && styles.entCheckIconActive,
                            ]}
                          />
                        </View>
                      </View>
                      <Text style={styles.entTag}>{item.tag}</Text>
                      <Text style={styles.entTime}>{item.time}</Text>
                      <Text style={styles.entHint}>
                        {planned ? 'Added to tonight plan' : 'Tap to add to plan'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {hasAnyPlan ? (
              <Text style={styles.planSummaryText}>
                You have {planIds.length} activit
                {planIds.length === 1 ? 'y' : 'ies'} in your plan. Treat this as
                a guide, not a strict schedule.
              </Text>
            ) : (
              <Text style={styles.planSummaryText}>
                You have not added anything yet. Choose at least one game or
                show you don’t want to miss.
              </Text>
            )}
          </View>

          {/* Reminders */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Session reminders</Text>
            <Text style={styles.sectionHint}>
              These are not real notifications yet, but they help you keep the
              right mindset during the evening.
            </Text>

            <View style={styles.remindersColumn}>
              {REMINDERS.map((r) => {
                const active = reminderKeys.includes(r.key);
                return (
                  <Pressable
                    key={r.key}
                    onPress={() => handleToggleReminder(r.key)}
                    style={({ pressed }) => [
                      styles.reminderRow,
                      active && styles.reminderRowActive,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <View
                      style={[
                        styles.reminderCheckbox,
                        active && styles.reminderCheckboxActive,
                      ]}
                    >
                      {active && (
                        <Image
                          source={ICONS.check}
                          resizeMode="contain"
                          style={styles.reminderCheckIcon}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.reminderText,
                        active && styles.reminderTextActive,
                      ]}
                    >
                      {r.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* CTA: Call staff */}
          <Pressable
            onPress={handleOpenService}
            style={({ pressed }) => [
              styles.serviceButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.serviceButtonText}>
              Call staff from my table
            </Text>
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
  scroll: { flex: 1 },
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

  /* Card */
  card: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  sectionTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionHint: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 10,
  },

  /* Mood */
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moodCard: {
    flex: 1,
    marginRight: 8,
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(8,12,31,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  moodCardActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  moodLabel: {
    color: PALETTE.dim,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  moodLabelActive: {
    color: PALETTE.accentSoft,
  },
  moodDesc: {
    color: PALETTE.dim,
    fontSize: 11,
    lineHeight: 16,
  },
  moodSummaryBox: {
    marginTop: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  moodSummaryLabel: {
    color: PALETTE.dim,
    fontSize: 11,
    marginBottom: 2,
  },
  moodSummaryText: {
    color: PALETTE.text,
    fontSize: 12,
    lineHeight: 18,
  },
  moodSummaryHighlight: {
    color: PALETTE.accentSoft,
    fontWeight: '600',
  },

  /* Table */
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tableIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tableIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accent,
  },
  tableInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: PALETTE.text,
    fontSize: 14,
  },
  tableChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tableChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
  },
  tableChipActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  tableChipText: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  tableChipTextActive: {
    color: PALETTE.accentSoft,
  },
  tableHintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clockIcon: {
    width: 24,
    height: 24,
    tintColor: PALETTE.dim,
    marginTop: 2,
    marginRight: 6,
  },
  tableHintText: {
    color: PALETTE.dim,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },

  /* Planned entertainments */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accentSoft,
    marginRight: 6,
  },
  linkButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.7)',
    backgroundColor: 'rgba(255,138,60,0.08)',
  },
  linkButtonText: {
    color: PALETTE.accentSoft,
    fontSize: 12,
  },

  entCardsColumn: {
    marginTop: 4,
  },
  entCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.95)',
  },
  entCardPlanned: {
    borderColor: 'rgba(79,240,210,0.6)',
  },
  entImage: {
    width: '100%',
    height: 120,
  },
  entOverlay: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  entHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
  },
  entCheckWrapper: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139,144,178,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  entCheckWrapperActive: {
    borderColor: 'rgba(79,240,210,0.9)',
    backgroundColor: 'rgba(79,240,210,0.15)',
  },
  entCheckIcon: {
    width: 20,
    height: 20,
    tintColor: 'rgba(139,144,178,0.9)',
  },
  entCheckIconActive: {
    tintColor: PALETTE.success,
  },
  entTag: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    marginTop: 2,
  },
  entTime: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 2,
  },
  entHint: {
    color: PALETTE.dim,
    fontSize: 11,
    marginTop: 2,
  },
  planSummaryText: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 6,
  },

  /* Reminders */
  remindersColumn: {
    marginTop: 4,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  reminderRowActive: {
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  reminderCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139,144,178,0.9)',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  reminderCheckboxActive: {
    borderColor: 'rgba(79,240,210,0.9)',
    backgroundColor: 'rgba(79,240,210,0.2)',
  },
  reminderCheckIcon: {
    width: 12,
    height: 12,
    tintColor: PALETTE.success,
  },
  reminderText: {
    color: PALETTE.dim,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  reminderTextActive: {
    color: PALETTE.text,
  },

  /* CTA */
  serviceButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.accent,
  },
  serviceButtonText: {
    color: '#080C1F',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 28,
  },
});
