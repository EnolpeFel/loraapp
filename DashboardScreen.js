import React, { useState, useEffect } from 'react';
import { 
  Dimensions, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreditScoreModal, setShowCreditScoreModal] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Payment Received', 
      message: 'Your payment of Php 5,250.00 has been processed', 
      time: '2 hours ago', 
      read: false 
    },
    { 
      id: 2, 
      title: 'Loan Approved', 
      message: 'Your loan application has been approved', 
      time: '1 day ago', 
      read: true 
    },
  ]);

  // Credit score data
  const creditScore = 720;
  const creditScoreStatus = "GOOD";
  const maxLoanAmount = "Php 500,000.00";
  const creditScoreMessage = "Your credit score is in good standing. You're eligible for our best loan rates and terms.";

  // Update current date time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      };
      setCurrentDateTime(now.toLocaleString('en-US', options).toUpperCase());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigation.navigate('Welcome');
  };

  const handleNotificationPress = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    );
    setNotifications(updatedNotifications);
    setHasUnreadNotifications(updatedNotifications.some(n => !n.read));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    setHasUnreadNotifications(false);
  };

  if (showProfile) {
    return (
      <ProfileScreen 
        onBack={() => setShowProfile(false)} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('C:/Users/user/my-expo-app/assets/LoraLogo.png')} 
            style={styles.logo}
          />
          <Text style={styles.appName}>Lora</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => setShowNotifications(true)}
        >
          <MaterialIcons name="notifications" size={24} color="#374151" />
          {hasUnreadNotifications && (
            <View style={styles.notificationDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowNotifications(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity onPress={markAllAsRead}>
                <Text style={styles.markAllText}>Mark all as read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <MaterialIcons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.notificationsList}>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <TouchableOpacity 
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification
                  ]}
                  onPress={() => handleNotificationPress(notification.id)}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyNotifications}>
                <MaterialIcons name="notifications-off" size={40} color="#9CA3AF" />
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Credit Score Modal */}
<Modal
  visible={showCreditScoreModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowCreditScoreModal(false)}
>
  <View style={styles.centeredView}>
    <View style={styles.creditScoreModal}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => setShowCreditScoreModal(false)}
      >
        <MaterialIcons name="close" size={24} color="#6B7280" />
      </TouchableOpacity>
      
      <Text style={styles.creditScoreModalTitle}>Your Credit Status</Text>
      
      {/* Round Meter */}
      <View style={styles.roundMeterContainer}>
        <View style={styles.roundMeterOuter}>
          <View style={[
            styles.roundMeter,
            { transform: [{ rotate: `${-135 + (creditScore / 850) * 270}deg`}] }
          ]}>
            <View style={styles.roundMeterPointer} />
          </View>
        </View>
        
        <View style={styles.roundMeterCenter}>
          <Text style={styles.roundMeterScore}>{creditScore}</Text>
          <Text style={[
            styles.roundMeterStatus,
            creditScoreStatus === 'GOOD' && { color: '#10B981' },
            creditScoreStatus === 'EXCELLENT' && { color: '#3B82F6' },
            creditScoreStatus === 'FAIR' && { color: '#F59E0B' },
            creditScoreStatus === 'POOR' && { color: '#EF4444' },
          ]}>
            {creditScoreStatus}
          </Text>
        </View>
        
        <View style={styles.roundMeterLabels}>
          <Text style={styles.roundMeterLabel}>300</Text>
          <Text style={styles.roundMeterLabel}>850</Text>
        </View>
      </View>
      
      <View style={styles.creditScoreInfo}>
        <Text style={styles.creditScoreMessage}>{creditScoreMessage}</Text>
        
        <View style={styles.creditScoreDetail}>
          <Text style={styles.creditScoreDetailLabel}>Maximum Loan Amount:</Text>
          <Text style={styles.creditScoreDetailValue}>{maxLoanAmount}</Text>
        </View>
        
        <View style={styles.creditScoreDetail}>
          <Text style={styles.creditScoreDetailLabel}>Interest Rate:</Text>
          <Text style={styles.creditScoreDetailValue}>8.5% per annum</Text>
        </View>
        
        <View style={styles.creditScoreDetail}>
          <Text style={styles.creditScoreDetailLabel}>Loan Term:</Text>
          <Text style={styles.creditScoreDetailValue}>Up to 36 months</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.applyLoanButton}
        onPress={() => {
          setShowCreditScoreModal(false);
          navigation.navigate('LoanApplication');
        }}
      >
        <Text style={styles.applyLoanButtonText}>Apply for Loan</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Grand Total Card */}
        <View style={styles.grandTotalCard}>
          <Text style={styles.grandTotalLabel}>Grand Total Pending Amount</Text>
          <Text style={styles.grandTotalAmount}>Php 582,001.50</Text>
          <Text style={styles.grandTotalDate}>AS OF {currentDateTime}</Text>
        </View>

        {/* Cards Row */}
        <View style={styles.row}>
          {/* Current Loan */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('CurrentLoan')}
          >
            <Text style={styles.cardTitle}>Current Loan</Text>
            <Text style={styles.cardValue}>Php 150,000.00</Text>
          </TouchableOpacity>

          {/* Next Payment */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Next Payment Due</Text>
            <Text style={styles.dueDate}>Aug 5, 2025</Text>
            <Text style={styles.dueAmount}>Php 5,250.00</Text>
          </View>
        </View>

        {/* Second Cards Row */}
        <View style={styles.row}>
          {/* Pay Now */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Payment')}
          >
            <Text style={styles.cardTitle}>Pay Now</Text>
            <View style={styles.payButton}>
              <Text style={styles.payButtonText}>PAY</Text>
            </View>
          </TouchableOpacity>

          {/* Credit Score */}
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setShowCreditScoreModal(true)}
          >
            <Text style={styles.cardTitle}>Credit Score</Text>
            <View style={styles.creditScoreContainer}>
              <Text style={styles.creditScore}>720</Text>
              <Text style={styles.creditScoreLabel}>GOOD</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Loan Application */}
        <View style={styles.loanApplicationCard}>
          <Text style={styles.loanTitle}>Need Loan?</Text>
          <Text style={styles.loanText}>
            Get approved in minutes with our quick application process
          </Text>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => navigation.navigate('LoanApplication')}
          >
            <Text style={styles.applyButtonText}>+ Apply for a loan</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionList}>
          <TransactionItem 
            type="Payment" 
            amount="5,250.00" 
            date="Jul 5, 2023" 
            status="Completed"
          />
          <TransactionItem 
            type="Loan Disbursement" 
            amount="150,000.00" 
            date="Jun 15, 2023" 
            status="Completed"
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🏠</Text>
          </View>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Loans')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>💵</Text>
          </View>
          <Text style={styles.navText}>Loans</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Transactions')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>📊</Text>
          </View>
          <Text style={styles.navText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setShowProfile(true)}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>👤</Text>
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const TransactionItem = ({ type, amount, date, status }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionIconText}>
          {type === 'Payment' ? '💸' : '🏦'}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{type}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={styles.transactionAmount}>Php {amount}</Text>
        <Text style={[
          styles.transactionStatus,
          status === 'Completed' ? styles.statusCompleted : styles.statusPending
        ]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

const ProfileScreen = ({ onBack, onLogout }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    memberSince: '',
    accountStatus: '',
    phoneNumber: '',
    address: '',
    profileImage: null
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }}></View>
      </View>

      <ScrollView contentContainerStyle={styles.profileContent}>
        <View style={styles.avatarContainer}>
          {profileData.profileImage ? (
            <Image
              source={{ uri: profileData.profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.emptyAvatar]}>
              <MaterialIcons name="person" size={40} color="#9CA3AF" />
            </View>
          )}
          <Text style={styles.name}>
            {profileData.name || 'No name provided'}
          </Text>
          <Text style={styles.email}>
            {profileData.email || 'No email provided'}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>
              {profileData.memberSince || 'Not available'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Account Status</Text>
            <Text style={[styles.detailValue, styles.activeStatus]}>
              {profileData.accountStatus || 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>
              {profileData.phoneNumber || 'Not provided'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>
              {profileData.address || 'Not provided'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {}}
        >
          <Text style={styles.settingsButtonText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
    marginLeft: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationButton: {
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  grandTotalCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  grandTotalLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  grandTotalAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  grandTotalDate: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: (width - 40) / 2,
    elevation: 1,
  },
  cardTitle: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 4,
  },
  payButton: {
    backgroundColor: '#EDE9FE',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  creditScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  creditScoreLabel: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  loanApplicationCard: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  loanTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loanText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginVertical: 8,
  },
  applyButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: '#F97316',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllText: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  transactionList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  statusCompleted: {
    color: '#10B981',
  },
  statusPending: {
    color: '#F59E0B',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navIcon: {
    marginBottom: 4,
  },
  navIconText: {
    fontSize: 20,
  },
  navText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  navTextActive: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '500',
  },
  profileContent: {
    padding: 20,
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  emptyAvatar: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  activeStatus: {
    color: '#10B981',
  },
  settingsButton: {
    backgroundColor: '#E5E7EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  // Notification Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAllText: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  notificationsList: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginLeft: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
 // Credit Score Modal Styles
centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
creditScoreModal: {
  width: '90%',
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
closeButton: {
  alignSelf: 'flex-end',
  marginBottom: 10,
},
creditScoreModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#1F2937',
},
roundMeterContainer: {
  width: 180,
  height: 110,
  marginBottom: 20,
  position: 'relative',
},
roundMeterOuter: {
  width: 180,
  height: 90,
  borderTopLeftRadius: 90,
  borderTopRightRadius: 90,
  borderWidth: 12,
  borderColor: '#E5E7EB',
  borderBottomWidth: 0,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
},
roundMeter: {
  position: 'absolute',
  top: 0,
  left: 0,
  width: 180,
  height: 180,
  borderRadius: 90,
  borderWidth: 12,
  borderColor: 'transparent',
  borderBottomColor: '#8B5CF6',
  borderLeftColor: '#8B5CF6',
  transformOrigin: 'bottom center',
},
roundMeterPointer: {
  position: 'absolute',
  bottom: '50%',
  left: '50%',
  width: 2,
  height: 25,
  backgroundColor: '#8B5CF6',
  transform: [{ translateX: -1 }],
},
roundMeterCenter: {
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: [{ translateX: -40 }],
  width: 80,
  alignItems: 'center',
},
roundMeterScore: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#1F2937',
},
roundMeterStatus: {
  fontSize: 14,
  fontWeight: '600',
  marginTop: 2,
},
roundMeterLabels: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 15,
},
roundMeterLabel: {
  fontSize: 12,
  color: '#6B7280',
},
creditScoreInfo: {
  width: '100%',
  marginBottom: 20,
},
creditScoreMessage: {
  fontSize: 14,
  color: '#4B5563',
  textAlign: 'center',
  marginBottom: 15,
  lineHeight: 20,
},
creditScoreDetail: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#F3F4F6',
},
creditScoreDetailLabel: {
  fontSize: 14,
  color: '#6B7280',
},
creditScoreDetailValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1F2937',
},
applyLoanButton: {
  backgroundColor: '#8B5CF6',
  padding: 12,
  borderRadius: 8,
  width: '100%',
  alignItems: 'center',
},
applyLoanButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
});

export default DashboardScreen;