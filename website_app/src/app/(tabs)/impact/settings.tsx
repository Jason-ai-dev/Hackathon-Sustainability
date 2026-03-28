import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Colors (same palette as the rest of the app) ───────────
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
  inputBg: '#F5F4FA',
  inputBorder: '#E5E3EE',
};

// ─── Mock User Data ─────────────────────────────────────────
const MOCK_USER = {
  userId: 'ECO-20240312-0047',
  name: 'Jamie Nguyen',
  username: 'eco_warrior_jn',
  password: '123456',
  email: 'eco@test.com',
  phone: '+44 7700 900123',
};

// ─── Field Row Component ────────────────────────────────────
function FieldRow({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = 'default' as const,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        placeholderTextColor={C.textTertiary}
      />
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();

  const [name, setName] = useState(MOCK_USER.name);
  const [username, setUsername] = useState(MOCK_USER.username);
  const [password, setPassword] = useState(MOCK_USER.password);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone, setPhone] = useState(MOCK_USER.phone);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🌍</Text>
          </View>
          <Text style={styles.avatarName}>{name}</Text>
          <Text style={styles.avatarUsername}>@{username}</Text>
        </View>

        {/* Fields Card */}
        <View style={styles.fieldsCard}>
          <FieldRow
            label="User ID"
            value={MOCK_USER.userId}
            editable={false}
          />
          <View style={styles.divider} />
          <FieldRow label="Full Name" value={name} onChangeText={setName} />
          <View style={styles.divider} />
          <FieldRow
            label="Username"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.divider} />
          <FieldRow
            label="Password"
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.divider} />
          <FieldRow
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.divider} />
          <FieldRow
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Bottom spacer */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
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
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: C.text,
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: C.primary,
  },
  avatarText: {
    fontSize: 36,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
  },
  avatarUsername: {
    fontSize: 14,
    color: C.textSecondary,
  },

  // Fields Card
  fieldsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
  },
  fieldGroup: {
    gap: 6,
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  fieldInput: {
    fontSize: 16,
    fontWeight: '500',
    color: C.text,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 48,
  },
  fieldInputDisabled: {
    backgroundColor: '#EEEDFE',
    color: C.textSecondary,
    borderColor: C.border,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // Save Button
  saveButton: {
    backgroundColor: C.primary,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Logout Button
  logoutButton: {
    backgroundColor: C.card,
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.danger,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.danger,
  },
});
