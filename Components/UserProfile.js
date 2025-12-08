// Components/UserProfile.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGO = require('../assets/Logo.png');

const PALETTE = {
  bg: '#080C1F',
  card: '#11152E',
  border: '#1C2142',
  accent: '#FF8A3C',
  accentSoft: '#FFB23C',
  text: '#F2F4FF',
  dim: '#8B90B2',
};

const STORAGE_KEY = '@winway_user_profile';

export default function UserProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const profile = JSON.parse(data);
        if (profile.imageUri) {
          setProfileImage({ uri: profile.imageUri });
        }
        if (profile.userName) {
          setUserName(profile.userName);
        }
      }
    } catch (e) {
      console.warn('UserProfile: load error', e);
    }
  };

  const saveProfile = async (imageUri, name) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          imageUri,
          userName: name || '',
        })
      );
    } catch (e) {
      console.warn('UserProfile: save error', e);
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        console.warn('ImagePicker Error: ', response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setProfileImage({ uri: imageUri });
        saveProfile(imageUri, userName);
        setShowImagePicker(false);
      }
    });
  };

  const handleNameSave = () => {
    saveProfile(profileImage?.uri, userName);
    setShowNameInput(false);
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Pressable
        onPress={() => setShowImagePicker(true)}
        style={({ pressed }) => [
          styles.imageContainer,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Image
          source={profileImage || LOGO}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.editBadge}>
          <Text style={styles.editText}>Edit</Text>
        </View>
      </Pressable>

      {/* Name Input Button */}
      <Pressable
        onPress={() => setShowNameInput(true)}
        style={({ pressed }) => [
          styles.nameButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.nameButtonText}>
          {userName || 'Enter your name'}
        </Text>
      </Pressable>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.modalContent}>
            <Pressable
              style={styles.modalOption}
              onPress={handleImagePicker}
            >
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </Pressable>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setProfileImage(null);
                saveProfile(null, userName);
                setShowImagePicker(false);
              }}
            >
              <Text style={styles.modalOptionText}>Remove Photo</Text>
            </Pressable>
            <Pressable
              style={[styles.modalOption, styles.modalCancel]}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Name Input Modal */}
      <Modal
        visible={showNameInput}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNameInput(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNameInput(false)}
        >
          <Pressable
            style={styles.nameModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.nameModalTitle}>Enter your name</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Your name"
              placeholderTextColor="rgba(139,144,178,0.7)"
              value={userName}
              onChangeText={setUserName}
              autoFocus={true}
            />
            <View style={styles.nameModalButtons}>
              <Pressable
                style={[styles.nameModalButton, styles.nameModalButtonCancel]}
                onPress={() => setShowNameInput(false)}
              >
                <Text style={styles.nameModalButtonCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.nameModalButton, styles.nameModalButtonSave]}
                onPress={handleNameSave}
              >
                <Text style={styles.nameModalButtonSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PALETTE.accent,
    backgroundColor: 'rgba(17,21,46,0.9)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PALETTE.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: PALETTE.bg,
  },
  editText: {
    color: PALETTE.bg,
    fontSize: 11,
    fontWeight: '600',
  },
  nameButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,138,60,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,138,60,0.5)',
    minWidth: 150,
    alignItems: 'center',
  },
  nameButtonText: {
    color: PALETTE.accentSoft,
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: PALETTE.card,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  modalCancel: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  modalOptionText: {
    color: PALETTE.text,
    fontSize: 16,
    textAlign: 'center',
  },
  modalCancelText: {
    color: PALETTE.dim,
    fontSize: 16,
    textAlign: 'center',
  },
  nameModalContent: {
    backgroundColor: PALETTE.card,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  nameModalTitle: {
    color: PALETTE.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  nameInput: {
    backgroundColor: 'rgba(8,12,31,0.9)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(28,33,66,0.9)',
    color: PALETTE.text,
    fontSize: 16,
    marginBottom: 16,
  },
  nameModalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  nameModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nameModalButtonCancel: {
    backgroundColor: 'rgba(28,33,66,0.9)',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  nameModalButtonSave: {
    backgroundColor: PALETTE.accent,
  },
  nameModalButtonCancelText: {
    color: PALETTE.dim,
    fontSize: 15,
    fontWeight: '600',
  },
  nameModalButtonSaveText: {
    color: PALETTE.bg,
    fontSize: 15,
    fontWeight: '600',
  },
});

