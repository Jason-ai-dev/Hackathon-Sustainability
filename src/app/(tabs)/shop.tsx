import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ─── Mock Data ───────────────────────────────────────────────
const BALANCE = {
  available: 2280,
  nextTier: 'Diamond',
  pointsToNextTier: 7720,
  tiers: ['S', 'G', 'P'],
};

const RIVAL_NUDGE = {
  name: 'Alex Rivera',
  message: 'just passed you!',
  action: 'Earn 170 pts now to reclaim 1st place.',
};

const FILTERS = ['All Filters', 'Cafe', 'Services', 'Travel', 'Gear'];

const REWARDS = [
  {
    id: '1',
    title: 'Free Espresso',
    category: 'Cafe',
    categoryColor: '#8B6914',
    categoryBg: '#FFF3DB',
    points: 50,
    image: '☕',
  },
  {
    id: '2',
    title: 'Priority Credits',
    category: 'Services',
    categoryColor: '#3C3489',
    categoryBg: '#EEEDFE',
    points: 200,
    image: '🖨️',
  },
  {
    id: '3',
    title: 'Bus Fast Pass',
    category: 'Travel',
    categoryColor: '#0F6E56',
    categoryBg: '#E1F5EE',
    points: 1200,
    image: '🚌',
  },
  {
    id: '4',
    title: 'Eco-Tote Bag',
    category: 'Gear',
    categoryColor: '#185FA5',
    categoryBg: '#E6F1FB',
    points: 850,
    image: '👜',
  },
];

const HISTORY = [
  { id: '1', title: 'Free Espresso', time: 'TODAY, 09:15', points: -50, icon: '☕' },
  { id: '2', title: 'Printing Credits', time: 'YESTERDAY', points: -200, icon: '🖨️' },
  { id: '3', title: 'Verification Bonus', time: '2 DAYS AGO', points: 50, icon: '✅' },
];

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EEEDFE',
  primaryDark: '#3C3489',
  accent: '#FF6B35',
  success: '#1D9E75',
  danger: '#E24B4A',
  bg: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0EEF6',
};

// ─── Sub-Components ──────────────────────────────────────────

function BalanceCard() {
  const progress =
    ((10000 - BALANCE.pointsToNextTier) / 10000) * 100;

  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceTop}>
        <View>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>
              {BALANCE.available.toLocaleString()}
            </Text>
            <Text style={styles.balancePts}>Pts</Text>
          </View>
        </View>
        <View style={styles.balanceIconBox}>
          <Text style={styles.balanceIcon}>💳</Text>
        </View>
      </View>
      <View style={styles.tierProgressRow}>
        <View style={styles.tierDots}>
          {BALANCE.tiers.map((t, i) => (
            <View key={t} style={styles.tierDot}>
              <Text style={styles.tierDotText}>{t}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.tierProgressText}>
          You're {BALANCE.pointsToNextTier.toLocaleString()} pts away from{' '}
          <Text style={styles.tierHighlight}>{BALANCE.nextTier} Tier</Text>
        </Text>
      </View>
    </View>
  );
}

function RivalNudge() {
  return (
    <TouchableOpacity style={styles.rivalCard} activeOpacity={0.7}>
      <View style={styles.rivalIconBox}>
        <Text style={styles.rivalIcon}>📈</Text>
      </View>
      <View style={styles.rivalInfo}>
        <Text style={styles.rivalTitle}>
          {RIVAL_NUDGE.name} {RIVAL_NUDGE.message}
        </Text>
        <Text style={styles.rivalSubtitle}>{RIVAL_NUDGE.action}</Text>
      </View>
      <Text style={styles.rivalArrow}>›</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({
  title,
  linkText,
  onLinkPress,
}: {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {linkText && (
        <TouchableOpacity onPress={onLinkPress}>
          <Text style={styles.sectionLink}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function FilterChips({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (f: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {FILTERS.map((f) => {
        const isActive = f === active;
        return (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => onSelect(f)}
            activeOpacity={0.7}
          >
            {f === 'All Filters' && <Text style={styles.filterIcon}>🏷️</Text>}
            <Text
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function RewardCard({
  item,
}: {
  item: (typeof REWARDS)[0];
}) {
  return (
    <View style={styles.rewardCard}>
      <View style={styles.rewardImageBox}>
        <Text style={styles.rewardEmoji}>{item.image}</Text>
        <View
          style={[styles.categoryBadge, { backgroundColor: item.categoryBg }]}
        >
          <Text style={[styles.categoryText, { color: item.categoryColor }]}>
            {item.category}
          </Text>
        </View>
      </View>
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <View style={styles.rewardBottom}>
        <View style={styles.rewardPointsRow}>
          <Text style={styles.rewardBolt}>⚡</Text>
          <Text style={styles.rewardPoints}>{item.points.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.redeemButton} activeOpacity={0.7}>
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HistoryItem({
  item,
  isLast,
}: {
  item: (typeof HISTORY)[0];
  isLast: boolean;
}) {
  const isPositive = item.points > 0;

  return (
    <>
      <View style={styles.historyItem}>
        <View style={styles.historyIconBox}>
          <Text style={styles.historyIcon}>{item.icon}</Text>
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historyTime}>{item.time}</Text>
        </View>
        <Text
          style={[
            styles.historyPoints,
            { color: isPositive ? C.success : C.text },
          ]}
        >
          {isPositive ? '+' : ''}
          {item.points} pts
        </Text>
      </View>
      {!isLast && <View style={styles.historyDivider} />}
    </>
  );
}

function PromoBanner() {
  return (
    <View style={styles.promoBanner}>
      <Text style={styles.promoTitle}>Need more points?</Text>
      <Text style={styles.promoSubtitle}>
        Scan your reusable coffee cup at the{'\n'}Campus Cafe for a 50 pt boost!
      </Text>
      <TouchableOpacity style={styles.promoButton} activeOpacity={0.7}>
        <Text style={styles.promoButtonText}>Go to Scanner</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function ShopScreen() {
  const [activeFilter, setActiveFilter] = useState('All Filters');

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚡</Text>
          <Text style={styles.headerTitle}>EcoShop</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.headerAction}>🕐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance */}
        <BalanceCard />

        {/* Rival Nudge */}
        <RivalNudge />

        {/* Trending Rewards */}
        <SectionHeader title="Trending Rewards" linkText="All Filters" />
        <FilterChips active={activeFilter} onSelect={setActiveFilter} />

        <View style={styles.rewardsGrid}>
          {REWARDS.map((reward) => (
            <RewardCard key={reward.id} item={reward} />
          ))}
        </View>

        {/* Recent History */}
        <SectionHeader title="Recent History" linkText="View All" />
        <View style={styles.historyCard}>
          {HISTORY.map((item, index) => (
            <HistoryItem
              key={item.id}
              item={item}
              isLast={index === HISTORY.length - 1}
            />
          ))}
        </View>

        {/* Promo Banner */}
        <PromoBanner />

        {/* Bottom spacer */}
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

  // Balance Card
  balanceCard: {
    backgroundColor: C.primary,
    borderRadius: 18,
    padding: 22,
    gap: 16,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  balancePts: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  balanceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceIcon: {
    fontSize: 24,
  },
  tierProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierDots: {
    flexDirection: 'row',
    gap: 2,
  },
  tierDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tierDotText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tierProgressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  tierHighlight: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Rival Nudge
  rivalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  rivalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFECE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rivalIcon: {
    fontSize: 22,
  },
  rivalInfo: {
    flex: 1,
    gap: 2,
  },
  rivalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  rivalSubtitle: {
    fontSize: 12,
    color: C.textSecondary,
  },
  rivalArrow: {
    fontSize: 24,
    color: C.accent,
    fontWeight: '300',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
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

  // Filter Chips
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.card,
  },
  filterChipActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },
  filterIcon: {
    fontSize: 13,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.textSecondary,
  },
  filterChipTextActive: {
    color: C.primary,
    fontWeight: '600',
  },

  // Rewards Grid
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rewardImageBox: {
    height: 120,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rewardEmoji: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  rewardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 8,
  },
  rewardPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardBolt: {
    fontSize: 13,
    color: C.primary,
  },
  rewardPoints: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },
  redeemButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  redeemButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // History
  historyCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  historyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 22,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  historyTime: {
    fontSize: 11,
    fontWeight: '500',
    color: C.textTertiary,
    letterSpacing: 0.3,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyDivider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 14,
  },

  // Promo Banner
  promoBanner: {
    backgroundColor: C.primaryLight,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.accent,
  },
  promoSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  promoButton: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 6,
    width: '100%',
    alignItems: 'center',
  },
  promoButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
