import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Friends Data (same as community index) ─────────────────
const FRIENDS = [
  { rank: 12, name: 'Alex Rivera', points: 2450, trending: true, isYou: false },
  { rank: 13, name: 'Sarah Chen', points: 2320, trending: false, isYou: false },
  { rank: 14, name: 'You (Eco-Warrior)', points: 2280, trending: true, isYou: true },
  { rank: 15, name: 'Jordan Lee', points: 2150, trending: false, isYou: false },
  { rank: 16, name: 'Mika Sato', points: 2040, trending: false, isYou: false },
];

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EEEDFE',
  accent: '#FF6B35',
  accentLight: '#FFF0EB',
  success: '#1D9E75',
  bg: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0EEF6',
  youHighlight: '#FFF7ED',
};

// ─── Sub-Components ──────────────────────────────────────────

function FriendRow({
  item,
  onPress,
  isLast,
}: {
  item: (typeof FRIENDS)[0];
  onPress: () => void;
  isLast: boolean;
}) {
  return (
    <>
      <TouchableOpacity
        style={[styles.friendRow, item.isYou && styles.friendRowYou]}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text style={[styles.rankText, item.isYou && styles.rankTextYou]}>
          {item.rank}
        </Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.isYou ? '🌍' : '👤'}</Text>
          {item.isYou && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.friendInfo}>
          <Text style={[styles.friendName, item.isYou && styles.friendNameYou]}>
            {item.name}
          </Text>
          <View style={styles.friendMeta}>
            {item.trending && <Text style={styles.trendingIcon}>📈</Text>}
            <Text style={styles.friendPoints}>
              {item.points.toLocaleString()} pts
            </Text>
          </View>
        </View>
        {item.isYou && (
          <View style={styles.youBadge}>
            <Text style={styles.youBadgeText}>YOU</Text>
          </View>
        )}
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function AllFriendsScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Friends</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Friend count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {FRIENDS.filter((f) => !f.isYou).length} Friends
          </Text>
        </View>

        {/* Friends list */}
        <View style={styles.listCard}>
          {FRIENDS.map((friend, index) => (
            <FriendRow
              key={friend.rank}
              item={friend}
              isLast={index === FRIENDS.length - 1}
              onPress={() => {
                if (!friend.isYou) {
                  router.push(`/community/friend-profile?rank=${friend.rank}`);
                }
              }}
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
    gap: 12,
  },

  // Count
  countRow: {
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
  },

  // List
  listCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  friendRowYou: {
    backgroundColor: C.youHighlight,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
  },
  rankText: {
    width: 24,
    fontSize: 15,
    fontWeight: '600',
    color: C.textTertiary,
    textAlign: 'center',
  },
  rankTextYou: {
    color: C.accent,
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 20,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.success,
    borderWidth: 2,
    borderColor: C.youHighlight,
  },
  friendInfo: {
    flex: 1,
    gap: 2,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  friendNameYou: {
    fontWeight: '700',
  },
  friendMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingIcon: {
    fontSize: 12,
  },
  friendPoints: {
    fontSize: 13,
    color: C.textSecondary,
  },
  youBadge: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.accent,
    letterSpacing: 0.5,
  },
  chevron: {
    fontSize: 22,
    color: C.textTertiary,
    fontWeight: '300',
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },
});
