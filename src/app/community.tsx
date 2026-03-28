import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Mock Data ───────────────────────────────────────────────
const SEASON = {
  title: 'Dorm War',
  season: 4,
  week: 2,
  isLive: true,
};

const STANDINGS = [
  { name: 'ThaiSoc', points: 7200, color: '#6C5CE7' },
  { name: 'GymShark', points: 8400, color: '#1A1A2E' },
  { name: 'GreenPark', points: 5600, color: '#1A1A2E' },
  { name: 'ComSci', points: 6200, color: '#1A1A2E' },
];

const FRIENDS = [
  { rank: 12, name: 'Alex Rivera', points: 2450, trending: true, isYou: false },
  { rank: 13, name: 'Sarah Chen', points: 2320, trending: false, isYou: false },
  { rank: 14, name: 'You (Eco-Warrior)', points: 2280, trending: true, isYou: true },
  { rank: 15, name: 'Jordan Lee', points: 2150, trending: false, isYou: false },
  { rank: 16, name: 'Mika Sato', points: 2040, trending: false, isYou: false },
];

const ACTIVE_WARS = [
  {
    id: '1',
    title: 'The Plastic-Free Cafeteria',
    teams: 'ComSci vs. GymShark',
    timeLeft: '14h 22m left',
    points: 250,
    icon: '⚡',
  },
  {
    id: '2',
    title: 'Dorm Energy Blackout',
    teams: 'ComSci vs. GreenPark',
    timeLeft: '2d 04h left',
    points: 500,
    icon: '⚡',
  },
];

const DAILY_QUESTS = [
  {
    id: '1',
    title: 'Recycle a Water Bottle',
    description: 'Scan any PET bottle at a campus recycling bin',
    points: 50,
    icon: '🧴',
    progress: 0,
    goal: 1,
    category: 'Recycling',
    categoryColor: '#0F6E56',
    categoryBg: '#E1F5EE',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Donate Second-Hand Clothing',
    description: 'Drop off clothes at the EcoHub donation point',
    points: 150,
    icon: '👕',
    progress: 0,
    goal: 1,
    category: 'Reuse',
    categoryColor: '#185FA5',
    categoryBg: '#E6F1FB',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Attend Sustainability Talk',
    description: 'Join today\'s Green Future conference at Hall B',
    points: 200,
    icon: '🎓',
    progress: 0,
    goal: 1,
    category: 'Learn',
    categoryColor: '#3C3489',
    categoryBg: '#EEEDFE',
    difficulty: 'Special',
  },
];

const RIVAL_ALERT = {
  faction: 'GreenPark',
  actions: 15,
  type: 'recycling',
};

// ─── Colors ──────────────────────────────────────────────────
const C = {
  primary: '#6C5CE7',
  primaryLight: '#EEEDFE',
  primaryDark: '#3C3489',
  accent: '#FF6B35',
  accentLight: '#FFF0EB',
  success: '#1D9E75',
  successLight: '#E1F5EE',
  danger: '#E24B4A',
  dangerLight: '#FCEBEB',
  live: '#E24B4A',
  bg: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0EEF6',
  youHighlight: '#FFF7ED',
  youBorder: '#FFD9B3',
};

// ─── Sub-Components ──────────────────────────────────────────

function SeasonBanner() {
  return (
    <View style={styles.seasonBanner}>
      <View>
        <Text style={styles.seasonTitle}>{SEASON.title}</Text>
        <Text style={styles.seasonSubtitle}>
          🔥 Season {SEASON.season}: Week {SEASON.week}
        </Text>
      </View>
      {SEASON.isLive && (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}
    </View>
  );
}

function StandingsCard() {
  const maxPoints = Math.max(...STANDINGS.map((s) => s.points));

  return (
    <View style={styles.standingsCard}>
      <View style={styles.standingsHeader}>
        <Text style={styles.standingsTitle}>Overall Standings</Text>
        <Text style={styles.standingsUnit}>POINTS X1000</Text>
      </View>
      <View style={styles.barsContainer}>
        {STANDINGS.map((team) => {
          const barWidth = (team.points / maxPoints) * 100;
          return (
            <View key={team.name} style={styles.barRow}>
              <Text style={styles.barLabel}>{team.name}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${barWidth}%`,
                      backgroundColor: team.color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
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

function LeaderboardRow({
  item,
}: {
  item: (typeof FRIENDS)[0];
}) {
  return (
    <TouchableOpacity
      style={[
        styles.leaderboardRow,
        item.isYou && styles.leaderboardRowYou,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.rankText, item.isYou && styles.rankTextYou]}>
        {item.rank}
      </Text>
      <View style={styles.leaderboardAvatar}>
        <Text style={styles.leaderboardAvatarText}>
          {item.isYou ? '🌍' : '👤'}
        </Text>
        {item.isYou && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={[styles.leaderboardName, item.isYou && styles.leaderboardNameYou]}>
          {item.name}
        </Text>
        <View style={styles.leaderboardPointsRow}>
          {item.trending && <Text style={styles.trendingIcon}>📈</Text>}
          <Text style={styles.leaderboardPoints}>
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
  );
}

function WarCard({
  item,
}: {
  item: (typeof ACTIVE_WARS)[0];
}) {
  return (
    <View style={styles.warCard}>
      <View style={styles.warHeader}>
        <View style={styles.warIconBox}>
          <Text style={styles.warIcon}>{item.icon}</Text>
        </View>
        <View style={styles.warInfo}>
          <Text style={styles.warTitle}>{item.title}</Text>
          <Text style={styles.warTeams}>{item.teams}</Text>
        </View>
      </View>
      <View style={styles.warFooter}>
        <View style={styles.warMeta}>
          <Text style={styles.warMetaIcon}>⏱️</Text>
          <Text style={styles.warMetaText}>{item.timeLeft}</Text>
        </View>
        <View style={styles.warMeta}>
          <Text style={styles.warMetaIcon}>🏆</Text>
          <Text style={styles.warMetaPoints}>+{item.points} pts</Text>
        </View>
        <TouchableOpacity style={styles.joinButton} activeOpacity={0.7}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function QuestCard({
  item,
  onStart,
}: {
  item: (typeof DAILY_QUESTS)[0];
  onStart: () => void;
}) {
  const isComplete = item.progress >= item.goal;

  return (
    <View style={[styles.questCard, isComplete && styles.questCardComplete]}>
      <View style={styles.questTop}>
        <View style={styles.questIconBox}>
          <Text style={styles.questIcon}>{item.icon}</Text>
        </View>
        <View style={styles.questInfo}>
          <View style={styles.questTitleRow}>
            <Text style={styles.questTitle}>{item.title}</Text>
            {isComplete && <Text style={styles.questCheck}>✅</Text>}
          </View>
          <Text style={styles.questDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.questBottom}>
        <View style={styles.questTags}>
          <View style={[styles.questCategoryBadge, { backgroundColor: item.categoryBg }]}>
            <Text style={[styles.questCategoryText, { color: item.categoryColor }]}>
              {item.category}
            </Text>
          </View>
          <View style={styles.questDifficultyBadge}>
            <Text style={styles.questDifficultyText}>{item.difficulty}</Text>
          </View>
        </View>
        <View style={styles.questReward}>
          <Text style={styles.questPointsIcon}>🏆</Text>
          <Text style={styles.questPoints}>+{item.points} pts</Text>
          {!isComplete && (
            <TouchableOpacity style={styles.questStartButton} onPress={onStart} activeOpacity={0.7}>
              <Text style={styles.questStartText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.questProgressTrack}>
        <View
          style={[
            styles.questProgressFill,
            {
              width: `${(item.progress / item.goal) * 100}%`,
              backgroundColor: isComplete ? C.success : C.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

function DailyQuestBoard() {
  const [quests, setQuests] = useState(DAILY_QUESTS);
  const completedCount = quests.filter((q) => q.progress >= q.goal).length;

  const handleStart = (id: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, progress: q.goal } : q
      )
    );
  };

  return (
    <View style={styles.questBoard}>
      <View style={styles.questBoardHeader}>
        <View style={styles.questBoardTitleRow}>
          <Text style={styles.questBoardIcon}>📋</Text>
          <View>
            <Text style={styles.questBoardTitle}>Daily Quests</Text>
            <Text style={styles.questBoardSubtitle}>Resets in 8h 42m</Text>
          </View>
        </View>
        <View style={styles.questBoardProgress}>
          <Text style={styles.questBoardCount}>
            {completedCount}/{quests.length}
          </Text>
          <Text style={styles.questBoardCountLabel}>Done</Text>
        </View>
      </View>

      {completedCount < quests.length ? (
        <View style={styles.questBonusBanner}>
          <Text style={styles.questBonusIcon}>🎯</Text>
          <Text style={styles.questBonusText}>
            Complete all 3 quests for a{' '}
            <Text style={styles.questBonusHighlight}>+100 bonus pts</Text> reward!
          </Text>
        </View>
      ) : (
        <View style={[styles.questBonusBanner, styles.questBonusBannerDone]}>
          <Text style={styles.questBonusIcon}>🎉</Text>
          <Text style={styles.questBonusTextDone}>
            All quests complete!{' '}
            <Text style={{ fontWeight: '700' }}>+100 bonus pts</Text> earned!
          </Text>
        </View>
      )}

      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          item={quest}
          onStart={() => handleStart(quest.id)}
        />
      ))}
    </View>
  );
}

function RivalAlertBanner() {
  return (
    <View style={styles.rivalAlert}>
      <View style={styles.rivalAlertHeader}>
        <View style={styles.rivalAlertIconBox}>
          <Text style={styles.rivalAlertIcon}>🔔</Text>
        </View>
        <View style={styles.rivalAlertInfo}>
          <Text style={styles.rivalAlertTitle}>Rival Alert!</Text>
          <Text style={styles.rivalAlertSubtitle}>
            {RIVAL_ALERT.faction} just logged {RIVAL_ALERT.actions}{' '}
            {RIVAL_ALERT.type} actions. They are catching up!
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <Text style={styles.defendText}>Defend Faction</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function CommunityScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Wars</Text>
        <TouchableOpacity>
          <Text style={styles.headerAction}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SeasonBanner />
        <StandingsCard />

        <SectionHeader title="Top Friends" linkText="View Global" />
        <View style={styles.leaderboardCard}>
          {FRIENDS.map((friend, index) => (
            <React.Fragment key={friend.rank}>
              <LeaderboardRow item={friend} />
              {index < FRIENDS.length - 1 && !friend.isYou && !FRIENDS[index + 1]?.isYou && (
                <View style={styles.leaderboardDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        <SectionHeader title="Active Wars" />
        {ACTIVE_WARS.map((war) => (
          <WarCard key={war.id} item={war} />
        ))}

        <DailyQuestBoard />

        <RivalAlertBanner />

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
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
  },
  headerAction: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  seasonBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  seasonTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
  seasonSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: C.live,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.live,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: C.live,
    letterSpacing: 0.5,
  },
  standingsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  standingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  standingsUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: C.textTertiary,
    letterSpacing: 0.5,
  },
  barsContainer: {
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barLabel: {
    width: 76,
    fontSize: 13,
    fontWeight: '500',
    color: C.textSecondary,
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 22,
    backgroundColor: C.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
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
  leaderboardCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  leaderboardRowYou: {
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
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  leaderboardAvatarText: {
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
  leaderboardInfo: {
    flex: 1,
    gap: 2,
  },
  leaderboardName: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  leaderboardNameYou: {
    fontWeight: '700',
  },
  leaderboardPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingIcon: {
    fontSize: 12,
  },
  leaderboardPoints: {
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
  leaderboardDivider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },
  warCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  warHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warIcon: {
    fontSize: 22,
  },
  warInfo: {
    flex: 1,
    gap: 2,
  },
  warTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  warTeams: {
    fontSize: 13,
    color: C.textSecondary,
  },
  warFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  warMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  warMetaIcon: {
    fontSize: 13,
  },
  warMetaText: {
    fontSize: 13,
    color: C.textSecondary,
  },
  warMetaPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: C.accent,
  },
  joinButton: {
    marginLeft: 'auto',
    backgroundColor: C.primary,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 16,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ─── Daily Quest Board ──────────────────────────────────────
  questBoard: {
    gap: 12,
  },
  questBoardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
  },
  questBoardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  questBoardIcon: {
    fontSize: 26,
  },
  questBoardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  questBoardSubtitle: {
    fontSize: 12,
    color: C.textTertiary,
    marginTop: 1,
  },
  questBoardProgress: {
    alignItems: 'center',
    backgroundColor: C.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  questBoardCount: {
    fontSize: 20,
    fontWeight: '800',
    color: C.primary,
  },
  questBoardCountLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.primaryDark,
    letterSpacing: 0.3,
  },
  questBonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FFE4CC',
    borderStyle: 'dashed',
  },
  questBonusBannerDone: {
    backgroundColor: C.successLight,
    borderColor: '#9FE1CB',
  },
  questBonusIcon: {
    fontSize: 16,
  },
  questBonusText: {
    fontSize: 13,
    color: '#7C4A10',
    flex: 1,
    lineHeight: 18,
  },
  questBonusTextDone: {
    fontSize: 13,
    color: '#085041',
    flex: 1,
    lineHeight: 18,
  },
  questBonusHighlight: {
    fontWeight: '700',
    color: C.accent,
  },
  questCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  questCardComplete: {
    borderColor: C.success,
    backgroundColor: '#FAFFF8',
  },
  questTop: {
    flexDirection: 'row',
    gap: 12,
  },
  questIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questIcon: {
    fontSize: 26,
  },
  questInfo: {
    flex: 1,
    gap: 3,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    flex: 1,
  },
  questCheck: {
    fontSize: 16,
  },
  questDescription: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 17,
  },
  questBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questTags: {
    flexDirection: 'row',
    gap: 6,
  },
  questCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  questCategoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  questDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F5F3FF',
  },
  questDifficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textSecondary,
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questPointsIcon: {
    fontSize: 13,
  },
  questPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: C.accent,
  },
  questStartButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
    marginLeft: 4,
  },
  questStartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questProgressTrack: {
    height: 4,
    backgroundColor: C.bg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  rivalAlert: {
    backgroundColor: C.dangerLight,
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  rivalAlertHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  rivalAlertIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rivalAlertIcon: {
    fontSize: 20,
  },
  rivalAlertInfo: {
    flex: 1,
    gap: 3,
  },
  rivalAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
  },
  rivalAlertSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 19,
  },
  defendText: {
    fontSize: 14,
    fontWeight: '700',
    color: C.danger,
    marginLeft: 52,
  },
});
