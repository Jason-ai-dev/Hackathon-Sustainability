import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Mock Data ───────────────────────────────────────────────
const PRO_TIPS = [
  {
    id: '1',
    title: 'Quick Scan',
    description: 'Scan QR stickers at any blue recycling bin.',
    icon: 'ℹ️',
  },
  {
    id: '2',
    title: 'Daily Limit',
    description: 'You can log up to 5 actions per day.',
    icon: 'ℹ️',
  },
];

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
  scannerBg: '#1A1A2E',
};

// ─── Sub-Components ──────────────────────────────────────────

function ScannerToggle({
  active,
  onToggle,
}: {
  active: 'smart' | 'myqr';
  onToggle: (mode: 'smart' | 'myqr') => void;
}) {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleTrack}>
        <TouchableOpacity
          style={[styles.toggleOption, active === 'smart' && styles.toggleOptionActive]}
          onPress={() => onToggle('smart')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              active === 'smart' && styles.toggleTextActive,
            ]}
          >
            Smart Scan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleOption, active === 'myqr' && styles.toggleOptionActive]}
          onPress={() => onToggle('myqr')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              active === 'myqr' && styles.toggleTextActive,
            ]}
          >
            My QR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CornerBrackets() {
  const bracketStyle = {
    position: 'absolute' as const,
    width: 28,
    height: 28,
    borderColor: C.primary,
  };

  return (
    <>
      <View
        style={[
          bracketStyle,
          { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
        ]}
      />
      <View
        style={[
          bracketStyle,
          { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
        ]}
      />
      <View
        style={[
          bracketStyle,
          { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
        ]}
      />
      <View
        style={[
          bracketStyle,
          { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
        ]}
      />
    </>
  );
}

function ScannerView({
  hasPermission,
  onRequestPermission,
  onScanned,
}: {
  hasPermission: boolean | null;
  onRequestPermission: () => void;
  onScanned: (data: string) => void;
}) {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScanned(data);
    setTimeout(() => setScanned(false), 3000);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.scannerPlaceholder}>
        <Text style={styles.placeholderText}>Requesting camera access...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.scannerPlaceholder}>
        <Text style={styles.placeholderIcon}>📷</Text>
        <Text style={styles.placeholderTitle}>Camera access needed</Text>
        <Text style={styles.placeholderText}>
          Allow camera access to scan QR codes on recycling bins and eco-stations.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={onRequestPermission}
          activeOpacity={0.7}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {/* Overlay with viewfinder cutout */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.viewfinder}>
            <CornerBrackets />
            {/* Center reticle */}
            <View style={styles.reticle}>
              <View style={styles.reticleCorner} />
            </View>
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.scanHint}>Align QR code within frame</Text>
        </View>
      </View>
    </View>
  );
}

function ScanResultToast({ data, visible }: { data: string; visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.toast}>
      <Text style={styles.toastIcon}>✅</Text>
      <View style={styles.toastInfo}>
        <Text style={styles.toastTitle}>QR Code Detected!</Text>
        <Text style={styles.toastData} numberOfLines={1}>
          {data}
        </Text>
      </View>
      <Text style={styles.toastPoints}>+50 pts</Text>
    </View>
  );
}

function ProTipCard({ item }: { item: (typeof PRO_TIPS)[0] }) {
  return (
    <View style={styles.tipCard}>
      <Text style={styles.tipIcon}>{item.icon}</Text>
      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipDescription}>{item.description}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────

export default function VerifyScreen() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [scanMode, setScanMode] = useState<'smart' | 'myqr'>('smart');
  const [lastScanned, setLastScanned] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const current = await Camera.getCameraPermissionsAsync();
        console.log('Current permission:', current.status);
        
        if (current.status === 'granted') {
          setCameraPermission(true);
          return;
        }
        
        const result = await Camera.requestCameraPermissionsAsync();
        console.log('Requested permission:', result.status);
        setCameraPermission(result.status === 'granted');
      } catch (error) {
        console.log('Camera permission error:', error);
        setCameraPermission(false);
      }
    })();
  }, []);

  const handleScanned = (data: string) => {
    setLastScanned(data);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const hasPermission = cameraPermission;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>⚡</Text>
          <Text style={styles.headerTitle}>Verify Action</Text>
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
        {/* Toggle */}
        <ScannerToggle active={scanMode} onToggle={setScanMode} />

        {/* Scanner */}
        {scanMode === 'smart' ? (
          <ScannerView
            hasPermission={hasPermission}
            onRequestPermission={async () => {
              const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
              if (status === 'granted') {
                setCameraPermission(true);
              } else if (!canAskAgain) {
                Linking.openSettings();
              }
            }}
            onScanned={handleScanned}
          />
        ) : (
          <View style={styles.myQrContainer}>
            <View style={styles.myQrBox}>
              <Text style={styles.myQrEmoji}>📱</Text>
              <Text style={styles.myQrTitle}>Your Personal QR</Text>
              <Text style={styles.myQrSubtitle}>
                Show this code to verify your identity at eco-stations
              </Text>
              <View style={styles.myQrPlaceholder}>
                <Text style={styles.myQrPlaceholderText}>QR CODE</Text>
              </View>
            </View>
          </View>
        )}

        {/* Scan Result Toast */}
        <ScanResultToast data={lastScanned} visible={showToast} />

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Scanning for Eco-Stickers</Text>
          <Text style={styles.descriptionText}>
            Point your camera at a QR sticker on recycling bins, cafe counters, or
            shared transit points.
          </Text>
        </View>

        {/* Identify Object Button */}
        <TouchableOpacity style={styles.identifyButton} activeOpacity={0.7}>
          <Text style={styles.identifyIcon}>🔍</Text>
          <Text style={styles.identifyText}>Identify Object</Text>
        </TouchableOpacity>

        {/* Pro Tips */}
        <View style={styles.tipsHeader}>
          <Text style={styles.tipsTitle}>Pro Tips</Text>
          <TouchableOpacity>
            <Text style={styles.tipsLink}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tipsGrid}>
          {PRO_TIPS.map((tip) => (
            <ProTipCard key={tip.id} item={tip} />
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.7}>
        <Text style={styles.fabIcon}>⚡</Text>
      </TouchableOpacity>
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

  // Toggle
  toggleContainer: {
    alignItems: 'center',
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#F0EEF6',
    borderRadius: 24,
    padding: 3,
  },
  toggleOption: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
  },
  toggleOptionActive: {
    backgroundColor: C.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },

  // Camera Container
  cameraContainer: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: C.scannerBg,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTop: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 200,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  viewfinder: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  reticle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(108, 92, 231, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCorner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: 2,
  },
  overlayBottom: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 16,
  },
  scanHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // Camera Actions
  cameraActions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  cameraActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cameraActionIcon: {
    fontSize: 20,
  },

  // Permission / Placeholder
  scannerPlaceholder: {
    height: 320,
    borderRadius: 20,
    backgroundColor: C.scannerBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  placeholderIcon: {
    fontSize: 40,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: C.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 22,
    marginTop: 4,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // My QR
  myQrContainer: {
    alignItems: 'center',
  },
  myQrBox: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  myQrEmoji: {
    fontSize: 32,
  },
  myQrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  myQrSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  myQrPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  myQrPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textTertiary,
    letterSpacing: 1,
  },

  // Toast
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.success,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  toastIcon: {
    fontSize: 22,
  },
  toastInfo: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toastData: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  toastPoints: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Description
  descriptionSection: {
    alignItems: 'center',
    gap: 6,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 340,
  },

  // Identify Button
  identifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.primaryLight,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 26,
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  identifyIcon: {
    fontSize: 18,
  },
  identifyText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.primary,
  },

  // Pro Tips
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  tipsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
  },
  tipsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  tipCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
  },
  tipDescription: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 17,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});

