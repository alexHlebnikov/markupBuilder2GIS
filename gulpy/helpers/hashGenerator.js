// Generator for build version name. It just uses current Date.
generatedHash = '';

var hashGenerator = {
    generateHash: function() {
        generatedHash = Math.random().toString(36).substring(7);
        this.newHash = generatedHash;
    },

    newHash: generatedHash
}

module.exports = hashGenerator;