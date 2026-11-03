import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Switch,
  Image,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { opticalStore } from '../../src/store/opticalStore';
import { Product, ProductCategory } from '../../src/types/product';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import {
  ArrowLeft,
  Camera,
  X,
  ChevronDown,
  Coins,
  FileText,
  Check,
  Settings,
  Barcode,
  Save,
  Package,
  Glasses,
  Image as ImageIcon,
  Plus,
  Upload,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * Optical Eyeglasses Logo for Top Header
 */
function HeaderGlassesLogo() {
  return (
    <Svg width={42} height={20} viewBox="0 0 60 26" fill="none">
      <Rect x="3" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M25 10 C28 7, 32 7, 35 10" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Rect x="35" y="3" width="22" height="20" rx="10" stroke="#FFFFFF" strokeWidth="2.8" />
      <Path d="M3 11 L1 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M57 11 L59 11" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

export default function AddProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form Fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Frames');
  const [brand, setBrand] = useState('');
  const [modelSku, setModelSku] = useState('');
  const [gender, setGender] = useState('Unisex');
  const [frameType, setFrameType] = useState('Full Rim');
  const [material, setMaterial] = useState('Acetate');
  const [size, setSize] = useState('M (52-18-145)');

  // Pricing & Stock
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('10');

  // Product Details
  const [description, setDescription] = useState('');
  const [isActiveProduct, setIsActiveProduct] = useState(true);

  // Additional Information
  const [color, setColor] = useState('Black');
  const [weight, setWeight] = useState('');
  const [barcode, setBarcode] = useState('');

  // Image Uploads
  const [images, setImages] = useState<string[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Pick Image from Gallery
  const pickImageFromGallery = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload maximum 5 photos per product.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, camera roll permissions are required to upload product photos!'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setImages((prev) => [...prev, newUri]);
      setSelectedPhotoIndex(images.length);
    }
  };

  // Capture Image with Camera
  const takePhotoWithCamera = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload maximum 5 photos per product.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permissions are required to click product photos!'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setImages((prev) => [...prev, newUri]);
      setSelectedPhotoIndex(images.length);
    }
  };

  // Upload Photo Options Dialog
  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Product Photo',
      'Choose image source:',
      [
        { text: 'Take Photo (Camera)', onPress: takePhotoWithCamera },
        { text: 'Choose from Gallery', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Remove Photo
  const handleRemovePhoto = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (selectedPhotoIndex >= updated.length) {
      setSelectedPhotoIndex(Math.max(0, updated.length - 1));
    }
  };

  // Save Product
  const handleSaveProduct = () => {
    if (!productName.trim()) {
      Alert.alert('Missing Field', 'Please enter the Product Name.');
      return;
    }

    if (!sellingPrice.trim()) {
      Alert.alert('Missing Field', 'Please enter the Selling Price.');
      return;
    }

    const cleanSell = parseFloat(sellingPrice.replace(/,/g, '')) || 0;
    const cleanCost = parseFloat(purchasePrice.replace(/,/g, '')) || 0;
    const cleanStock = parseInt(currentStock.replace(/,/g, ''), 10) || 0;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      code: modelSku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category || 'Frames',
      brand: brand.trim() || 'Generic',
      frameType: frameType || 'Full Rim',
      material: material || 'Acetate',
      price: cleanSell,
      costPrice: cleanCost,
      stock: cleanStock,
      minStockAlert: 5,
      barcode: barcode.trim() || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      description: description.trim(),
      image: images.length > 0 ? images[0] : undefined,
      images: images.length > 0 ? images : undefined,
    };

    opticalStore.addProduct(newProd);

    Alert.alert(
      'Product Saved Successfully',
      `"${productName}" has been added to your inventory.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Top Header (Enlarged & Clear) */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 4 }]}>
        <View style={styles.headerRow}>
          {/* Back Button & Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.4} />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Add New Product</Text>
              <Text style={styles.headerSubtitle}>
                Add frame, sunglasses, lens or accessories to catalog
              </Text>
            </View>
          </View>

          {/* Shop Badge */}
          <View style={styles.shopBadge}>
            <HeaderGlassesLogo />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.shopBadgeTitle}>Shree Ganesh Optical</Text>
              <Text style={styles.shopBadgeSub}>INVENTORY POS</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images Section (Bada & Real Photo Upload) */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenIconSquare}>
              <ImageIcon size={16} color="#FFFFFF" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.sectionTitle}>Product Images & Photos</Text>
              <Text style={styles.sectionSubtitle}>
                Upload clear photos from camera or gallery (Max 5 photos)
              </Text>
            </View>
          </View>

          {/* Big Image Preview If Available */}
          {images.length > 0 ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: images[selectedPhotoIndex] || images[0] }}
                style={styles.bigPreviewImage}
                resizeMode="cover"
              />
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>
                  Photo {selectedPhotoIndex + 1} of {images.length}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.emptyUploadBox}
              onPress={handleUploadPhoto}
              activeOpacity={0.8}
            >
              <View style={styles.uploadIconCircle}>
                <Upload size={24} color="#064E3B" strokeWidth={2.2} />
              </View>
              <Text style={styles.uploadPromptTitle}>Click or Tap to Upload Product Photo</Text>
              <Text style={styles.uploadPromptSub}>Supports Camera click & Gallery selection</Text>
            </TouchableOpacity>
          )}

          {/* Horizontal Photo Thumbnails Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosRow}
          >
            {images.map((imgUri, idx) => (
              <TouchableOpacity
                key={`img-${idx}`}
                style={[
                  styles.photoSlot,
                  selectedPhotoIndex === idx && styles.photoSlotSelected,
                ]}
                onPress={() => setSelectedPhotoIndex(idx)}
                activeOpacity={0.8}
              >
                <TouchableOpacity
                  style={styles.closeBadge}
                  onPress={() => handleRemovePhoto(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={10} color="#FFFFFF" strokeWidth={3} />
                </TouchableOpacity>
                <Image source={{ uri: imgUri }} style={styles.thumbImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}

            {/* Add Photo Button Slot */}
            {images.length < 5 && (
              <TouchableOpacity
                style={styles.addPhotoSlot}
                onPress={handleUploadPhoto}
                activeOpacity={0.8}
              >
                <Camera size={22} color="#064E3B" strokeWidth={2} />
                <Text style={styles.addPhotoText}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Basic Information Form */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenIconSquare}>
              <Glasses size={16} color="#FFFFFF" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <Text style={styles.sectionSubtitle}>Enter essential product details</Text>
            </View>
          </View>

          {/* Product Name */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Product Name *</Text>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="e.g. Ray-Ban Wayfarer Classic"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Category & Brand (2 Columns) */}
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  Alert.alert(
                    'Select Category',
                    'Choose product category:',
                    [
                      { text: 'Frames', onPress: () => setCategory('Frames') },
                      { text: 'Sunglasses', onPress: () => setCategory('Sunglasses') },
                      { text: 'Lenses', onPress: () => setCategory('Lenses') },
                      { text: 'Prescription Lenses', onPress: () => setCategory('Prescription Lenses') },
                      { text: 'Contact Lenses', onPress: () => setCategory('Contact Lenses') },
                      { text: 'Accessories', onPress: () => setCategory('Accessories') },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{category}</Text>
                <ChevronDown size={15} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Brand</Text>
              <TextInput
                style={styles.textInput}
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Ray-Ban, Fastrack"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Model / SKU & Gender */}
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Model / SKU</Text>
              <TextInput
                style={styles.textInput}
                value={modelSku}
                onChangeText={setModelSku}
                placeholder="e.g. RB-2140"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  Alert.alert('Select Gender', 'Target audience:', [
                    { text: 'Unisex', onPress: () => setGender('Unisex') },
                    { text: 'Men', onPress: () => setGender('Men') },
                    { text: 'Women', onPress: () => setGender('Women') },
                    { text: 'Kids', onPress: () => setGender('Kids') },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{gender}</Text>
                <ChevronDown size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Frame Type & Material */}
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Frame Type</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  Alert.alert('Select Frame Type', '', [
                    { text: 'Full Rim', onPress: () => setFrameType('Full Rim') },
                    { text: 'Semi-Rim', onPress: () => setFrameType('Semi-Rim') },
                    { text: 'Rimless', onPress: () => setFrameType('Rimless') },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{frameType}</Text>
                <ChevronDown size={15} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Material</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  Alert.alert('Select Material', '', [
                    { text: 'Acetate', onPress: () => setMaterial('Acetate') },
                    { text: 'TR90', onPress: () => setMaterial('TR90') },
                    { text: 'Titanium', onPress: () => setMaterial('Titanium') },
                    { text: 'Metal', onPress: () => setMaterial('Metal') },
                    { text: 'Plastic', onPress: () => setMaterial('Plastic') },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue}>{material}</Text>
                <ChevronDown size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Size & Color */}
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Frame Size</Text>
              <TextInput
                style={styles.textInput}
                value={size}
                onChangeText={setSize}
                placeholder="e.g. M (52-18-145)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.formHalf}>
              <Text style={styles.inputLabel}>Color</Text>
              <TextInput
                style={styles.textInput}
                value={color}
                onChangeText={setColor}
                placeholder="e.g. Black / Gold"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Pricing & Stock Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenIconSquare}>
              <Coins size={16} color="#FFFFFF" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.sectionTitle}>Pricing & Stock</Text>
              <Text style={styles.sectionSubtitle}>Purchase price, selling rate & inventory</Text>
            </View>
          </View>

          <View style={styles.pricingRow}>
            {/* Purchase Price */}
            <View style={styles.pricingCol}>
              <Text style={styles.inputLabel}>Purchase (₹)</Text>
              <TextInput
                style={styles.textInput}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                placeholder="4,500"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Selling Price */}
            <View style={styles.pricingCol}>
              <Text style={[styles.inputLabel, { color: '#064E3B', fontWeight: '800' }]}>
                Selling Price (₹) *
              </Text>
              <TextInput
                style={[styles.textInput, styles.highlightInput]}
                value={sellingPrice}
                onChangeText={setSellingPrice}
                placeholder="8,500"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Current Stock */}
            <View style={styles.pricingCol}>
              <Text style={styles.inputLabel}>Stock Qty *</Text>
              <TextInput
                style={styles.textInput}
                value={currentStock}
                onChangeText={setCurrentStock}
                placeholder="10"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Additional Details & Barcode */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.greenIconSquare}>
              <FileText size={16} color="#FFFFFF" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.sectionTitle}>Barcode & Description</Text>
              <Text style={styles.sectionSubtitle}>Inventory barcode & product notes</Text>
            </View>
          </View>

          {/* Barcode */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Barcode / Scan Code</Text>
            <View style={styles.barcodeInputBox}>
              <TextInput
                style={styles.barcodeTextInput}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="8901234567890"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => {
                  const gen = `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
                  setBarcode(gen);
                }}
                activeOpacity={0.7}
                style={styles.barcodeBtn}
              >
                <Barcode size={18} color="#064E3B" />
                <Text style={styles.barcodeBtnText}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Description / Notes</Text>
            <TextInput
              style={styles.textareaInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter product details, specifications, warrenty, etc."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Active Product Toggle */}
          <View style={styles.statusToggleRow}>
            <View style={styles.statusTextBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Check size={14} color="#059669" strokeWidth={3} style={{ marginRight: 6 }} />
                <Text style={styles.statusActiveLabel}>Active in POS Catalog</Text>
              </View>
              <Text style={styles.statusSub}>Available for instant sale at billing counter</Text>
            </View>

            <Switch
              value={isActiveProduct}
              onValueChange={setIsActiveProduct}
              trackColor={{ false: '#CBD5E1', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar: Enlarged Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) + 4 }]}>
        <View style={styles.bottomButtonsRow}>
          {/* Cancel / Back */}
          <TouchableOpacity
            style={styles.draftBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.draftBtnText}>Cancel</Text>
          </TouchableOpacity>

          {/* Save Product */}
          <TouchableOpacity
            style={styles.saveProductBtn}
            onPress={handleSaveProduct}
            activeOpacity={0.88}
          >
            <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.saveProductBtnText}>Save Product to Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  /* Top Header */
  header: {
    backgroundColor: '#04281B',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  shopBadgeTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  shopBadgeSub: {
    color: '#A7F3D0',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  /* Scroll Area */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 30,
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  greenIconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Preview Container */
  previewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    marginBottom: 12,
    position: 'relative',
  },
  bigPreviewImage: {
    width: '100%',
    height: '100%',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  /* Empty Upload Box */
  emptyUploadBox: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadPromptTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  uploadPromptSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Photos Row */
  photosRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  photoSlot: {
    width: 78,
    height: 74,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  photoSlotSelected: {
    borderColor: '#064E3B',
    borderWidth: 2,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  closeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  addPhotoSlot: {
    width: 78,
    height: 74,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064E3B',
    marginTop: 4,
  },

  /* Form Elements */
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 13.5,
    color: '#0F172A',
  },
  highlightInput: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    fontWeight: '700',
  },
  dropdownInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },

  /* Pricing Row */
  pricingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pricingCol: {
    flex: 1,
  },

  /* Barcode Box */
  barcodeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    height: 46,
    paddingLeft: 12,
    paddingRight: 6,
  },
  barcodeTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  barcodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  barcodeBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#064E3B',
  },

  /* Description */
  textareaInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 12.5,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* Status Toggle */
  statusToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statusTextBox: {
    flex: 1,
  },
  statusActiveLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* Bottom Sticky Action Bar */
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  draftBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  saveProductBtn: {
    flex: 2,
    backgroundColor: '#064E3B',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveProductBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
