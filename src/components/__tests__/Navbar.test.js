// src/components/__tests__/Navbar.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';

jest.mock('../../utils/firebase', () => {
    return {
        auth: {
            onAuthStateChanged: jest.fn(),
        },
        db: {},
    };
});

describe('Navbar', () => {
    test('renders Home link', () => {
        render(<Navbar />);
        const linkElement = screen.getByText(/Home/i);
        expect(linkElement).toBeInTheDocument();
    });

    test('renders Login and Signup links when no user is authenticated', () => {
        render(<Navbar />);
        const loginLink = screen.getByText(/Login/i);
        const signupLink = screen.getByText(/Signup/i);
        expect(loginLink).toBeInTheDocument();
        expect(signupLink).toBeInTheDocument();
    });
});
