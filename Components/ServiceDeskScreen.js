// Components/ServiceDeskScreen.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../assets/bg.png');

const ICONS = {
  header: require('../assets/ic_desk.png'),
  complaint: require('../assets/ic_complaint.png'),
  suggestion: require('../assets/ic_suggestion.png'),
  compliment: require('../assets/ic_compliment.png'),
  ticket: require('../assets/ic_ticket.png'),
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
  success: '#4FF0D2',
};

const STORAGE_KEY = '@winway_desk_tickets';

const TYPE_CONFIG = {
  complaint: {
    key: 'complaint',
    label: 'Complaint',
    caption: 'Report a problem or negative experience.',
    icon: ICONS.complaint,
  },
  suggestion: {
    key: 'suggestion',
    label: 'Suggestion',
    caption: 'Share an idea to improve the venue.',
    icon: ICONS.suggestion,
  },
  compliment: {
    key: 'compliment',
    label: 'Compliment',
    caption: 'Say thanks for a great service.',
    icon: ICONS.compliment,
  },
};

const CATEGORIES = [
  'Staff / Service',
  'Cleanliness',
  'Music / Sound',
  'Games / Slots',
  'Food & Drinks',
  'Other',
];

function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function ServiceDeskScreen({ navigation }) {
  const [type, setType] = useState('complaint');
  const [category, setCategory] = useState('Staff / Service');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [tickets, setTickets] = useState([]);

  const canSend = title.trim().length > 0 && message.trim().length > 0;

  const loadTickets = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.sort((a, b) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
          });
          setTickets(parsed);
        } else {
          setTickets([]);
        }
      } else {
        setTickets([]);
      }
    } catch (e) {
      console.warn('ServiceDeskScreen: loadTickets error', e);
      setTickets([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [loadTickets])
  );

  const handleSend = async () => {
    if (!canSend || sending) return;

    try {
      setSending(true);
      setStatusMessage('');

      const now = new Date();
      const newTicket = {
        id: Date.now(),
        createdAt: now.toISOString(),
        type,
        category,
        title: title.trim(),
        message: message.trim(),
        status: 'Sent',
      };

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const nextList = Array.isArray(list) ? [...list, newTicket] : [newTicket];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      nextList.sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return tb - ta;
      });
      setTickets(nextList);

      setStatusMessage('Your ticket has been sent to the venue team.');
      // если хочешь очищать форму:
      // setTitle('');
      // setMessage('');
    } catch (e) {
      console.warn('ServiceDeskScreen: handleSend error', e);
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const currentTypeConfig = TYPE_CONFIG[type];

  const renderTicketItem = ({ item }) => {
    const tCfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.complaint;
    const isComplaint = item.type === 'complaint';
    const isCompliment = item.type === 'compliment';

    let typeColor = PALETTE.accentSoft;
    if (isComplaint) typeColor = PALETTE.danger;
    if (isCompliment) typeColor = PALETTE.success;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.ticketCard,
          pressed && { opacity: 0.9 },
        ]}
        onPress={() =>
          navigation.navigate('TicketDetails', {
            ticketId: item.id,
          })
        }
      >
        <View style={styles.ticketHeaderRow}>
          <View style={styles.ticketLeftRow}>
            <View style={styles.ticketIconWrapper}>
              <Image source={tCfg.icon} style={styles.ticketIcon} resizeMode="contain" />
            </View>
            <View style={styles.ticketTitleBlock}>
              <Text style={styles.ticketTitle}>{item.title}</Text>
              <Text style={styles.ticketSubtitle}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.ticketTypePill}>
            <Text style={[styles.ticketTypeText, { color: typeColor }]}>
              {tCfg.label}
            </Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.ticketPreview}>
          {item.message}
        </Text>
        <View style={styles.ticketFooterRow}>
          <Text style={styles.ticketTime}>{formatShortDate(item.createdAt)}</Text>
          <Text style={styles.ticketStatus}>{item.status || 'Sent'}</Text>
        </View>
      </Pressable>
    );
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
                <Image source={ICONS.header} style={styles.headerIcon} resizeMode="contain" />
                <Text style={styles.headerTagText}>Service desk</Text>
              </View>
              <Text style={styles.headerTitle}>Feedback & complaints</Text>
              <Text style={styles.headerSubtitle}>
                Send a complaint, suggestion or compliment and track your tickets.
              </Text>
            </View>
          </View>

          {/* Type tabs */}
          <View style={styles.tabsRow}>
            {Object.values(TYPE_CONFIG).map((t) => {
              const isActive = type === t.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setType(t.key)}
                  style={({ pressed }) => [
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Image source={t.icon} style={styles.tabIcon} resizeMode="contain" />
                  <Text
                    style={[
                      styles.tabText,
                      isActive && styles.tabTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Type caption */}
          <Text style={styles.typeCaption}>{currentTypeConfig.caption}</Text>

          {/* Form card */}
          <View style={styles.card}>
            {/* Category */}
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.sectionHint}>
              Choose what your ticket is mainly about.
            </Text>
            <View style={styles.chipsRowWrap}>
              {CATEGORIES.map((c) => {
                const isActive = c === category;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      isActive && styles.categoryChipActive,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isActive && styles.categoryChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Title */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                placeholder="Short summary, e.g. “Slow drink service at bar”"
                placeholderTextColor="rgba(139,144,178,0.7)"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>

            {/* Message */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Details</Text>
              <TextInput
                multiline
                placeholder="Describe what happened or what you’d like to suggest."
                placeholderTextColor="rgba(139,144,178,0.7)"
                value={message}
                onChangeText={setMessage}
                style={[styles.input, styles.textarea]}
              />
            </View>

            {/* Attachment placeholder */}
            <View style={styles.attachmentBox}>
              <Text style={styles.attachmentTitle}>Attachments</Text>
              <Text style={styles.attachmentText}>
                Optionally attach a photo or screenshot when this feature is enabled.
              </Text>
            </View>
          </View>

          {/* Status message */}
          {statusMessage ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          {/* Send button */}
          <Pressable
            onPress={handleSend}
            disabled={!canSend || sending}
            style={({ pressed }) => [
              styles.sendButton,
              (!canSend || sending) && styles.sendButtonDisabled,
              pressed && canSend && !sending && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.sendButtonText}>
              {sending
                ? 'Sending…'
                : canSend
                ? `Send ${currentTypeConfig.label.toLowerCase()}`
                : 'Fill title and details to send'}
            </Text>
          </Pressable>

          {/* Recent tickets */}
          <View style={styles.recentHeaderRow}>
            <Text style={styles.recentTitle}>Recent tickets</Text>
            {tickets.length > 0 && (
              <Pressable
                onPress={() =>
                  navigation.navigate('TicketDetails', {
                    ticketId: tickets[0]?.id,
                  })
                }
              >
                <Text style={styles.recentLink}>Open last ticket</Text>
              </Pressable>
            )}
          </View>

          {tickets.length === 0 ? (
            <Text style={styles.emptyText}>
              You have not sent any tickets yet. Your last feedback will appear here.
            </Text>
          ) : (
            <FlatList
              data={tickets.slice(0, 3)}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderTicketItem}
              scrollEnabled={false}
              contentContainerStyle={styles.recentListContent}
            />
          )}

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

  headerRow: {
    marginTop: 4,
    marginBottom: 16,
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

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tabButton: {
    flex: 1,
    marginRight: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButtonActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  tabIcon: {
    width: 26,
    height: 26,
    tintColor: PALETTE.accentSoft,
    marginRight: 8,
  },
  tabText: {
    color: PALETTE.dim,
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    color: PALETTE.accentSoft,
  },
  typeCaption: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 10,
  },

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
    marginBottom: 8,
  },

  chipsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
  },
  categoryChipActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  categoryChipText: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  categoryChipTextActive: {
    color: PALETTE.accentSoft,
  },

  fieldBlock: {
    marginTop: 6,
  },
  fieldLabel: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: PALETTE.text,
    fontSize: 14,
  },
  textarea: {
    minHeight: 80,
    paddingTop: 8,
    textAlignVertical: 'top',
  },

  attachmentBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  attachmentTitle: {
    color: PALETTE.text,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  attachmentText: {
    color: PALETTE.dim,
    fontSize: 11,
    lineHeight: 16,
  },

  statusBox: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(18,110,76,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(79,240,210,0.4)',
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
    marginBottom: 12,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255,138,60,0.4)',
  },
  sendButtonText: {
    color: '#080C1F',
    fontSize: 14,
    fontWeight: '600',
  },

  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentTitle: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '600',
  },
  recentLink: {
    color: PALETTE.accentSoft,
    fontSize: 12,
  },
  emptyText: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 6,
  },
  recentListContent: {
    paddingTop: 2,
  },

  ticketCard: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  ticketLeftRow: {
    flex: 1,
    flexDirection: 'row',
  },
  ticketIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ticketIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accent,
  },
  ticketTitleBlock: {
    flex: 1,
  },
  ticketTitle: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: '600',
  },
  ticketSubtitle: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  ticketTypePill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  ticketTypeText: {
    fontSize: 11,
  },
  ticketPreview: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  ticketFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketTime: {
    color: PALETTE.dim,
    fontSize: 11,
  },
  ticketStatus: {
    color: PALETTE.accentSoft,
    fontSize: 11,
  },

  bottomSpacer: {
    height: 32,
  },
});
