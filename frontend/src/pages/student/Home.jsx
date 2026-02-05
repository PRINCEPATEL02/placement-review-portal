import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import ReviewCard from '../../components/ReviewCard';
import { getApiUrl } from '../../utils/apiConfig';

const Home = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const res = await axios.get(getApiUrl('/reviews'), config);
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const filteredReviews = reviews.filter((review) => {
        const query = searchQuery.toLowerCase();

        // Date formatting for search
        const dateStr = new Date(review.created_at || review.date_time).toLocaleDateString("en-IN", {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        }).toLowerCase();

        return (
            review.company_name?.toLowerCase().includes(query) ||
            review.role?.toLowerCase().includes(query) ||
            review.type?.toLowerCase().includes(query) ||
            review.level?.toLowerCase().includes(query) ||
            (review.author && review.author.toLowerCase().includes(query)) ||
            (review.enrollment && review.enrollment.toLowerCase().includes(query)) ||
            dateStr.includes(query)
        );
    });

    if (loading) return <div className="flex justify-center p-10 text-vgec-blue font-medium">Loading placement insights...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-vgec-blue mb-3 font-serif">
                    Placement Archives
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
                    Read interview experiences and placement preparation strategies from VGEC students.
                </p>

                {/* Universal Search Filter */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-vgec-blue transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-vgec-blue transition-all shadow-sm group-hover:shadow-md"
                        placeholder="Search by company, name, enrollment, or date..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No reviews found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>

            {reviews.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-xl font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
