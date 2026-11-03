import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  ArrowLeft,
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  ChevronRight,
  Package,
  Home,
  ShoppingCart,
  Users,
  FileText,
  MoreHorizontal,
  X,
  Check,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={36} height={16} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * High Detail Vector Illustrations for Category Thumbnails
 */
function CategoryVisual({ type }: { type: string }) {
  if (type === 'frames') {
    return (
      <Svg width={68} height={38} viewBox="0 0 76 40" fill="none">
        <Path
          d="M8 12 C18 9, 32 9, 36 14 L40 14 C44 9, 58 9, 68 12 L66 28 C58 30, 46 30, 41 24 L35 24 C30 30, 18 30, 10 28 Z"
          stroke="#0F172A"
          strokeWidth="3.6"
          fill="#FFFFFF"
        />
        <Path d="M8 12 L2 20 L14 20" stroke="#0F172A" strokeWidth="2.6" />
        <Path d="M68 12 L74 20 L62 20" stroke="#0F172A" strokeWidth="2.6" />
      </Svg>
    );
  }

  if (type === 'sunglasses') {
    return (
      <Svg width={68} height={36} viewBox="0 0 76 38" fill="none">
        <Rect x="5" y="6" width="30" height="26" rx="8" stroke="#0F172A" strokeWidth="3" fill="#1E293B" />
        <Path d="M35 12 L41 12" stroke="#92400E" strokeWidth="3.2" strokeLinecap="round" />
        <Rect x="41" y="6" width="30" height="26" rx="8" stroke="#0F172A" strokeWidth="3" fill="#1E293B" />
        <Path d="M5 11 L1 10" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
        <Path d="M71 11 L75 10" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'lenses') {
    return (
      <Svg width={66} height={36} viewBox="0 0 76 40" fill="none">
        {/* Left Lens */}
        <Circle cx="26" cy="20" r="16" stroke="#2563EB" strokeWidth="2.4" fill="#DBEAFE" />
        <Path d="M16 14 C19 11, 31 11, 34 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Lens (overlapping) */}
        <Circle cx="50" cy="22" r="16" stroke="#2563EB" strokeWidth="2.4" fill="#BFDBFE" />
        <Path d="M40 16 C43 13, 55 13, 58 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'contact-lenses') {
    return (
      <Svg width={68} height={36} viewBox="0 0 78 40" fill="none">
        <Rect x="4" y="6" width="70" height="28" rx="4" stroke="#60A5FA" strokeWidth="1.5" fill="#FFFFFF" />
        {/* Blue band banner */}
        <Path d="M4 14 L74 14" stroke="#3B82F6" strokeWidth="1.2" />
        {/* Acuvue text lines */}
        <Path d="M10 11 L28 11" stroke="#1D4ED8" strokeWidth="2.4" strokeLinecap="round" />
        <Path d="M10 20 L22 20" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
        {/* Curve wing */}
        <Path d="M38 24 C50 18, 62 20, 68 12" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === 'accessories') {
    return (
      <Svg width={70} height={36} viewBox="0 0 80 40" fill="none">
        {/* Brown Leather Case */}
        <Path
          d="M6 10 C14 4, 46 4, 52 10 L48 24 C48 27, 40 30, 29 30 C18 30, 10 27, 10 24 Z"
          fill="#78350F"
        />
        <Circle cx="29" cy="19" r="2.8" fill="#F59E0B" />
        {/* Blue Spray Bottle */}
        <Rect x="56" y="14" width="9" height="18" rx="2" fill="#3B82F6" />
        <Rect x="58" y="9" width="5" height="5" rx="1" fill="#93C5FD" />
        <Path d="M57 9 L55 9" stroke="#93C5FD" strokeWidth="1.5" />
        {/* Folded Blue Cloth */}
        <Path d="M22 26 L46 26 L40 34 L16 34 Z" fill="#60A5FA" />
        <Path d="M24 28 L48 28 L42 36 L18 36 Z" fill="#93C5FD" />
      </Svg>
    );
  }

  if (type === 'sports-goggles') {
    return (
      <Svg width={68} height={36} viewBox="0 0 78 40" fill="none">
        <Defs>
          <LinearGradient id="goggleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#EA580C" />
            <Stop offset="50%" stopColor="#DC2626" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
        </Defs>
        {/* Black Headband */}
        <Path d="M4 20 L12 20" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <Path d="M66 20 L74 20" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        {/* Outer Frame */}
        <Path
          d="M12 12 C24 8, 54 8, 66 12 C68 22, 64 30, 52 30 C44 30, 42 24, 39 24 C36 24, 34 30, 26 30 C14 30, 10 22, 12 12 Z"
          stroke="#0F172A"
          strokeWidth="4"
          fill="#0F172A"
        />
        {/* Mirrored Visor */}
        <Path
          d="M16 15 C26 12, 52 12, 62 15 C64 22, 60 26, 50 26 C43 26, 41 21, 39 21 C37 21, 35 26, 28 26 C18 26, 14 22, 16 15 Z"
          fill="url(#goggleGrad)"
        />
        {/* Highlight Reflection */}
        <Path d="M20 16 C30 14, 48 14, 58 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.6} />
      </Svg>
    );
  }

  if (type === 'kids-collection') {
    return (
      <Svg width={68} height={36} viewBox="0 0 78 40" fill="none">
        {/* Pink Frame in Background */}
        <Circle cx="36" cy="14" r="8" stroke="#EC4899" strokeWidth="2.2" fill="#FDF2F8" />
        <Path d="M44 14 L50 14" stroke="#EC4899" strokeWidth="2" />
        <Circle cx="58" cy="14" r="8" stroke="#EC4899" strokeWidth="2.2" fill="#FDF2F8" />
        <Path d="M28 14 L22 10" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
        <Path d="M66 14 L72 10" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />

        {/* Blue Frame in Foreground */}
        <Circle cx="20" cy="24" r="9" stroke="#2563EB" strokeWidth="2.5" fill="#EFF6FF" />
        <Path d="M29 24 L35 24" stroke="#2563EB" strokeWidth="2.2" />
        <Circle cx="44" cy="24" r="9" stroke="#2563EB" strokeWidth="2.5" fill="#EFF6FF" />
        <Path d="M11 24 L5 20" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
        <Path d="M53 24 L59 20" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      </Svg>
    );
  }

  // Eye Test Equipment: Optometrist Trial Frame
  return (
    <Svg width={68} height={36} viewBox="0 0 78 40" fill="none">
      {/* Central nose bridge & dial */}
      <Path d="M34 16 L44 16" stroke="#1E293B" strokeWidth="3" />
      <Circle cx="39" cy="12" r="3.5" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
      {/* Left Trial Lens Cell */}
      <Circle cx="22" cy="22" r="12" stroke="#1E293B" strokeWidth="3.2" fill="#F8FAFC" />
      <Circle cx="22" cy="22" r="8" stroke="#94A3B8" strokeWidth="1.5" />
      <Path d="M22 8 L22 12" stroke="#EF4444" strokeWidth="1.8" />
      {/* Right Trial Lens Cell */}
      <Circle cx="56" cy="22" r="12" stroke="#1E293B" strokeWidth="3.2" fill="#F8FAFC" />
      <Circle cx="56" cy="22" r="8" stroke="#94A3B8" strokeWidth="1.5" />
      <Path d="M56 8 L56 12" stroke="#EF4444" strokeWidth="1.8" />
      {/* Side arms */}
      <Path d="M10 20 L4 18" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M68 20 L74 18" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  count: number;
  type: string;
  bgColor: string;
}

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubtitle, setNewCatSubtitle] = useState('');

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 'cat-frames',
      name: 'Frames',
      subtitle: 'Spectacle frames (Regular, Premium, Designer)',
      count: 156,
      type: 'frames',
      bgColor: '#E8F5E9', // Pale soft mint
    },
    {
      id: 'cat-sunglasses',
      name: 'Sunglasses',
      subtitle: 'Sunglasses (Men, Women, Kids)',
      count: 98,
      type: 'sunglasses',
      bgColor: '#FFF1F2', // Soft peach/pink
    },
    {
      id: 'cat-lenses',
      name: 'Lenses',
      subtitle: 'Prescription Lenses (Single Vision, Progressive, Bifocal)',
      count: 42,
      type: 'lenses',
      bgColor: '#EFF6FF', // Soft pale blue
    },
    {
      id: 'cat-contact-lenses',
      name: 'Contact Lenses',
      subtitle: 'Daily, Monthly, Colored Contact Lenses',
      count: 36,
      type: 'contact-lenses',
      bgColor: '#F5F3FF', // Soft pale lavender
    },
    {
      id: 'cat-accessories',
      name: 'Accessories',
      subtitle: 'Cases, Cleaning Kit, Cloth, Screws, Nose Pads',
      count: 64,
      type: 'accessories',
      bgColor: '#FFFBEB', // Soft warm tan
    },
    {
      id: 'cat-sports-goggles',
      name: 'Sports Goggles',
      subtitle: 'Sports, Safety & Designer Goggles',
      count: 28,
      type: 'sports-goggles',
      bgColor: '#FFF1F2', // Soft pale coral
    },
    {
      id: 'cat-kids-collection',
      name: 'Kids Collection',
      subtitle: 'Frames and Sunglasses for Kids',
      count: 22,
      type: 'kids-collection',
      bgColor: '#ECFEFF', // Soft pale cyan
    },
    {
      id: 'cat-eye-test',
      name: 'Eye Test Equipment',
      subtitle: 'Testing Lenses, Trial Frames, Accessories',
      count: 12,
      type: 'eye-test',
      bgColor: '#F3E8FF', // Soft pale violet
    },
  ]);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (cat: CategoryItem) => {
    Alert.prompt
      ? Alert.prompt(
          'Edit Category',
          'Enter updated name for ' + cat.name,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: (val?: string) => {
                if (val && val.trim()) {
                  setCategories((prev) =>
                    prev.map((item) =>
                      item.id === cat.id ? { ...item, name: val.trim() } : item
                    )
                  );
                }
              },
            },
          ],
          'plain-text',
          cat.name
        )
      : Alert.alert('Edit Category', `Editing: ${cat.name}\n(Subtitle: ${cat.subtitle})`);
  };

  const handleDelete = (cat: CategoryItem) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${cat.name}"? Existing ${cat.count} products will become uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCategories((prev) => prev.filter((item) => item.id !== cat.id));
            Alert.alert('Deleted', `Category "${cat.name}" has been removed.`);
          },
        },
      ]
    );
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) {
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }
    const newCat: CategoryItem = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      subtitle: newCatSubtitle.trim() || 'Custom Optical Category',
      count: 0,
      type: 'frames',
      bgColor: '#F1F5F9',
    };
    setCategories((prev) => [newCat, ...prev]);
    setNewCatName('');
    setNewCatSubtitle('');
    setModalVisible(false);
    Alert.alert('Success', `Category "${newCat.name}" added successfully!`);
  };

  return (
    <View style={styles.screen}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {/* Left Arrow & Titles */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Categories</Text>
              <Text style={styles.headerSubtitle}>
                Manage product categories
              </Text>
            </View>
          </View>

          {/* Right Brand Badge */}
          <View style={styles.brandContainer}>
            <HeaderGlassesLogo />
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>Shree Ganesh Optical</Text>
              <Text style={styles.brandSubtitle}>OPTICAL STORE POS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Action Row: Search Input + Add Category Button */}
        <View style={styles.actionRow}>
          <View style={styles.searchBarContainer}>
            <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.addCategoryBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <PlusCircle size={15} color="#FFFFFF" />
            <Text style={styles.addCategoryBtnText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Category List Cards */}
        <View style={styles.categoriesList}>
          {filteredCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push('/(tabs)/products')}
              activeOpacity={0.88}
            >
              {/* Left Visual Box */}
              <View style={[styles.visualBox, { backgroundColor: cat.bgColor }]}>
                <CategoryVisual type={cat.type} />
              </View>

              {/* Middle Information */}
              <View style={styles.catInfoContainer}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catSubtitle} numberOfLines={2}>
                  {cat.subtitle}
                </Text>

                {/* Stock Count Pill */}
                <View style={styles.countRow}>
                  <Package size={13} color="#059669" />
                  <Text style={styles.countText}>{cat.count} Products</Text>
                </View>
              </View>

              {/* Right Action Buttons & Chevron */}
              <View style={styles.rightActionsContainer}>
                {/* Edit Button */}
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEdit(cat)}
                  activeOpacity={0.7}
                >
                  <Pencil size={11} color="#059669" />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(cat)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={11} color="#DC2626" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>

              {/* Chevron Arrow */}
              <ChevronRight size={18} color="#94A3B8" style={styles.chevronIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Extra bottom padding */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Persistent Bottom Tab Bar */}
      <View style={[styles.bottomTabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/dashboard')}
          activeOpacity={0.7}
        >
          <Home size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/pos')}
          activeOpacity={0.7}
        >
          <ShoppingCart size={20} color="#64748B" />
          <Text style={styles.tabLabel}>POS</Text>
        </TouchableOpacity>

        {/* Active Products Tab */}
        <TouchableOpacity
          style={styles.tabItemActivePill}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.7}
        >
          <Package size={20} color="#064E3B" />
          <Text style={styles.tabLabelActive}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/customers')}
          activeOpacity={0.7}
        >
          <Users size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/orders')}
          activeOpacity={0.7}
        >
          <FileText size={20} color="#64748B" />
          <Text style={styles.tabLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(tabs)/settings')}
          activeOpacity={0.7}
        >
          <MoreHorizontal size={20} color="#64748B" />
          <Text style={styles.tabLabel}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Add Category Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Designer Sunglasses, Clip-ons"
                placeholderTextColor="#94A3B8"
                value={newCatName}
                onChangeText={setNewCatName}
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                Description / Subtitle
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Polarized, UV400, Aviators"
                placeholderTextColor="#94A3B8"
                value={newCatSubtitle}
                onChangeText={setNewCatSubtitle}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddCategory}
                activeOpacity={0.85}
              >
                <Check size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.modalSaveText}>Save Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  /* Header */
  header: {
    backgroundColor: '#04281B', // Deep optical emerald green
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  brandTextContainer: {
    marginLeft: 6,
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.6,
  },

  /* Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
  },

  /* Action Row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  searchBarContainer: {
    flex: 1,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  addCategoryBtn: {
    height: 42,
    backgroundColor: '#064E3B',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addCategoryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Categories List */
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  visualBox: {
    width: 80,
    height: 62,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },
  catInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  catName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  catSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Right Actions */
  rightActionsContainer: {
    alignItems: 'flex-end',
    gap: 5,
    marginRight: 4,
  },
  editBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#059669',
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  chevronIcon: {
    marginLeft: 2,
  },

  /* Bottom Tab Bar */
  bottomTabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabItemActivePill: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontSize: 9.5,
    color: '#064E3B',
    marginTop: 2,
    fontWeight: '800',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalBody: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
