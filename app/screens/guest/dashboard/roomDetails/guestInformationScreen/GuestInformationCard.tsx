import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Card from '../../../../../components/Card';
import { RoomStay } from 'app/graphql/schemas/types';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SpaBookingScreenRouteProp = RouteProp<{ params: { roomName: string; companyName: string; checkIn: string; checkOut: string; status: string; notes: string; } }, 'params'>;

const GuestInformationCard: React.FC<RoomStay> = ({ }) => {
    const route = useRoute<SpaBookingScreenRouteProp>();
    const { roomName, companyName, checkIn, checkOut, status, notes } = route.params;

    const activities = [
        { date: "12/04/2021", description: "Proposed to client" },
        { date: "06/05/2021", description: "Transferred to account team" },
        { date: "22/08/2021", description: "Onboard" },
    ];

    const formatDateRange = (checkIn: string, checkOut: string) => {
        return `${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()}`;
    };

    return (
        <>
            <Card style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image
          source={{ uri: 'data:image/jpeg;base64,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' }} // Replace with actual image uri
          style={styles.avatar}
          />
          <View style={styles.headerContent}>
              <Text style={styles.title}>{roomName}</Text>
              <Icon name="check-circle" size={20} color="#4CAF50" />
          </View>
      </View>
      <Text style={styles.subtitle}>{companyName}</Text>
      <Text style={styles.subtitle}>{notes}</Text>
      <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Check-In/Check-Out</Text>
              <Text style={styles.infoContent}>{formatDateRange(checkIn, checkOut)}</Text>
          </View>
          <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoContent}>{status}</Text>
          </View>
      </View>
  </Card>

  {/* New Candidate Brief Section */}
  <Card style={styles.card}>
      <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notizen</Text>
          <Text style={styles.profileSummary}>{notes}</Text>
          <Text style={styles.sectionTitle}>Working history</Text>
          <Text style={styles.content}>{companyName}</Text>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.content}>SMU - Singapore Management University</Text>
          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.content}>{checkIn}</Text>
          <Text style={styles.sectionTitle}>Activities</Text>
          {activities.map((activity, index) => (
              <View key={index} style={styles.activityRow}>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
              </View>
          ))}
      </View>
  </Card>
</>
);
};

const styles = StyleSheet.create({
card: {
borderRadius: 8,
margin: 10,
padding: 16,
elevation: 1,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 2,
backgroundColor: '#fff',
},
headerContainer: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 16,
},
avatar: {
width: 48,
height: 48,
borderRadius: 24,
borderWidth: 2,
borderColor: '#000',
marginRight: 8,
},
headerContent: {
flex: 1,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
title: {
fontSize: 18,
fontWeight: 'bold',
color: '#000',
flexShrink: 1,
},
subtitle: {
fontSize: 16,
color: '#666',
},
infoContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
paddingLeft: 8,
paddingTop: 8,
},
infoSection: {
flex: 1,
},
infoLabel: {
fontSize: 12,
color: '#888',
textTransform: 'uppercase',
fontWeight: 'bold',
},
infoContent: {
fontSize: 14,
fontWeight: 'bold',
color: '#000',
marginTop: 2,
},
section: {
paddingTop: 0,
},
sectionHeader: {
fontWeight: 'bold',
fontSize: 16,
marginBottom: 4,
},
profileSummary: {
fontSize: 14,
color: '#333',
marginBottom: 12,
},
sectionTitle: {
fontWeight: 'bold',
fontSize: 14,
marginTop: 8,
marginBottom: 2,
},
content: {
fontSize: 14,
color: '#333',
marginBottom: 4,
},
activityRow: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 4,
},
activityDate: {
fontSize: 12,
marginRight: 8,
},
activityDescription: {
fontSize: 14,
color: '#333',
},
});

export default GuestInformationCard;