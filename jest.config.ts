// filename: jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }],
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'], // Add 'mjs'

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Load Testing Library config

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Optional: alias @ to /src
    'react-router-dom': '<rootDir>/node_modules/react-router-dom/dist/index.mjs', // Use .mjs
  },

  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],

  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$', // Default CRA pattern
  ],
};

export default config;