import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SpaBookingScreenRouteProp = RouteProp<{ params: { roomName: string; companyName: string; checkIn: string; checkOut: string; status: string; notes: string; } }, 'params'>;

const GuestInformationCard: React.FC = () => {
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
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub7i7li7OKf9SdCEc-YKUVrvTH_FGYQgjNRJxj7riwokoXB30b-9yMkv0_XYqwGCAAwc&usqp=CAU' }} // Replace with actual image uri
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
            </View>

            <View style={styles.card}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Notizen</Text>
                    <Text style={styles.profileSummary}>{notes}</Text>
                    <Text style={styles.sectionTitle}>Arbeitsverlauf</Text>
                    <Text style={styles.content}>{companyName}</Text>
                    <Text style={styles.sectionTitle}>Bildung</Text>
                    <Text style={styles.content}>SMU - Singapore Management University</Text>
                    <Text style={styles.sectionTitle}>Verfügbarkeit</Text>
                    <Text style={styles.content}>{checkIn}</Text>
                    <Text style={styles.sectionTitle}>Aktivitäten</Text>
                    {activities.map((activity, index) => (
                        <View key={index} style={styles.activityRow}>
                            <Text style={styles.activityDate}>{activity.date}</Text>
                            <Text style={styles.activityDescription}>{activity.description}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        padding: 10,
    },
    card: {
        borderRadius: 12,
        margin: 10,
        padding: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#5A67D8',
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
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
        color: '#333',
        marginTop: 2,
    },
    section: {
        paddingTop: 0,
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#5A67D8',
        marginBottom: 4,
    },
    profileSummary: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    activityDate: {
        fontSize: 12,
        color: '#888',
        marginRight: 8,
    },
    activityDescription: {
        fontSize: 14,
        color: '#333',
    },
});

export default GuestInformationCard;
