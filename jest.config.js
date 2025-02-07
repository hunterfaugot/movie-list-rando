module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
