const reviewService = require('../services/reviewService');

const createReview = async (req, res) => {
    try {
        const reviewData = req.body;
        const review = await reviewService.createReview(reviewData);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReview
};
