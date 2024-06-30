import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Linking } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SpaBookingScreenRouteProp = RouteProp<{ params: { roomName: string; companyName: string; checkIn: string; checkOut: string; status: string; notes: string; telephone?: string; email?: string; street?: string; zipcode?: string; city?: string; country?: string; totalAmount?: number; openAmount?: number; category?: string; standardOccupancy?: number; maxOccupancy?: number; mealNotes?: string; maidNotes?: string; selfcheckout_enabled?: boolean; selfcheckout_url?: string; } }, 'params'>;

const GuestInformationCard: React.FC = () => {
    const route = useRoute<SpaBookingScreenRouteProp>();
    const { roomName, companyName, checkIn, checkOut, status, notes, telephone, email, street, zipcode, city, country, totalAmount, openAmount, category, standardOccupancy, maxOccupancy, mealNotes, maidNotes, selfcheckout_enabled, selfcheckout_url } = route.params;

    const formatDateRange = (checkIn: string, checkOut: string) => {
        return `${new Date(checkIn).toLocaleDateString('de-DE')} 15:00 Uhr - ${new Date(checkOut).toLocaleDateString('de-DE')} 10:00 Uhr`;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub7i7li7OKf9SdCEc-YKUVrvTH_FGYQgjNRJxj7riwokoXB30b-9yMkv0_XYqwGCAAwc&usqp=CAU' }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>{roomName}</Text>
                        <Icon name="check-circle" size={20} color="#4CAF50" />
                    </View>
                </View>
                <Text style={styles.subtitle}>{companyName}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.infoContainer}>
               
                            <Text style={styles.sectionHeader}>Check-In/Check-Out</Text>
                            <Text style={styles.profileSummary}>{formatDateRange(checkIn, checkOut)}</Text>
                     
                    </View>
                    <View style={styles.infoContainer}>
                  
                            <Text style={styles.sectionHeader}>Status</Text>
                            <Text style={styles.profileSummary}>{status}</Text>
                    
                </View>
                <View style={styles.infoContainer}>
                  
                            <Text style={styles.sectionHeader}>Telefon</Text>
                            <Text style={styles.profileSummary}>{telephone}</Text>
                   
                    </View>
                    <View style={styles.infoContainer}>
                  
                            <Text style={styles.sectionHeader}>E-Mail</Text>
                            <Text style={styles.profileSummary}>{email}</Text>
                     
                </View>
                <View style={styles.infoContainer}>
                   
                            <Text style={styles.sectionHeader}>Adresse</Text>
                            <Text style={styles.profileSummary}>{street}, {zipcode} {city}, {country}</Text>
                      
                </View>
                <View style={styles.infoContainer}>
                  
                            <Text style={styles.sectionHeader}>Gesamtbetrag</Text>
                            <Text style={styles.profileSummary}>{Number(totalAmount)?.toFixed(2).replace('.', ',') || 'Keine Angaben'} €</Text>
                   
                    </View>
                    <View style={styles.infoContainer}>
                      
                            <Text style={styles.sectionHeader}>Offener Betrag</Text>
                            <Text style={styles.profileSummary}>{Number(openAmount)?.toFixed(2).replace('.', ',') || 'Keine Angaben'} €</Text>
                    
                </View>
                <View style={styles.infoContainer}>
                    
                            <Text style={styles.sectionHeader}>Zimmerkategorie</Text>
                            <Text style={styles.profileSummary}>{category}</Text>
                     
                    </View>
                    <View style={styles.infoContainer}>
                    
                            <Text style={styles.sectionHeader}>Belegung</Text>
                            <Text style={styles.profileSummary}>Standard: {standardOccupancy}, Maximal: {maxOccupancy}</Text>
                  
                </View>
                <View style={styles.infoContainer}>
              
                            <Text style={styles.sectionHeader}>Mahlzeiten-Notizen</Text>
                            <Text style={styles.profileSummary}>{mealNotes}</Text>
                       
                    </View>
                    <View style={styles.infoContainer}>
                       
                            <Text style={styles.sectionHeader}>Reinigungs-Notizen</Text>
                            <Text style={styles.profileSummary}>{maidNotes}</Text>
                   
                </View>
                {selfcheckout_enabled && (
                    <View style={styles.infoContainer}>
                    
                            <Text style={styles.sectionHeader}>Self-Checkout</Text>
                            <Text style={[styles.profileSummary, styles.link]} onPress={() => Linking.openURL(selfcheckout_url || '')}>Hier klicken</Text>
                
                    </View>
                )}
                <Text style={styles.sectionHeader}>Notizen</Text>
                <Text style={styles.profileSummary}>{notes}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    subtitle: {
        fontSize: 16,
        color: '#4A5568',
        marginBottom: 16,
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTextContainer: {
        marginLeft: 8,
        flex: 1,
    },
    infoLabel: {
        fontSize: 16,
        color: '#4A5568',
    },
    infoContent: {
        fontSize: 16,
        color: '#2D3748',
    },
    link: {
        color: '#5A67D8',
        textDecorationLine: 'underline',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 8,
    },
    profileSummary: {
        fontSize: 16,
        color: '#4A5568',
    },
});

export default GuestInformationCard;
