const axios = require('axios');

// Fast2SMS Configuration
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// Send SMS using Fast2SMS
const sendSMS = async (phoneNumber, message) => {
  try {
    // Fast2SMS API endpoint
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'v3',
        sender_id: 'TXTIND', // Default sender ID
        message: message,
        language: 'english',
        flash: 0,
        numbers: phoneNumber
      },
      {
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ SMS sent successfully to', phoneNumber);
    console.log('Response:', response.data);

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ SMS Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

// Send Absence Notification to Parent
const sendAbsenceNotification = async (studentName, contactNumber, date, instituteName) => {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const message = `Dear Parent, Your child ${studentName} is absent from ${instituteName} today (${formattedDate}). Please contact us for any queries.`;
  
  console.log('📱 Sending absence SMS to:', contactNumber);
  return await sendSMS(contactNumber, message);
};

// Test SMS function (for debugging)
const sendTestSMS = async (phoneNumber) => {
  const message = `Test SMS from Tuition Management System. Your system is working correctly!`;
  return await sendSMS(phoneNumber, message);
};

module.exports = { 
  sendSMS, 
  sendAbsenceNotification,
  sendTestSMS 
};