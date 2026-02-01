import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewCard from '../../components/ReviewCard';
import { getApiUrl } from '../../utils/apiConfig';

const Home = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(getApiUrl('/reviews'));
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return <div className="flex justify-center p-10 text-vgec-blue font-medium">Loading placement insights...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-vgec-blue mb-3 font-serif">
                    Placement Archives
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Read interview experiences and placement preparation strategies from VGEC students.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-xl font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
