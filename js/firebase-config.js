/**
 * Firebase Configuration
 * ParryApplications Portfolio Website
 */

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDGO2gcR3NM7Cdpc7hf4RRfPreACTRAO24",
    authDomain: "parryapplications2026.firebaseapp.com",
    databaseURL: "https://parryapplications2026-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parryapplications2026",
    storageBucket: "parryapplications2026.firebasestorage.app",
    messagingSenderId: "950893818082",
    appId: "1:950893818082:web:bfb6bc9dbe2adcc3d3eebb",
    measurementId: "G-QZVLG32030"
};

// Initialize Firebase
let app, database, analytics;

function initializeFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        analytics = firebase.analytics();
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        return false;
    }
}

// Form submission handler
function submitContactForm(formData, formType = 'Contact') {
    return new Promise((resolve, reject) => {
        try {
            const contactRef = database.ref().child(formType);
            const newContactRef = contactRef.push();
            
            // Add timestamp
            const today = new Date();
            const dateString = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
            
            formData.DateOfSubmission = dateString;
            formData.Timestamp = firebase.database.ServerValue.TIMESTAMP;
            
            newContactRef.set(formData)
                .then(() => {
                    console.log('Form submitted successfully');
                    resolve({ success: true, message: 'Form submitted successfully!' });
                })
                .catch((error) => {
                    console.error('Error submitting form:', error);
                    reject({ success: false, message: 'Error submitting form. Please try again.' });
                });
        } catch (error) {
            console.error('Error in submitContactForm:', error);
            reject({ success: false, message: 'An error occurred. Please try again.' });
        }
    });
}

// Check if tutor vacancy is available
// Returns true if vacancy is available, false if not available (or null if not set)
function checkTutorVacancy() {
    return new Promise((resolve, reject) => {
        database.ref('BecomeATutor').once('value')
            .then((snapshot) => {
                const vacancyStatus = snapshot.val();
                // If the value is explicitly false, vacancy is not available
                // If null or undefined, default to true (show the section)
                const isAvailable = vacancyStatus !== false;
                resolve(isAvailable);
            })
            .catch((error) => {
                console.error('Error checking vacancy:', error);
                // On error, default to showing the section
                resolve(true);
            });
    });
}

// Fetch data from Firebase (for dynamic content)
function fetchFirebaseData(path) {
    return new Promise((resolve, reject) => {
        database.ref(path).once('value')
            .then((snapshot) => {
                const data = [];
                snapshot.forEach((childSnapshot) => {
                    data.push({
                        key: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                resolve(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                reject(error);
            });
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFirebase,
        submitContactForm,
        checkTutorVacancy,
        fetchFirebaseData
    };
}
