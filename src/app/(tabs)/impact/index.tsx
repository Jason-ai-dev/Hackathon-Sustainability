import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Mock Data ───────────────────────────────────────────────
const USER = {
  name: 'Eco-Warrior',
  tier: 'Gold',
  tierColor: '#EF9F27',
  percentile: 'Top 5%',
  availablePoints: 2280,
  lifetimePoints: 12400,
  nextTier: 'Diamond',
  nextTierThreshold: 10000,
  pointsToNextTier: 7720,
  buildingPercentile: 92,
};

const BADGES = [
  { id: '1', icon: '🔥', name: 'Login Streak', progress: '7 days', earned: true },
  { id: '2', icon: '🧴', name: 'Bottles Recycled', progress: '25 bottles', earned: true },
  { id: '3', icon: '👕', name: 'Clothing Donated', progress: '5 items', earned: true },
  { id: '4', icon: '🎓', name: 'Talks Attended', progress: '3 talks', earned: true },
  { id: '5', icon: '🚲', name: 'Bike Commuter', progress: '6/10 rides', earned: false },
  { id: '6', icon: '🥗', name: 'Meat-free Meals', progress: '9/15 meals', earned: false },
];

const RECENT_ACTIONS = [
  { id: '1', title: 'Recycled PET Bottles', time: 'Today, 2:45 PM', points: 50, icon: '♻️' },
  { id: '2', title: 'Reusable Cup at Cafe', time: 'Yesterday, 9:12 AM', points: 30, icon: '☕' },
  { id: '3', title: 'Meat-free Monday Bonus', time: 'Oct 23, 1:20 PM', points: 100, icon: '🥗' },
];

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EAE6FD',
  accent: '#FF6B35',
  gold: '#EF9F27',
  goldLight: '#FFF3DB',
  success: '#1D9E75',
  successLight: '#E1F5EE',
  danger: '#E24B4A',
  bg: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0EEF6',
  progressTrack: '#E8E6F0',
};

// ─── Sub-Components ──────────────────────────────────────────

function ProfileBanner() {
  return (
    <View style={styles.profileBanner}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🌍</Text>
        </View>
        <View style={styles.tierDot}>
          <Text style={{ fontSize: 10 }}>🏅</Text>
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{USER.name}</Text>
        <View style={styles.profileMeta}>
          <View style={[styles.tierBadge, { backgroundColor: C.goldLight }]}>
            <Text style={[styles.tierBadgeText, { color: '#96690F' }]}>
              {USER.tier} Tier
            </Text>
          </View>
          <Text style={styles.percentileText}>{USER.percentile}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify Now</Text>
      </TouchableOpacity>
    </View>
  );
}

function PointsCard() {
  return (
    <View style={styles.pointsCard}>
      <View>
        <Text style={styles.pointsLabel}>AVAILABLE ECO-POINTS</Text>
        <View style={styles.pointsRow}>
          <Text style={styles.pointsValue}>
            {USER.availablePoints.toLocaleString()}
          </Text>
          <Text style={styles.pointsTrophy}> 🏆</Text>
        </View>
      </View>
      <View style={styles.lifetimeBox}>
        <Text style={styles.lifetimeLabel}>LIFETIME</Text>
        <Text style={styles.lifetimeValue}>
          {USER.lifetimePoints >= 1000
            ? (USER.lifetimePoints / 1000).toFixed(1) + 'k'
            : USER.lifetimePoints}
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  icon,
  linkText,
  onLinkPress,
}: {
  title: string;
  icon?: string;
  linkText?: string;
  onLinkPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {linkText && (
        <TouchableOpacity onPress={onLinkPress}>
          <Text style={styles.sectionLink}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function BadgeCard({
  badge,
}: {
  badge: { id: string; icon: string; name: string; progress: string; earned: boolean };
}) {
  return (
    <View style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      {!badge.earned && <Text style={styles.badgeLock}>🔒</Text>}
      <Text style={styles.badgeName}>{badge.name}</Text>
      <Text style={styles.badgeProgress}>{badge.progress}</Text>
      {badge.earned && <Text style={styles.badgeCheck}>✅</Text>}
    </View>
  );
}

function TierProgressCard() {
  const progress =
    ((USER.nextTierThreshold - USER.pointsToNextTier) / USER.nextTierThreshold) *
    100;

  return (
    <View style={styles.tierCard}>
      <View style={styles.tierCardHeader}>
        <Text style={styles.tierCardTitle}>Road to Diamond</Text>
        <Text style={styles.tierCardPoints}>
          {USER.pointsToNextTier.toLocaleString()} pts left
        </Text>
      </View>
      <Text style={styles.tierCardSubtitle}>
        You're outpacing {USER.buildingPercentile}% of the Science building!
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.tierLabels}>
        <Text style={[styles.tierLabelText, { color: C.gold }]}>GOLD</Text>
        <Text style={[styles.tierLabelText, { color: C.primary }]}>DIAMOND</Text>
      </View>
      
    </View>
  );
}

function ActionItem({
  item,
}: {
  item: { id: string; title: string; time: string; points: number; icon: string };
}) {
  return (
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
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function ImpactScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚡</Text>
          <Text style={styles.headerTitle}>Impact Dashboard</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/impact/settings')}>
          <Text style={styles.headerAction}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <ProfileBanner />

        {/* Points */}
        <PointsCard />

        {/* Badges */}
        <SectionHeader title="Your Badges" icon="🏅" linkText="View All" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeScroll}
        >
          {BADGES.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </ScrollView>

        {/* Tier Progress */}
        <TierProgressCard />

        {/* Recent Actions */}
        <SectionHeader title="Recent Actions" icon="🕐" linkText="View All" />
        <View style={styles.actionsCard}>
          {RECENT_ACTIONS.map((action, index) => (
            <React.Fragment key={action.id}>
              <ActionItem item={action} />
              {index < RECENT_ACTIONS.length - 1 && (
                <View style={styles.actionDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Bottom spacer for tab bar */}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 22,
    backgroundColor: C.text,
    color: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
  },
  headerAction: {
    fontSize: 22,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Profile Banner
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  tierDot: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.gold,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  percentileText: {
    fontSize: 12,
    color: C.textSecondary,
  },
  verifyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  verifyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.primary,
  },

  // Points Card
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
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '800',
    color: C.text,
  },
  pointsTrophy: {
    fontSize: 28,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
  },

  // Badges
  badgeScroll: {
    gap: 12,
    paddingRight: 4,
  },
  badgeCard: {
    width: 104,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  badgeCardLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeLock: {
    fontSize: 12,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
  },
  badgeProgress: {
    fontSize: 11,
    color: C.textSecondary,
    textAlign: 'center',
  },
  badgeCheck: {
    fontSize: 12,
  },

  // Tier Progress
  tierCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  tierCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  tierCardPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: C.accent,
  },
  tierCardSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: C.progressTrack,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.primary,
    borderRadius: 5,
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tierLabelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  boostButton: {
    backgroundColor: C.accent,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  boostButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Recent Actions
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
});
