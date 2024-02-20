import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import  * as ImagePicker  from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { submitMaintenanceRequest } from '../../../../../store/houseKeepingSlice'; 
import { AppDispatch } from '../../../../../store/store';
import { RootState } from '../../../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type HosekeepingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const MaintenanceScreen: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<HosekeepingNavigationProp>();

  const handleChoosePhoto = () => {
    const options:any = {
      mediaType: 'photo',
      quality: 1,
    };
    
    ImagePicker?.launchImageLibrary(options, (response:any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        setImage(source);
      }
    });
  };

  const handleSubmit = () => {
    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    // Dispatch the submitMaintenanceRequest action with the form data
    dispatch(submitMaintenanceRequest({
      id: '', // ID will be generated in the async thunk
      userId: user.id,
      roomNumber: user.roomNumber,
      description,
      imageUri: image ? image : '', // Assuming imageUri should be populated with the image state
      notes,
    }))
    .unwrap() // Unwrap the Promise returned by dispatch
    .then(() => {
      Alert.alert('Success', 'Maintenance request submitted');
      navigation.goBack();
    })
    .catch((error) => {
      Alert.alert('Error', 'Failed to submit maintenance request: ' + error.message);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance</Text>
      <Text style={styles.instructions}>
        Please describe the issue and click submit. We aim to resolve issues as soon as possible, usually within 24 hours. If you believe the problem requires urgent attention please click the chat button below. We apologise for any inconvenience caused.
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Description"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Image Upload</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput
        style={[styles.input, styles.notesInput]}
        onChangeText={setNotes}
        value={notes}
        placeholder="Notes"
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MaintenanceScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff', // Weißer Hintergrund für den gesamten Bildschirm
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    instructions: {
      fontSize: 16,
      color: '#333', // Dunkelgrauer Text für die Anweisungen
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 12,
      padding: 10,
      borderRadius: 4,
      backgroundColor: '#f7f7f7', // Leicht grauer Hintergrund für Inputfelder
    },
    notesInput: {
      height: 100, // Höhe für das Notizenfeld
      textAlignVertical: 'top', // Startet den Text von oben
    },
    button: {
      backgroundColor: '#5D5DFF', // Blaue Farbe für den Button
      padding: 15,
      borderRadius: 4,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#fff', // Weißer Text für den Button
      fontWeight: 'bold',
    },
    submitButton: {
      backgroundColor: '#4CAF50', // Grüne Farbe für den Submit-Button
      padding: 15,
      borderRadius: 4,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff', // Weißer Text für den Submit-Button
      fontWeight: 'bold',
      fontSize: 18,
    },
    image: {
      width: '100%', // Vollständige Breite des Containers
      height: 200, // Feste Höhe für das Bild
      resizeMode: 'cover', // Bedeckt den verfügbaren Raum ohne zu verzerren
      marginBottom: 12,
    },
  });
  
 
