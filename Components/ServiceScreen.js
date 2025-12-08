// Components/ServiceScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../assets/bg.png');

const ICONS = {
  service: require('../assets/ic_service.png'),
  waiter: require('../assets/ic_waiter.png'),
  technician: require('../assets/ic_technician.png'),
  cleaner: require('../assets/ic_cleaner.png'),
  security: require('../assets/ic_security.png'),
  host: require('../assets/ic_host.png'),
  history: require('../assets/ic_clock.png'),
};

const PALETTE = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  accent: '#FF8A3C',
  accentSoft: '#FFB23C',
  text: '#F2F4FF',
  dim: '#8B90B2',
  danger: '#FF6B6B',
};

const STORAGE_KEY = '@winway_service_requests';

const STAFF_TYPES = [
  { key: 'waiter', label: 'Waiter', desc: 'Drinks, menu, bill', icon: ICONS.waiter },
  { key: 'technician', label: 'Technician', desc: 'Screens, sound, devices', icon: ICONS.technician },
  { key: 'cleaner', label: 'Cleaner', desc: 'Spills, table cleaning', icon: ICONS.cleaner },
  { key: 'security', label: 'Security', desc: 'Safety, conflict', icon: ICONS.security },
  { key: 'host', label: 'Host', desc: 'Seating, general help', icon: ICONS.host },
];

const QUICK_REASONS = [
  'Need menu / drinks',
  'Technical issue',
  'Spill / cleaning',
  'Bill / payment',
  'Feeling unsafe',
  'Other',
];

export default function ServiceScreen({ navigation }) {
  const [tableValue, setTableValue] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = tableValue.length > 0 && !!selectedStaff && !sending;

  const handleSend = async () => {
    if (!canSend) return;

    try {
      setSending(true);
      setStatusMessage('');

      const now = new Date();
      const staffLabel = STAFF_TYPES.find((s) => s.key === selectedStaff)?.label || 'Staff';

      const newRequest = {
        id: Date.now(),
        createdAt: now.toISOString(),
        staffKey: selectedStaff,
        table: tableValue,
        reason: selectedReason || null,
        comment: comment.trim() || null,
        status: 'Sent',
        internalId: `SR-${Date.now().toString().slice(-6)}`,
      };

      // Сохраняем в AsyncStorage
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const nextList = Array.isArray(list) ? [...list, newRequest] : [newRequest];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));

      const message = `Request sent to ${staffLabel} for table "${tableValue}"${
        selectedReason ? ` (${selectedReason})` : ''
      }.`;

      setStatusMessage(message);

      // Очищаем форму после успешной отправки
      setTimeout(() => {
        setTableValue('');
        setSelectedStaff(null);
        setSelectedReason(null);
        setComment('');
        setStatusMessage('');
      }, 2000);
    } catch (e) {
      console.warn('ServiceScreen: handleSend error', e);
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const goToHistory = () => {
    navigation.navigate('RequestHistory');
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
                <Image source={ICONS.service} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.headerTagText}>Service</Text>
              </View>
              <Text style={styles.headerTitle}>Call staff to your table</Text>
              <Text style={styles.headerSubtitle}>
                Choose your table, staff type and reason. Your request will be sent to the team.
              </Text>
            </View>
            <View style={styles.headerRightButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => navigation.navigate('StaffList')}
              >
                <Text style={styles.headerButtonText}>Staff</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.historyButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={goToHistory}
              >
                <Image source={ICONS.history} style={styles.historyIcon} resizeMode="contain" />
                <Text style={styles.historyText}>History</Text>
              </Pressable>
            </View>
          </View>

          {/* Table / zone */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Table / zone</Text>
            <Text style={styles.sectionHint}>
              Select your table number or zone so staff can find you faster.
            </Text>

            <View style={styles.chipsRow}>
              {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'VIP 1', 'VIP 2', 'VIP 3', 'Lounge A', 'Lounge B', 'Lounge C', 'Bar 1', 'Bar 2', 'Terrace'].map((preset) => (
                <Pressable
                  key={preset}
                  onPress={() => setTableValue(preset)}
                  style={({ pressed }) => [
                    styles.chip,
                    tableValue === preset && styles.chipActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tableValue === preset && styles.chipTextActive,
                    ]}
                  >
                    {preset}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Staff type */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Who do you need?</Text>
            <Text style={styles.sectionHint}>
              Select the staff member you would like to call to your table.
            </Text>

            <View style={styles.staffGrid}>
              {STAFF_TYPES.map((staff) => {
                const isActive = selectedStaff === staff.key;
                return (
                  <Pressable
                    key={staff.key}
                    style={({ pressed }) => [
                      styles.staffCard,
                      isActive && styles.staffCardActive,
                      pressed && { opacity: 0.85 },
                    ]}
                    onPress={() => setSelectedStaff(staff.key)}
                  >
                    <View style={styles.staffIconWrapper}>
                      <Image source={staff.icon} style={styles.staffIcon} resizeMode="contain" />
                    </View>
                    <Text
                      style={[
                        styles.staffLabel,
                        isActive && styles.staffLabelActive,
                      ]}
                    >
                      {staff.label}
                    </Text>
                    <Text style={styles.staffDesc}>{staff.desc}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Reason */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reason</Text>
            <Text style={styles.sectionHint}>
              Choose a quick reason or add a short description.
            </Text>

            <View style={styles.chipsRowWrap}>
              {QUICK_REASONS.map((reason) => {
                const isActive = selectedReason === reason;
                return (
                  <Pressable
                    key={reason}
                    onPress={() =>
                      setSelectedReason(isActive ? null : reason)
                    }
                    style={({ pressed }) => [
                      styles.reasonChip,
                      isActive && styles.reasonChipActive,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reasonChipText,
                        isActive && styles.reasonChipTextActive,
                      ]}
                    >
                      {reason}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.commentBox}>
              <Text style={styles.commentLabel}>Additional comment</Text>
              <TextInput
                multiline
                placeholder="Optional: add details to help staff prepare before they arrive."
                placeholderTextColor="rgba(139,144,178,0.7)"
                value={comment}
                onChangeText={setComment}
                style={styles.commentInput}
              />
            </View>
          </View>

          {/* Status */}
          {statusMessage ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          {/* Send button */}
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
              pressed && canSend && !sending && { opacity: 0.85 },
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#080C1F" />
            ) : (
              <Text style={styles.sendButtonText}>
                {canSend ? 'Send request' : 'Fill table and staff to send'}
              </Text>
            )}
          </Pressable>

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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
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
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.5)',
  },
  headerButtonText: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  historyIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: PALETTE.text,
  },
  historyText: {
    color: PALETTE.text,
    fontSize: 12,
  },

  /* Cards */
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

  /* Table */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
    minWidth: 55,
    alignItems: 'center',
    flex: 0,
  },
  chipActive: {
    borderColor: 'rgba(255,138,60,0.9)',
    backgroundColor: 'rgba(255,138,60,0.18)',
  },
  chipText: {
    color: PALETTE.dim,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: PALETTE.accentSoft,
    fontWeight: '600',
  },

  /* Staff grid */
  staffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 10,
  },
  staffCard: {
    width: '47%',
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  staffCardActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(17,21,46,0.96)',
  },
  staffIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  staffIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accent,
  },
  staffLabel: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  staffLabelActive: {
    color: PALETTE.accentSoft,
  },
  staffDesc: {
    color: PALETTE.dim,
    fontSize: 11,
    lineHeight: 15,
  },

  /* Reasons */
  chipsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  reasonChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
  },
  reasonChipActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  reasonChipText: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  reasonChipTextActive: {
    color: PALETTE.accentSoft,
  },

  commentBox: {
    marginTop: 6,
  },
  commentLabel: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 4,
  },
  commentInput: {
    minHeight: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: PALETTE.text,
    fontSize: 13,
    textAlignVertical: 'top',
  },

  /* Status + button */
  statusBox: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 110, 76, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(79, 240, 210, 0.4)',
  },
  statusText: {
    color: PALETTE.text,
    fontSize: 13,
  },
  sendButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.accent,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,138,60,0.4)',
  },
  sendButtonText: {
    color: '#080C1F',
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 32,
  },
});
