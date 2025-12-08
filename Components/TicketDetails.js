// Components/TicketDetails.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
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
    icon: ICONS.complaint,
    color: PALETTE.danger,
  },
  suggestion: {
    key: 'suggestion',
    label: 'Suggestion',
    icon: ICONS.suggestion,
    color: PALETTE.accentSoft,
  },
  compliment: {
    key: 'compliment',
    label: 'Compliment',
    icon: ICONS.compliment,
    color: PALETTE.success,
  },
};

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString();
}

export default function TicketDetails({ route, navigation }) {
  const ticketId = route?.params?.ticketId;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTicket = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setTicket(null);
      } else {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const found = list.find((t) => String(t.id) === String(ticketId));
          setTicket(found || null);
        } else {
          setTicket(null);
        }
      }
    } catch (e) {
      console.warn('TicketDetails: loadTicket error', e);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useFocusEffect(
    useCallback(() => {
      if (ticketId != null) {
        loadTicket();
      } else {
        setLoading(false);
        setTicket(null);
      }
    }, [ticketId, loadTicket])
  );

  const typeCfg =
    ticket && TYPE_CONFIG[ticket.type]
      ? TYPE_CONFIG[ticket.type]
      : TYPE_CONFIG.complaint;

  const statusColor =
    ticket?.status === 'Closed'
      ? PALETTE.success
      : ticket?.status === 'In progress'
      ? PALETTE.accentSoft
      : PALETTE.dim;

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
            <Image source={ICONS.header} style={styles.headerIcon} resizeMode="contain" />
            <Text style={styles.headerTitle}>Ticket details</Text>
            <Text style={styles.headerSubtitle}>
              Full information about your feedback to the venue.
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={PALETTE.accentSoft} />
            <Text style={styles.loadingText}>Loading ticket…</Text>
          </View>
        ) : !ticket ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>Ticket not found</Text>
            <Text style={styles.emptyText}>
              We could not find this ticket in your local history.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Основная карточка */}
            <View style={styles.card}>
              <View style={styles.mainHeaderRow}>
                <View style={styles.typeLeftRow}>
                  <View style={styles.typeIconWrapper}>
                    <Image source={typeCfg.icon} style={styles.typeIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.typeTitleBlock}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
                    <Text style={styles.ticketCategory}>
                      {ticket.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.typePill}>
                  <Text
                    style={[
                      styles.typePillText,
                      { color: typeCfg.color },
                    ]}
                  >
                    {typeCfg.label}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Created</Text>
                  <Text style={styles.metaValue}>
                    {formatDateTime(ticket.createdAt)}
                  </Text>
                </View>
                <View style={styles.metaBlock}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.metaValue,
                        { color: statusColor },
                      ]}
                    >
                      {ticket.status || 'Sent'}
                    </Text>
                  </View>
                </View>
              </View>

              {ticket.id ? (
                <View style={styles.metaBlockFull}>
                  <Text style={styles.metaLabel}>Ticket ID</Text>
                  <Text style={styles.metaValue}>#{ticket.id}</Text>
                </View>
              ) : null}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Details</Text>
              <Text style={styles.messageText}>{ticket.message}</Text>
            </View>

            {/* Инфо-бокс о локальности */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Where is this stored?</Text>
              <Text style={styles.infoText}>
                This ticket is saved locally on your device, so you can see what
                you have sent to the venue. The actual processing of the ticket
                happens on the venue side.
              </Text>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
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

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 8,
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

  card: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  mainHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  typeLeftRow: {
    flex: 1,
    flexDirection: 'row',
  },
  typeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typeIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accent,
  },
  typeTitleBlock: {
    flex: 1,
  },
  ticketTitle: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '700',
  },
  ticketCategory: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 2,
  },
  typePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  typePillText: {
    fontSize: 12,
  },

  metaRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6,
  },
  metaBlock: {
    flex: 1,
  },
  metaBlockFull: {
    marginTop: 2,
  },
  metaLabel: {
    color: PALETTE.dim,
    fontSize: 11,
  },
  metaValue: {
    color: PALETTE.text,
    fontSize: 12,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 5,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(28,33,66,0.9)',
    marginVertical: 10,
  },
  sectionTitle: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  messageText: {
    color: PALETTE.dim,
    fontSize: 13,
    lineHeight: 20,
  },

  infoBox: {
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  infoTitle: {
    color: PALETTE.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    color: PALETTE.dim,
    fontSize: 12,
    lineHeight: 18,
  },

  bottomSpacer: {
    height: 28,
  },
});
