// Components/RequestHistory.js
import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const BG = require('../assets/bg.png');

const ICONS = {
  header: require('../assets/ic_service.png'), // можно заменить на ic_history
  waiter: require('../assets/ic_waiter.png'),
  technician: require('../assets/ic_technician.png'),
  cleaner: require('../assets/ic_cleaner.png'),
  security: require('../assets/ic_security.png'),
  host: require('../assets/ic_host.png'),
  calendar: require('../assets/ic_calendar.png'),
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

const STORAGE_KEY = '@winway_service_requests';

const STAFF_LABELS = {
  waiter: 'Waiter',
  technician: 'Technician',
  cleaner: 'Cleaner',
  security: 'Security',
  host: 'Host',
};

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

function formatFullDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RequestHistory({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStaff, setFilterStaff] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  const loadRequests = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.sort((a, b) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
          });
          setRequests(parsed);
        } else {
          setRequests([]);
        }
      } else {
        setRequests([]);
      }
    } catch (e) {
      console.warn('RequestHistory: load error', e);
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          (req.table || '').toLowerCase().includes(query) ||
          (req.reason || '').toLowerCase().includes(query) ||
          (req.comment || '').toLowerCase().includes(query) ||
          (STAFF_LABELS[req.staffKey] || '').toLowerCase().includes(query) ||
          (req.internalId || '').toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Staff filter
      if (filterStaff && req.staffKey !== filterStaff) return false;

      // Status filter
      if (filterStatus && (req.status || 'Sent') !== filterStatus) return false;

      // Date filter
      if (filterDate) {
        const reqDate = new Date(req.createdAt);
        const filterDateStart = new Date(filterDate);
        filterDateStart.setHours(0, 0, 0, 0);
        const filterDateEnd = new Date(filterDate);
        filterDateEnd.setHours(23, 59, 59, 999);
        
        if (reqDate < filterDateStart || reqDate > filterDateEnd) {
          return false;
        }
      }

      return true;
    });
  }, [requests, searchQuery, filterStaff, filterStatus, filterDate]);

  const handleClear = async () => {
    try {
      setClearing(true);
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRequests([]);
      setSearchQuery('');
      setFilterStaff(null);
      setFilterStatus(null);
      setFilterDate(null);
    } catch (e) {
      console.warn('RequestHistory: clear error', e);
    } finally {
      setClearing(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      setFilterDate(selectedDate);
    } else if (event.type === 'dismissed') {
      // User cancelled
    }
  };

  const clearDateFilter = () => {
    setFilterDate(null);
  };

  const handleRequestPress = (item) => {
    setSelectedRequest(item);
    setShowDetails(true);
  };

  const renderItem = ({ item }) => {
    const staffLabel = STAFF_LABELS[item.staffKey] || 'Staff';
    const iconSource = ICONS[item.staffKey] || ICONS.header;

    const status = item.status || 'Sent';
    const statusColor =
      status === 'Closed'
        ? PALETTE.success
        : status === 'In progress'
        ? PALETTE.accentSoft
        : PALETTE.dim;

    return (
      <Pressable
        onPress={() => handleRequestPress(item)}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9 },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardLeftRow}>
            <View style={styles.staffIconWrapper}>
              <Image source={iconSource} style={styles.staffIcon} resizeMode="contain" />
            </View>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardTitle}>
                {staffLabel} · table {item.table || '?'}
              </Text>
              {item.reason ? (
                <Text style={styles.cardSubtitle}>{item.reason}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor },
              ]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {status}
            </Text>
          </View>
        </View>

        {item.comment ? (
          <Text numberOfLines={2} style={styles.commentText}>{item.comment}</Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={styles.timeText}>
            {formatDateTime(item.createdAt)}
          </Text>
          {item.internalId ? (
            <Text style={styles.idText}>#{item.internalId}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

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
            <Text style={styles.headerTitle}>Service history</Text>
            <Text style={styles.headerSubtitle}>
              Your recent requests for staff at the venue.
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        {/* Search and filters */}
        {requests.length > 0 && (
          <View style={styles.filtersSection}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                placeholder="Search by table, reason, comment..."
                placeholderTextColor="rgba(139,144,178,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchButton}
                >
                  <Text style={styles.clearSearchText}>✕</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.filtersRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScrollContent}
              >
                <Pressable
                  onPress={() => setFilterStaff(null)}
                  style={[
                    styles.filterChip,
                    filterStaff === null && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterStaff === null && styles.filterChipTextActive,
                    ]}
                  >
                    All staff
                  </Text>
                </Pressable>
                {Object.entries(STAFF_LABELS).map(([key, label]) => (
                  <Pressable
                    key={key}
                    onPress={() => setFilterStaff(filterStaff === key ? null : key)}
                    style={[
                      styles.filterChip,
                      filterStaff === key && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filterStaff === key && styles.filterChipTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filtersRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScrollContent}
              >
                <Pressable
                  onPress={() => setFilterStatus(null)}
                  style={[
                    styles.filterChip,
                    filterStatus === null && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filterStatus === null && styles.filterChipTextActive,
                    ]}
                  >
                    All status
                  </Text>
                </Pressable>
                {['Sent', 'In progress', 'Closed'].map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => setFilterStatus(filterStatus === status ? null : status)}
                    style={[
                      styles.filterChip,
                      filterStatus === status && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filterStatus === status && styles.filterChipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Date filter */}
            <View style={styles.filtersRow}>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateFilterButton,
                  filterDate && styles.dateFilterButtonActive,
                ]}
              >
                <Image
                  source={ICONS.calendar}
                  style={[
                    styles.dateFilterIcon,
                    filterDate && styles.dateFilterIconActive,
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.dateFilterText,
                    filterDate && styles.dateFilterTextActive,
                  ]}
                >
                  {filterDate
                    ? filterDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Filter by date'}
                </Text>
                {filterDate && (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                    style={styles.dateFilterClear}
                  >
                    <Text style={styles.dateFilterClearText}>✕</Text>
                  </Pressable>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Clear button */}
        {requests.length > 0 && (
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleClear}
              disabled={requests.length === 0 || clearing}
              style={({ pressed }) => [
                styles.clearButton,
                (requests.length === 0 || clearing) &&
                  styles.clearButtonDisabled,
                pressed &&
                  !(requests.length === 0 || clearing) && {
                    opacity: 0.85,
                  },
              ]}
            >
              <Text style={styles.clearButtonText}>
                {clearing ? 'Clearing…' : 'Clear history'}
              </Text>
            </Pressable>
            <Text style={styles.resultsCount}>
              {filteredRequests.length} of {requests.length} requests
            </Text>
          </View>
        )}

        {/* List */}
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="small" color={PALETTE.accentSoft} />
            <Text style={styles.loadingText}>Loading requests…</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyText}>
              When you call staff from the Service screen, your requests will
              appear here.
            </Text>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyTitle}>No matching requests</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={(item, index) =>
              String(item.id || item.createdAt || index)
            }
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadRequests(true)}
                tintColor={PALETTE.accentSoft}
                colors={[PALETTE.accentSoft]}
              />
            }
          />
        )}

        {/* Details Modal */}
        <Modal
          visible={showDetails}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <SafeAreaView style={styles.modalSafeArea}>
                {selectedRequest && (
                  <ScrollView
                    style={styles.modalScroll}
                    contentContainerStyle={styles.modalScrollContent}
                  >
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Request Details</Text>
                      <Pressable
                        onPress={() => setShowDetails(false)}
                        style={styles.modalCloseButton}
                      >
                        <Text style={styles.modalCloseText}>✕</Text>
                      </Pressable>
                    </View>

                    <View style={styles.detailCard}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Staff</Text>
                        <View style={styles.detailValueRow}>
                          <Image
                            source={ICONS[selectedRequest.staffKey] || ICONS.header}
                            style={styles.detailIcon}
                            resizeMode="contain"
                          />
                          <Text style={styles.detailValue}>
                            {STAFF_LABELS[selectedRequest.staffKey] || 'Staff'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Table / Zone</Text>
                        <Text style={styles.detailValue}>{selectedRequest.table || 'N/A'}</Text>
                      </View>

                      {selectedRequest.reason && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Reason</Text>
                          <Text style={styles.detailValue}>{selectedRequest.reason}</Text>
                        </View>
                      )}

                      {selectedRequest.comment && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Comment</Text>
                          <Text style={styles.detailValue}>{selectedRequest.comment}</Text>
                        </View>
                      )}

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={styles.detailStatusRow}>
                          <View
                            style={[
                              styles.detailStatusDot,
                              {
                                backgroundColor:
                                  selectedRequest.status === 'Closed'
                                    ? PALETTE.success
                                    : selectedRequest.status === 'In progress'
                                    ? PALETTE.accentSoft
                                    : PALETTE.dim,
                              },
                            ]}
                          />
                          <Text style={styles.detailValue}>
                            {selectedRequest.status || 'Sent'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Request ID</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.internalId || `#${selectedRequest.id}`}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Created</Text>
                        <Text style={styles.detailValue}>
                          {formatFullDateTime(selectedRequest.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </SafeAreaView>
            </View>
            </View>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            onTouchCancel={() => setShowDatePicker(false)}
          />
        )}
        {Platform.OS === 'ios' && showDatePicker && (
          <View style={styles.datePickerModal}>
            <Pressable
              style={styles.datePickerOverlay}
              onPress={() => setShowDatePicker(false)}
            />
            <View style={styles.datePickerModalContent}>
              <View style={styles.datePickerHeader}>
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  style={styles.datePickerCancel}
                >
                  <Text style={styles.datePickerCancelText}>Cancel</Text>
                </Pressable>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <Pressable
                  onPress={() => {
                    setShowDatePicker(false);
                    if (filterDate) {
                      handleDateChange({ type: 'set' }, filterDate);
                    }
                  }}
                  style={styles.datePickerDone}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </Pressable>
              </View>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={filterDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setFilterDate(date);
                  }}
                  maximumDate={new Date()}
                  style={styles.datePickerIOS}
                  textColor={PALETTE.text}
                  themeVariant="dark"
                />
              </View>
            </View>
          </View>
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
    width: 48,
  },

  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: PALETTE.text,
    fontSize: 14,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    color: PALETTE.dim,
    fontSize: 16,
  },
  filtersRow: {
    marginBottom: 6,
  },
  filtersScrollContent: {
    paddingRight: 20,
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
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.7)',
    backgroundColor: 'rgba(255,107,107,0.08)',
  },
  clearButtonDisabled: {
    borderColor: 'rgba(139,144,178,0.6)',
    backgroundColor: 'rgba(8,12,31,0.6)',
  },
  clearButtonText: {
    color: PALETTE.danger,
    fontSize: 12,
  },
  resultsCount: {
    color: PALETTE.dim,
    fontSize: 11,
  },

  centerBox: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
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

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardLeftRow: {
    flex: 1,
    flexDirection: 'row',
  },
  staffIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  staffIcon: {
    width: 28,
    height: 28,
    tintColor: PALETTE.accent,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: PALETTE.dim,
    fontSize: 12,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
  },
  commentText: {
    color: PALETTE.dim,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: PALETTE.dim,
    fontSize: 11,
  },
  idText: {
    color: 'rgba(139,144,178,0.8)',
    fontSize: 11,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: PALETTE.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderBottomWidth: 0,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: PALETTE.text,
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(28,33,66,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: PALETTE.text,
    fontSize: 18,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    color: PALETTE.text,
    fontSize: 15,
    fontWeight: '500',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    height: 24,
    tintColor: PALETTE.accent,
    marginRight: 8,
  },
  detailStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 8,
  },

  // Date picker styles
  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
    alignSelf: 'flex-start',
  },
  dateFilterButtonActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.12)',
  },
  dateFilterIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: PALETTE.text,
  },
  dateFilterIconActive: {
    tintColor: PALETTE.accentSoft,
  },
  dateFilterText: {
    color: PALETTE.text,
    fontSize: 12,
  },
  dateFilterTextActive: {
    color: PALETTE.accentSoft,
    fontWeight: '600',
  },
  dateFilterClear: {
    marginLeft: 8,
    padding: 2,
  },
  dateFilterClearText: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  datePickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  datePickerModalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: PALETTE.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PALETTE.border,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  datePickerCancel: {
    padding: 4,
  },
  datePickerCancelText: {
    color: PALETTE.dim,
    fontSize: 16,
  },
  datePickerTitle: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerDone: {
    padding: 4,
  },
  datePickerDoneText: {
    color: PALETTE.accentSoft,
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  datePickerIOS: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  },
});
