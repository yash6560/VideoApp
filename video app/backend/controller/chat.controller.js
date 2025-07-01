const streamClient = require('../lib/stream');

const getStreamToken = async (req, res) => {
    try {
        const token = await streamClient.createToken(req.user._id.toString());
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating Stream token:', error);
        return res.status(500).json({ error: 'Failed to generate Stream token' });
    }
}

module.exports = {getStreamToken};