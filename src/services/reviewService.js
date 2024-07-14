const Review = require('../models/Review');

const createReview = async (reviewData) => {
    try {
        const review = new Review(reviewData);
        await review.save();
        return review;
    } catch (error) {
        throw new Error('Error creating review: ' + error.message);
    }
};

module.exports = {
    createReview
};
