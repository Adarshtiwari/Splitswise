const blacklist = new Set();
const BLACKLIST_MAX_SIZE = 200; // Maximum size before clearing

const addToBlacklist = (token) => {
    if (blacklist.size >= BLACKLIST_MAX_SIZE) {
        blacklist.clear(); // Clear the blacklist if it exceeds the maximum size
        console.log('Blacklist cleared after reaching the maximum size');
    }
    blacklist.add(token);
};

const isBlacklisted = (token) => {
    return blacklist.has(token);
};

const getBlacklistSize = () => {
    return blacklist.size;
};

module.exports = {
    addToBlacklist,
    isBlacklisted,
    getBlacklistSize
};
