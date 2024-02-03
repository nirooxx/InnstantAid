import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ImageSourcePropType, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ReservationDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ScheduleScreen"
>;

type ScreenName = keyof RootStackParamList;

type FeatureProps = {
  title: string;
  iconName: string; // Assuming you're using local or network images
};

// Define a type for the tile data
type TileData = {
  title: string;
  image: ImageSourcePropType;
  screen: ScreenName; 
};

// Sample data for the tiles
const tiles: TileData[] = [
  { title: 'Scheduling', image: require('../../../assets/images/avatar.png'), screen: 'ScheduleScreen'  },
  { title: 'Notifications', image: require('../../../assets/images/avatar.png'), screen: 'TaskListScreen' },
  { title: 'Fast setup', image: require('../../../assets/images/avatar.png'), screen: 'ScheduleScreen' },
  { title: 'Search', image: require('../../../assets/images/avatar.png'), screen: 'ScheduleScreen' },
];




const Feature: React.FC<FeatureProps> = ({ title, iconName }) => (
  <View style={styles.featureCard}>
    <Image source={{ uri: iconName }} style={styles.featureIcon} />
    <Text style={styles.featureText}>{title}</Text>
  </View>
);

const EmployeeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ReservationDetailNavigationProp>();

  const openScheduleScreen = () => {
    navigation.navigate("ScheduleScreen"); // Navigate to ScheduleScreen
  };

  const FeatureTile: React.FC<{ tile: TileData }> = ({ tile }) => {
    // Use the specific navigation prop type for the ScheduleScreen
  console.log(tile)
    return (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => navigation.navigate(tile.screen)} // TypeScript knows tile.screen is a valid screen name
      >
        <ImageBackground source={tile.image} style={styles.imageBackground}>
          <Text style={styles.tileText}>{tile.title}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  
  // Section component
  const SectionFour: React.FC = () => {
    return (
      <View style={styles.container}>
        {tiles.map((tile, index) => (
          <FeatureTile key={index} tile={tile} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
    {/* Section 1: Image Background Covering Only One Section */}
    <ImageBackground 
      source={{ uri: 'https://img.freepik.com/free-vector/hand-drawn-doodle-icons-set_1308-90706.jpg?size=626&ext=jpg&ga=GA1.1.1431687763.1706920305&semt=ais' }} 
      resizeMode="cover" 
      style={styles.imageBackgroundSection}
    >
      <Text style={styles.headerText}>Farmers find qualified substitutes</Text>
      <Text style={styles.subHeaderText}>Modern, fresh and easy to use. Designed for administrators.</Text>
      <TouchableOpacity onPress={openScheduleScreen} style={styles.getTheAppButton}>
        <Text style={styles.buttonText}>Get the app</Text>
      </TouchableOpacity>
    </ImageBackground>

    {/* Section 2: Black Background */}
    <View style={styles.blackBackgroundSection}>
    

      <View style={styles.featuresGrid}>
        <SectionFour  />
        {/* ... Other features */}
      </View>

      <Text style={styles.sectionTitle}>Why use Agrishare?</Text>
      <Text style={styles.sectionSubtitle}>It's fast, flexible, and designed for administrators.</Text>
      {/* Section 3: Feature Cards with Black Background */}
      <View style={styles.featuresGrid}>
        <Feature title="Easy to use" iconName="icon_easy_to_use" />
        <Feature title="Flexible" iconName="icon_flexible" />
        <Feature title="Qualified" iconName="icon_qualified" />
        <Feature title="Secure" iconName="icon_secure" />
        {/* ... Other features */}
      </View>

      
    </View>

    {/* Footer */}
    <Text style={styles.footerText}>© 2022 AgriShare, Inc.</Text>
  </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'black', // If you want the scrollview itself to have a background color
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  imageBackgroundSection: {
    padding: 20,
    height: 300, // Adjust as necessary for your design
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60, // Adjust top margin to position the text appropriately
  },
  subHeaderText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10, // Space above and below the subtitle
  },
  getTheAppButton: {
    backgroundColor: '#4CAF50', // Example button color
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  blackBackgroundSection: {
    padding: 20,
    paddingBottom: 30, // Give extra space at the bottom of this section
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10, // Space between title and subtitle
  },
  sectionSubtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20, // Space between subtitle and feature grid
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    padding: 15,
    borderRadius: 10,
    width: '48%', // Two columns in the grid
    marginBottom: 10,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  featureIcon: {
    width: 50, // Adjust the size of your icons
    height: 50, // Adjust the size of your icons
    marginBottom: 8, // Space between icon and text
  },
  featureText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    paddingBottom: 20, // Space at the bottom of the screen
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Additional styles for other elements if needed
});


export default EmployeeDashboardScreen;
