import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Mock Friend Data ────────────────────────────────────────
const FRIEND_DATA: Record<string, {
  name: string;
  tier: string;
  tierColor: string;
  percentile: string;
  availablePoints: number;
  lifetimePoints: number;
  rank: number;
  co2: number;
  water: number;
  trees: number;
  efficiency: number;
  recentActions: { title: string; time: string; points: number; icon: string }[];
}> = {
  '12': {
    name: 'Alex Rivera',
    tier: 'Gold',
    tierColor: '#EF9F27',
    percentile: 'Top 3%',
    availablePoints: 2450,
    lifetimePoints: 14200,
    rank: 12,
    co2: 15.2,
    water: 520,
    trees: 4.1,
    efficiency: 89,
    recentActions: [
      { title: 'Recycled Aluminium Cans', time: 'Today, 10:30 AM', points: 60, icon: '♻️' },
      { title: 'Bike to Campus', time: 'Today, 8:15 AM', points: 40, icon: '🚲' },
      { title: 'Reusable Cup at Cafe', time: 'Yesterday, 3:20 PM', points: 30, icon: '☕' },
    ],
  },
  '13': {
    name: 'Sarah Chen',
    tier: 'Gold',
    tierColor: '#EF9F27',
    percentile: 'Top 4%',
    availablePoints: 2320,
    lifetimePoints: 11800,
    rank: 13,
    co2: 11.8,
    water: 410,
    trees: 3.0,
    efficiency: 82,
    recentActions: [
      { title: 'Donated Old Textbooks', time: 'Today, 11:00 AM', points: 80, icon: '📚' },
      { title: 'Meat-free Lunch', time: 'Yesterday, 12:45 PM', points: 50, icon: '🥗' },
      { title: 'Recycled PET Bottles', time: 'Yesterday, 9:00 AM', points: 50, icon: '🧴' },
    ],
  },
  '15': {
    name: 'Jordan Lee',
    tier: 'Silver',
    tierColor: '#9CA3AF',
    percentile: 'Top 8%',
    availablePoints: 2150,
    lifetimePoints: 9600,
    rank: 15,
    co2: 9.4,
    water: 340,
    trees: 2.5,
    efficiency: 76,
    recentActions: [
      { title: 'Campus Clean-up', time: 'Today, 2:00 PM', points: 100, icon: '🧹' },
      { title: 'Recycled Paper', time: 'Yesterday, 4:30 PM', points: 30, icon: '📄' },
    ],
  },
  '16': {
    name: 'Mika Sato',
    tier: 'Silver',
    tierColor: '#9CA3AF',
    percentile: 'Top 10%',
    availablePoints: 2040,
    lifetimePoints: 8900,
    rank: 16,
    co2: 8.7,
    water: 290,
    trees: 2.1,
    efficiency: 71,
    recentActions: [
      { title: 'Thrift Store Donation', time: 'Today, 9:45 AM', points: 70, icon: '👕' },
      { title: 'Reusable Bag at Shop', time: 'Yesterday, 6:00 PM', points: 20, icon: '👜' },
      { title: 'Attended Green Talk', time: '2 days ago', points: 200, icon: '🎓' },
    ],
  },
};

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EEEDFE',
  accent: '#FF6B35',
  success: '#1D9E75',
  bg: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0EEF6',
};

// ─── Sub-Components ──────────────────────────────────────────

function ImpactCard({ value, unit, label, icon }: {
  value: number; unit: string; label: string; icon: string;
}) {
  return (
    <View style={styles.impactCard}>
      <Text style={styles.impactIcon}>{icon}</Text>
      <View style={styles.impactValueRow}>
        <Text style={styles.impactValue}>{value}</Text>
        <Text style={styles.impactUnit}> {unit}</Text>
      </View>
      <Text style={styles.impactLabel}>{label}</Text>
    </View>
  );
}

function ActionItem({ item, isLast }: {
  item: { title: string; time: string; points: number; icon: string };
  isLast: boolean;
}) {
  return (
    <>
      <View style={styles.actionItem}>
        <View style={styles.actionIconContainer}>
          <Text style={styles.actionIcon}>{item.icon}</Text>
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>{item.title}</Text>
          <Text style={styles.actionTime}>{item.time}</Text>
        </View>
        <Text style={styles.actionPoints}>+{item.points} pts</Text>
      </View>
      {!isLast && <View style={styles.actionDivider} />}
    </>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function FriendProfileScreen() {
  const { rank } = useLocalSearchParams<{ rank: string }>();
  const router = useRouter();
  const friend = FRIEND_DATA[rank || ''];

  if (!friend) {
    return (
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text style={styles.emptyText}>Profile not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{friend.name}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.profileName}>{friend.name}</Text>
          <View style={styles.profileMeta}>
            <View style={[styles.tierBadge, { backgroundColor: friend.tierColor + '20' }]}>
              <Text style={[styles.tierBadgeText, { color: friend.tierColor }]}>
                {friend.tier} Tier
              </Text>
            </View>
            <Text style={styles.percentileText}>{friend.percentile}</Text>
            <Text style={styles.rankBadge}>#{friend.rank}</Text>
          </View>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>ECO-POINTS</Text>
            <Text style={styles.pointsValue}>
              {friend.availablePoints.toLocaleString()}
            </Text>
          </View>
          <View style={styles.lifetimeBox}>
            <Text style={styles.lifetimeLabel}>LIFETIME</Text>
            <Text style={styles.lifetimeValue}>
              {friend.lifetimePoints >= 1000
                ? (friend.lifetimePoints / 1000).toFixed(1) + 'k'
                : friend.lifetimePoints}
            </Text>
          </View>
        </View>

        {/* Impact Metrics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🌱</Text>
          <Text style={styles.sectionTitle}>Their Real Impact</Text>
        </View>
        <View style={styles.impactGrid}>
          <ImpactCard value={friend.co2} unit="KG" label="CO2 Saved" icon="🌿" />
          <ImpactCard value={friend.water} unit="L" label="Water Conserved" icon="💧" />
          <ImpactCard value={friend.trees} unit="UNIT" label="Tree Equivalent" icon="🌳" />
          <ImpactCard value={friend.efficiency} unit="%" label="Campus Efficiency" icon="📊" />
        </View>

        {/* Compare Banner */}
        <View style={styles.compareBanner}>
          <Text style={styles.compareIcon}>⚔️</Text>
          <View style={styles.compareInfo}>
            <Text style={styles.compareTitle}>You vs {friend.name.split(' ')[0]}</Text>
            <Text style={styles.compareSubtitle}>
              They're {friend.availablePoints > 2280 ? (friend.availablePoints - 2280) : 0} pts ahead of you
            </Text>
          </View>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeText}>Challenge</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🕐</Text>
          <Text style={styles.sectionTitle}>Recent Actions</Text>
        </View>
        <View style={styles.actionsCard}>
          {friend.recentActions.map((action, index) => (
            <ActionItem
              key={index}
              item={action}
              isLast={index === friend.recentActions.length - 1}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    fontWeight: '300',
    color: C.text,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Profile Card
  profileCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  percentileText: {
    fontSize: 13,
    color: C.textSecondary,
  },
  rankBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: C.primary,
    backgroundColor: C.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Points
  pointsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 20,
  },
  pointsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: C.text,
  },
  lifetimeBox: {
    alignItems: 'flex-end',
  },
  lifetimeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  lifetimeValue: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },

  // Impact Grid
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  impactCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  impactIcon: {
    fontSize: 20,
  },
  impactValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  impactValue: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
  },
  impactUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
  },
  impactLabel: {
    fontSize: 12,
    color: C.textSecondary,
  },

  // Compare Banner
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE4CC',
  },
  compareIcon: {
    fontSize: 24,
  },
  compareInfo: {
    flex: 1,
    gap: 2,
  },
  compareTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  compareSubtitle: {
    fontSize: 12,
    color: C.textSecondary,
  },
  challengeButton: {
    backgroundColor: C.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  challengeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Actions
  actionsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionInfo: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  actionTime: {
    fontSize: 12,
    color: C.textTertiary,
  },
  actionPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: C.success,
  },
  actionDivider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 14,
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: C.textSecondary,
  },
});
