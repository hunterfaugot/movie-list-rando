// jest.setup.js

import '@testing-library/jest-dom';

// Mock Firebase functions
jest.mock('firebase/app', () => {
    return {
        initializeApp: jest.fn(),
    };
});

jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => {
            return {
                onAuthStateChanged: jest.fn((callback) => {
                    callback(null); // Simulate a null user to test unauthenticated state
                }),
                currentUser: {
                    uid: '123',
                    email: 'test@example.com',
                },
            };
        }),
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn(),
    };
});

jest.mock('firebase/firestore', () => {
    return {
        getFirestore: jest.fn(() => ({})),
        collection: jest.fn(),
        getDocs: jest.fn(),
        query: jest.fn(),
        orderBy: jest.fn(),
        addDoc: jest.fn(),
    };
});

jest.mock('react-firebase-hooks/auth', () => ({
    useAuthState: jest.fn(() => [null]), // Simulate no authenticated user
}));
