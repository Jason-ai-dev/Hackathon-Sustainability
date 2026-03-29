import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ─── Rewards Data (from CSV) ────────────────────────────────
const REWARDS = [
  { id: '1', category: 'Zero-Waste Home', slug: 'home', shop: 'GreenWrap Co.', name: 'Beeswax Wrap Set', desc: 'Pack of 3 reusable beeswax wraps — replaces cling film for food storage', points: 120, icon: '🐝', catColor: '#0F6E56', catBg: '#E1F5EE', featured: true, stock: 'in_stock' },
  { id: '2', category: 'Zero-Waste Home', slug: 'home', shop: 'GreenWrap Co.', name: 'Silicone Food Storage Kit', desc: 'Set of 4 leak-proof reusable silicone bags for meal prep and snacks', points: 250, icon: '🍱', catColor: '#0F6E56', catBg: '#E1F5EE', featured: false, stock: 'in_stock' },
  { id: '3', category: 'Zero-Waste Home', slug: 'home', shop: 'EarthScrub', name: 'Compostable Kitchen Kit', desc: 'Loofah sponge duo and bamboo dish brush — fully biodegradable', points: 80, icon: '🧽', catColor: '#0F6E56', catBg: '#E1F5EE', featured: false, stock: 'in_stock' },
  { id: '4', category: 'Zero-Waste Home', slug: 'home', shop: 'SipClean', name: 'Steel Straw Set', desc: '4 stainless steel straws with cleaning brush and canvas travel pouch', points: 60, icon: '🥤', catColor: '#0F6E56', catBg: '#E1F5EE', featured: true, stock: 'in_stock' },
  { id: '5', category: 'Personal Care', slug: 'beauty', shop: 'BarNone Beauty', name: 'Shampoo Bar', desc: 'Solid lavender-mint shampoo bar — lasts 80 washes and zero plastic', points: 90, icon: '🧴', catColor: '#993556', catBg: '#FBEAF0', featured: true, stock: 'in_stock' },
  { id: '6', category: 'Personal Care', slug: 'beauty', shop: 'BarNone Beauty', name: 'Conditioner Bar', desc: 'Solid argan oil conditioner bar — plastic-free and travel-friendly', points: 90, icon: '💆', catColor: '#993556', catBg: '#FBEAF0', featured: false, stock: 'in_stock' },
  { id: '7', category: 'Personal Care', slug: 'beauty', shop: 'BarNone Beauty', name: 'Body Wash Bar', desc: 'Solid citrus body wash bar — replaces 3 plastic bottles', points: 85, icon: '🫧', catColor: '#993556', catBg: '#FBEAF0', featured: false, stock: 'in_stock' },
  { id: '8', category: 'Personal Care', slug: 'beauty', shop: 'BambooBright', name: 'Bamboo Dental Kit', desc: 'Bamboo toothbrush and silk dental floss in a glass vial', points: 70, icon: '🪥', catColor: '#993556', catBg: '#FBEAF0', featured: false, stock: 'in_stock' },
  { id: '9', category: 'Personal Care', slug: 'beauty', shop: 'ReScent', name: 'Refillable Deodorant', desc: 'Stainless steel case with 2 compostable lavender refill cartridges', points: 200, icon: '🧊', catColor: '#993556', catBg: '#FBEAF0', featured: true, stock: 'in_stock' },
  { id: '10', category: 'Personal Care', slug: 'beauty', shop: 'EdgeEver', name: 'Safety Razor', desc: 'Chrome-finish metal safety razor with 10 replacement blades', points: 350, icon: '🪒', catColor: '#993556', catBg: '#FBEAF0', featured: false, stock: 'limited' },
  { id: '11', category: 'Sustainable Tech', slug: 'tech', shop: 'Pela Case', name: 'Plant-Based Phone Case', desc: 'Compostable phone case made from flax straw — fits iPhone and Samsung', points: 180, icon: '📱', catColor: '#185FA5', catBg: '#E6F1FB', featured: true, stock: 'in_stock' },
  { id: '12', category: 'Sustainable Tech', slug: 'tech', shop: 'SunBank', name: 'Solar Power Bank', desc: '5000mAh solar-powered portable charger — charge anywhere outdoors', points: 800, icon: '☀️', catColor: '#185FA5', catBg: '#E6F1FB', featured: true, stock: 'limited' },
  { id: '13', category: 'Sustainable Tech', slug: 'tech', shop: 'OceanCable', name: 'Ocean Plastic Cable', desc: '1.5m braided USB-C cable made from reclaimed fishing nets', points: 150, icon: '🔌', catColor: '#185FA5', catBg: '#E6F1FB', featured: false, stock: 'in_stock' },
  { id: '14', category: 'Circular Fashion', slug: 'fashion', shop: 'ThreadAgain', name: 'Organic Cotton Tote', desc: 'Heavy-duty organic cotton grocery tote — reinforced handles', points: 100, icon: '👜', catColor: '#854F0B', catBg: '#FAEEDA', featured: true, stock: 'in_stock' },
  { id: '15', category: 'Circular Fashion', slug: 'fashion', shop: 'ReMade Goods', name: 'Upcycled Wallet', desc: 'Slim wallet handmade from reclaimed truck tarp — each one is unique', points: 450, icon: '👛', catColor: '#854F0B', catBg: '#FAEEDA', featured: false, stock: 'limited' },
  { id: '16', category: 'Circular Fashion', slug: 'fashion', shop: 'ReMade Goods', name: 'Fire Hose Messenger Bag', desc: 'Crossbody bag crafted from decommissioned fire hoses', points: 900, icon: '🎒', catColor: '#854F0B', catBg: '#FAEEDA', featured: false, stock: 'limited' },
  { id: '17', category: 'Circular Fashion', slug: 'fashion', shop: 'LoopThreads', name: 'Recycled Polyester Socks', desc: '3-pack athletic socks made from 12 recycled plastic bottles', points: 75, icon: '🧦', catColor: '#854F0B', catBg: '#FAEEDA', featured: false, stock: 'in_stock' },
  { id: '18', category: 'Circular Fashion', slug: 'fashion', shop: 'LoopThreads', name: 'Recycled Headband', desc: 'Moisture-wicking workout headband made from ocean-bound plastic', points: 50, icon: '🏃', catColor: '#854F0B', catBg: '#FAEEDA', featured: false, stock: 'in_stock' },
  { id: '19', category: 'Digital & Experiences', slug: 'digital', shop: 'OneTreePlanted', name: 'Plant a Tree', desc: 'Fund one tree planted in a reforestation project — certificate included', points: 30, icon: '🌱', catColor: '#3C3489', catBg: '#EEEDFE', featured: true, stock: 'in_stock' },
  { id: '20', category: 'Digital & Experiences', slug: 'digital', shop: 'OneTreePlanted', name: 'Plant a Forest (10 Trees)', desc: 'Fund 10 trees in a global reforestation project — named grove', points: 250, icon: '🌲', catColor: '#3C3489', catBg: '#EEEDFE', featured: false, stock: 'in_stock' },
  { id: '21', category: 'Digital & Experiences', slug: 'digital', shop: 'Bath Botanical Gardens', name: 'Botanical Garden Day Pass', desc: 'Free entry for one to the local botanical gardens', points: 150, icon: '🌺', catColor: '#3C3489', catBg: '#EEEDFE', featured: true, stock: 'in_stock' },
  { id: '22', category: 'Digital & Experiences', slug: 'digital', shop: 'National Trust', name: 'National Park Weekend Pass', desc: 'Weekend entry pass for any local national park or nature reserve', points: 400, icon: '🏞️', catColor: '#3C3489', catBg: '#EEEDFE', featured: false, stock: 'limited' },
  { id: '23', category: 'Digital & Experiences', slug: 'digital', shop: 'GreenSkills Academy', name: 'Urban Gardening Masterclass', desc: '90-min digital course on growing herbs and vegetables in small spaces', points: 120, icon: '🌿', catColor: '#3C3489', catBg: '#EEEDFE', featured: false, stock: 'in_stock' },
  { id: '24', category: 'Digital & Experiences', slug: 'digital', shop: 'GreenSkills Academy', name: 'Composting 101 Course', desc: 'Self-paced digital course on home composting techniques', points: 100, icon: '🪱', catColor: '#3C3489', catBg: '#EEEDFE', featured: false, stock: 'in_stock' },
  { id: '25', category: 'Digital & Experiences', slug: 'digital', shop: 'GreenSkills Academy', name: 'Clothes Mending Workshop', desc: 'Live online workshop on visible mending and upcycling old garments', points: 180, icon: '🧵', catColor: '#3C3489', catBg: '#EEEDFE', featured: false, stock: 'in_stock' },
];

const CATEGORIES = [
  { label: 'All', slug: 'all' },
  { label: 'Home', slug: 'home' },
  { label: 'Care', slug: 'beauty' },
  { label: 'Tech', slug: 'tech' },
  { label: 'Fashion', slug: 'fashion' },
  { label: 'Digital', slug: 'digital' },
];

// ─── Other Mock Data ────────────────────────────────────────
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

const HISTORY = [
  { id: '1', title: 'Beeswax Wrap Set', time: 'TODAY, 09:15', points: -120, icon: '🐝' },
  { id: '2', title: 'Plant a Tree', time: 'YESTERDAY', points: -30, icon: '🌱' },
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
          {BALANCE.tiers.map((t) => (
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
  onSelect: (slug: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.slug === active;
        return (
          <TouchableOpacity
            key={cat.slug}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => onSelect(cat.slug)}
            activeOpacity={0.7}
          >
            {cat.slug === 'all' && <Text style={styles.filterIcon}>🏷️</Text>}
            <Text
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {cat.label}
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
  const isLimited = item.stock === 'limited';

  return (
    <View style={styles.rewardCard}>
      <View style={[styles.rewardImageBox, { backgroundColor: item.catBg }]}>
        <Text style={styles.rewardEmoji}>{item.icon}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: item.catBg }]}>
          <Text style={[styles.categoryText, { color: item.catColor }]}>
            {item.category}
          </Text>
        </View>
        {isLimited && (
          <View style={styles.limitedBadge}>
            <Text style={styles.limitedText}>Limited</Text>
          </View>
        )}
      </View>
      <Text style={styles.rewardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.rewardShop} numberOfLines={1}>{item.shop}</Text>
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
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRewards = activeFilter === 'all'
    ? REWARDS
    : REWARDS.filter((r) => r.slug === activeFilter);

  // Show featured first, then others — cap at 6 for the preview
  const previewRewards = [
    ...filteredRewards.filter((r) => r.featured),
    ...filteredRewards.filter((r) => !r.featured),
  ].slice(0, 6);

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

        {/* Rewards Section */}
        <SectionHeader
          title="Rewards"
          linkText="View All"
          onLinkPress={() => router.push('/shop/all-rewards')}
        />
        <FilterChips active={activeFilter} onSelect={setActiveFilter} />

        {/* Fixed-height scrollable rewards preview */}
        <View style={styles.rewardsContainer}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.rewardsScrollContent}
          >
            <View style={styles.rewardsGrid}>
              {previewRewards.map((reward) => (
                <RewardCard key={reward.id} item={reward} />
              ))}
            </View>
            {filteredRewards.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No rewards in this category yet</Text>
              </View>
            )}
          </ScrollView>
          {filteredRewards.length > 6 && (
            <TouchableOpacity
              style={styles.seeMoreBar}
              onPress={() => router.push('/shop/all-rewards')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeMoreText}>
                +{filteredRewards.length - 6} more — View All
              </Text>
            </TouchableOpacity>
          )}
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

  // Rewards Container (fixed height)
  rewardsContainer: {
    height: 460,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rewardsScrollContent: {
    padding: 12,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seeMoreBar: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.card,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.primary,
  },
  rewardCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: C.bg,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rewardImageBox: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rewardEmoji: {
    fontSize: 40,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  limitedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  limitedText: {
    fontSize: 10,
    fontWeight: '600',
    color: C.danger,
  },
  rewardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  rewardShop: {
    fontSize: 11,
    color: C.textTertiary,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  rewardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingTop: 6,
  },
  rewardPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardBolt: {
    fontSize: 12,
    color: C.primary,
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  redeemButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  redeemButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 14,
    color: C.textSecondary,
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
