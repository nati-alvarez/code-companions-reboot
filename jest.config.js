module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    //using a libarary called  jest-css-modules to fix weird error in jest when importing css modules with @/styles path config
    moduleNameMapper: {
        "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
        "^@hooks/(.*)": "<rootDir>/hooks/$1",
        "^@components/(.*)": "<rootDir>/components/$1",
        "^@pages/(.*)": "<rootDir>/pages/$1",
        "^@atoms/(.*)": "<rootDir>/atoms/$1",
        "^@helpers/(.*)": "<rootDir>/helpers/$1",
        "^@models/(.*)": "<rootDir>/models/$1"
    }
};