import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoanApplicationScreen = ({ navigation }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('6');
  const [employmentStatus, setEmploymentStatus] = useState('employed');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const handleSubmit = () => {
    // Validate and submit loan application
    navigation.navigate('LoanApplicationStatus', {
      amount: loanAmount,
      purpose,
      duration
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>New Loan Application</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Loan Amount (PHP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={loanAmount}
            onChangeText={setLoanAmount}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Loan Purpose</Text>
          <TextInput
            style={styles.input}
            placeholder="Why do you need this loan?"
            value={purpose}
            onChangeText={setPurpose}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Repayment Duration (months)</Text>
          <View style={styles.durationOptions}>
            {['3', '6', '9', '12'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.durationOption,
                  duration === option && styles.durationOptionSelected
                ]}
                onPress={() => setDuration(option)}
              >
                <Text style={[
                  styles.durationOptionText,
                  duration === option && styles.durationOptionTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Employment Status</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setEmploymentStatus('employed')}
            >
              <View style={styles.radioCircle}>
                {employmentStatus === 'employed' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Employed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setEmploymentStatus('self-employed')}
            >
              <View style={styles.radioCircle}>
                {employmentStatus === 'self-employed' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Self-Employed</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Monthly Income (PHP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your monthly income"
            keyboardType="numeric"
            value={monthlyIncome}
            onChangeText={setMonthlyIncome}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!loanAmount || !purpose}
        >
          <Text style={styles.submitButtonText}>Submit Application</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By submitting, you agree to our terms and conditions. Approval is subject to verification.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  durationOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    width: '23%',
    alignItems: 'center',
  },
  durationOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  durationOptionText: {
    color: '#555',
    fontWeight: '500',
  },
  durationOptionTextSelected: {
    color: 'white',
  },
  radioGroup: {
    marginTop: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoanApplicationScreen;