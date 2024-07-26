// jest.setup.js

// Import custom matchers from jest-dom
import '@testing-library/jest-dom';

// Mock Firebase functions
jest.mock('firebase/app', () => {
    const originalModule = jest.requireActual('firebase/app');
    return {
        ...originalModule,
        initializeApp: jest.fn(() => {
            console.log('Mock initializeApp called');
        }),
    };
});

jest.mock('firebase/auth', () => {
    const originalModule = jest.requireActual('firebase/auth');
    return {
        ...originalModule,
        getAuth: jest.fn(() => {
            console.log('Mock getAuth called');
            return {
                onAuthStateChanged: jest.fn((callback) => {
                    console.log('Mock onAuthStateChanged called');
                    callback(null); // Simulate a null user to test unauthenticated state
                }),
            };
        }),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    };
});

jest.mock('firebase/firestore', () => {
    const originalModule = jest.requireActual('firebase/firestore');
    return {
        ...originalModule,
        getFirestore: jest.fn(() => {
            console.log('Mock getFirestore called');
            return {};
        }),
    };
});

jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn(() => [null]), // Simulate no authenticated user
}));
