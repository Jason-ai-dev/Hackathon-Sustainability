import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Rewards Data (same as shop index) ──────────────────────
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

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EEEDFE',
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

function RewardCard({ item }: { item: (typeof REWARDS)[0] }) {
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
      <Text style={styles.rewardDesc} numberOfLines={2}>{item.desc}</Text>
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

// ─── Main Screen ─────────────────────────────────────────────

export default function AllRewardsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRewards = activeFilter === 'all'
    ? REWARDS
    : REWARDS.filter((r) => r.slug === activeFilter);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Rewards</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Sticky filter bar */}
      <View style={styles.filterBar}>
        <FilterChips active={activeFilter} onSelect={setActiveFilter} />
        <Text style={styles.countText}>
          {filteredRewards.length} {filteredRewards.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Full-screen scrollable grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rewardsGrid}>
          {filteredRewards.map((reward) => (
            <RewardCard key={reward.id} item={reward} />
          ))}
        </View>

        {filteredRewards.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No rewards in this category yet</Text>
          </View>
        )}

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

  // Filter bar (sticky below header)
  filterBar: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
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
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textTertiary,
    paddingHorizontal: 2,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Grid
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rewardCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  rewardImageBox: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rewardEmoji: {
    fontSize: 44,
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
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  rewardShop: {
    fontSize: 11,
    color: C.textTertiary,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  rewardDesc: {
    fontSize: 11,
    color: C.textSecondary,
    paddingHorizontal: 12,
    marginTop: 4,
    lineHeight: 16,
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

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 14,
    color: C.textSecondary,
  },
});
