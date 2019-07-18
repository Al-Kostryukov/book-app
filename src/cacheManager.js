const cache = new Map(); // later can be replaces by Redis or smth else

const cacheManager = {
    get: function(key) {
        return cache.get(key);
    },
    invalidate: function() {
        cache.clear();
    },
    set: function(key, value) {
        cache.set(key, value);
    }
};

module.exports = cacheManager;