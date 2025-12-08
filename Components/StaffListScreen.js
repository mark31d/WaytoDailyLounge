// Components/StaffListScreen.js
import React, { useState, useMemo } from 'react';
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

const BG = require('../assets/bg.png');

const ICONS = {
  waiter: require('../assets/ic_waiter.png'),
  technician: require('../assets/ic_technician.png'),
  cleaner: require('../assets/ic_cleaner.png'),
  security: require('../assets/ic_security.png'),
  host: require('../assets/ic_host.png'),
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

const STAFF_MEMBERS = [
  {
    id: 1,
    name: 'Jack Foster',
    years: 3,
    role: 'DEALER',
    roleColor: '#9B59B6',
    rating: 5,
    schedule: [true, true, true, true, true, false, false], // Mon-Fri available
    icon: ICONS.waiter,
    bio: 'Experienced dealer with excellent customer service skills. Specializes in table games and maintains a professional atmosphere.',
    specialties: ['Blackjack', 'Poker', 'Roulette'],
    languages: ['English', 'Spanish'],
    shift: 'Evening (18:00 - 02:00)',
  },
  {
    id: 2,
    name: 'Emily Newton',
    years: 3,
    role: 'DEALER',
    roleColor: '#9B59B6',
    rating: 5,
    schedule: [true, true, true, true, true, false, false],
    icon: ICONS.waiter,
    bio: 'Passionate about creating memorable gaming experiences. Known for her friendly demeanor and attention to detail.',
    specialties: ['Baccarat', 'Blackjack', 'Customer Relations'],
    languages: ['English', 'French'],
    shift: 'Evening (18:00 - 02:00)',
  },
  {
    id: 3,
    name: 'Lucas Hayes',
    years: 3,
    role: 'DEALER',
    roleColor: '#9B59B6',
    rating: 5,
    schedule: [true, true, true, true, true, false, false],
    icon: ICONS.waiter,
    bio: 'Professional dealer with a calm and collected approach. Ensures fair play and maintains high standards.',
    specialties: ['Poker', 'Texas Hold\'em', 'Tournament Management'],
    languages: ['English'],
    shift: 'Evening (18:00 - 02:00)',
  },
  {
    id: 4,
    name: 'Grace Carter',
    years: 3,
    role: 'DEALER',
    roleColor: '#9B59B6',
    rating: 5,
    schedule: [true, true, true, true, true, false, false],
    icon: ICONS.waiter,
    bio: 'Energetic and engaging dealer who makes every game exciting. Excellent at reading the room and adapting to different player styles.',
    specialties: ['Roulette', 'Blackjack', 'Entertainment'],
    languages: ['English', 'Italian'],
    shift: 'Evening (18:00 - 02:00)',
  },
  {
    id: 5,
    name: 'Henry Mitchell',
    years: 3,
    role: 'DEALER',
    roleColor: '#9B59B6',
    rating: 5,
    schedule: [true, true, true, true, true, false, false],
    icon: ICONS.waiter,
    bio: 'Veteran dealer with extensive knowledge of casino operations. Known for precision and maintaining game integrity.',
    specialties: ['All Table Games', 'High Stakes', 'Training'],
    languages: ['English', 'German'],
    shift: 'Evening (18:00 - 02:00)',
  },
  {
    id: 6,
    name: 'Marcus Rodriguez',
    years: 3,
    role: 'SECURITY',
    roleColor: '#E74C3C',
    rating: 5,
    schedule: [true, true, true, true, true, false, false],
    icon: ICONS.security,
    bio: 'Dedicated security professional ensuring a safe and secure environment for all guests. Trained in conflict resolution and emergency response.',
    specialties: ['Crowd Control', 'Surveillance', 'Emergency Response'],
    languages: ['English', 'Spanish'],
    shift: 'Evening (18:00 - 02:00)',
  },
];

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const ROLE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'DEALER', label: 'Dealers' },
  { key: 'SECURITY', label: 'Security' },
];

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => (
    <Text key={i} style={styles.star}>
      {i < rating ? '★' : '☆'}
    </Text>
  ));
}

export default function StaffListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  const filteredStaff = useMemo(() => {
    let filtered = STAFF_MEMBERS;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter((staff) => staff.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((staff) =>
        staff.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedRole]);

  const handleCallStaff = (staff) => {
    // Navigate back and then to Service tab
    navigation.goBack();
    // Navigate to Service tab after a short delay
    setTimeout(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate('Service');
      }
    }, 300);
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
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Our Elite Staff</Text>
            <Text style={styles.headerSubtitle}>
              Professional gaming experts at your service
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search by name..."
            placeholderTextColor="rgba(139,144,178,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Role Filters */}
        <View style={styles.filtersRow}>
          {ROLE_FILTERS.map((filter) => {
            const isActive = selectedRole === filter.key;
            return (
              <Pressable
                key={filter.key}
                onPress={() => setSelectedRole(filter.key)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Staff List */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredStaff.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No staff members found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredStaff.map((staff) => {
              const isExpanded = expandedCard === staff.id;
              return (
              <Pressable
                key={staff.id}
                style={({ pressed }) => [
                  styles.staffCard,
                  isExpanded && styles.staffCardExpanded,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={() => setExpandedCard(isExpanded ? null : staff.id)}
              >
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>#{staff.id}</Text>
              </View>

              <View style={styles.cardContent}>
                {/* Icon */}
                <View style={styles.iconWrapper}>
                  <Image source={staff.icon} style={styles.icon} resizeMode="contain" />
                </View>

                {/* Years badge */}
                <View style={styles.yearsBadge}>
                  <Text style={styles.yearsText}>{staff.years} years</Text>
                </View>

                {/* Name */}
                <Text style={styles.staffName}>{staff.name}</Text>

                {/* Schedule */}
                <Text style={styles.scheduleLabel}>Schedule</Text>
                <View style={styles.scheduleRow}>
                  {DAYS.map((day, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dayCircle,
                        staff.schedule[index]
                          ? styles.dayCircleActive
                          : styles.dayCircleInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          staff.schedule[index]
                            ? styles.dayTextActive
                            : styles.dayTextInactive,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Role */}
                <View style={[styles.roleButton, { backgroundColor: staff.roleColor }]}>
                  <Text style={styles.roleText}>{staff.role}</Text>
                </View>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  {renderStars(staff.rating)}
                </View>

                {/* Expanded Details */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    
                    {/* Bio */}
                    <Text style={styles.detailLabel}>About</Text>
                    <Text style={styles.detailText}>{staff.bio}</Text>

                    {/* Specialties */}
                    {staff.specialties && (
                      <>
                        <Text style={styles.detailLabel}>Specialties</Text>
                        <View style={styles.specialtiesRow}>
                          {staff.specialties.map((spec, idx) => (
                            <View key={idx} style={styles.specialtyChip}>
                              <Text style={styles.specialtyText}>{spec}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {/* Languages */}
                    {staff.languages && (
                      <>
                        <Text style={styles.detailLabel}>Languages</Text>
                        <View style={styles.languagesRow}>
                          {staff.languages.map((lang, idx) => (
                            <View key={idx} style={styles.languageChip}>
                              <Text style={styles.languageText}>{lang}</Text>
                            </View>
                          ))}
                        </View>
                      </>
                    )}

                    {/* Shift */}
                    {staff.shift && (
                      <>
                        <Text style={styles.detailLabel}>Shift</Text>
                        <Text style={styles.detailText}>{staff.shift}</Text>
                      </>
                    )}
                  </View>
                )}

                {/* Call Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.callButton,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleCallStaff(staff);
                  }}
                >
                  <Text style={styles.callButtonText}>Call Staff</Text>
                </Pressable>
              </View>
            </Pressable>
            );
            })
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: PALETTE.text,
    fontSize: 24,
    fontWeight: '300',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: PALETTE.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: PALETTE.dim,
    fontSize: 12,
  },
  headerRight: {
    width: 40,
  },

  /* Search */
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    color: PALETTE.text,
    fontSize: 14,
  },

  /* Filters */
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    backgroundColor: 'rgba(8,12,31,0.7)',
  },
  filterChipActive: {
    borderColor: 'rgba(255,138,60,0.8)',
    backgroundColor: 'rgba(255,138,60,0.18)',
  },
  filterText: {
    color: PALETTE.dim,
    fontSize: 12,
    fontWeight: '500',
  },
  filterTextActive: {
    color: PALETTE.accentSoft,
    fontWeight: '600',
  },

  /* Empty State */
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtext: {
    color: PALETTE.dim,
    fontSize: 13,
  },

  /* Staff Card */
  staffCard: {
    backgroundColor: 'rgba(17,21,46,0.94)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,138,60,0.4)',
    position: 'relative',
  },
  staffCardExpanded: {
    borderColor: 'rgba(255,138,60,0.8)',
    borderWidth: 2.5,
  },
  cardNumber: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,138,60,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardNumberText: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: 'rgba(255,138,60,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,138,60,0.3)',
  },
  icon: {
    width: 36,
    height: 36,
    tintColor: PALETTE.accent,
  },
  yearsBadge: {
    backgroundColor: 'rgba(255,138,60,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  yearsText: {
    color: PALETTE.accentSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  staffName: {
    color: PALETTE.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  scheduleLabel: {
    color: PALETTE.dim,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  dayCircleActive: {
    backgroundColor: PALETTE.success,
    borderColor: PALETTE.success,
  },
  dayCircleInactive: {
    backgroundColor: 'rgba(28,33,66,0.9)',
    borderColor: 'rgba(139,144,178,0.3)',
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#080C1F',
  },
  dayTextInactive: {
    color: PALETTE.dim,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 18,
    color: '#FFD700',
  },
  /* Expanded Content */
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(28,33,66,0.9)',
    marginBottom: 16,
  },
  detailLabel: {
    color: PALETTE.accentSoft,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 8,
  },
  detailText: {
    color: PALETTE.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  specialtyChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,138,60,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.3)',
  },
  specialtyText: {
    color: PALETTE.accentSoft,
    fontSize: 11,
    fontWeight: '500',
  },
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  languageChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(79,240,210,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79,240,210,0.3)',
  },
  languageText: {
    color: PALETTE.success,
    fontSize: 11,
    fontWeight: '500',
  },
  callButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: PALETTE.accent,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#080C1F',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});

