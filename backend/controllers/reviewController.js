const Post = require('../models/Post');
const User = require('../models/User');

// Create Review (Student)
exports.createReview = async (req, res) => {
    const { company_name, role, type, steps, level, tips, comments } = req.body;

    if (!company_name || !type || !steps || !level) {
        return res.status(400).json({ message: 'Required fields missing' });
    }

    try {
        // Fetch user to get name
        const user = await User.findOne({ enrollment: req.user.enrollment });
        const authorName = user ? `${user.first_name} ${user.last_name}` : req.user.enrollment;

        const newPost = new Post({
            company_name,
            role,
            type,
            steps,
            level,
            tips,
            comments,
            author: authorName,
            status: 'pending'
        });

        await newPost.save();
        res.status(201).json({ message: 'Review submitted successfully', post: newPost });
    } catch (err) {
        console.error("Create Review Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update Review (Admin)
exports.updateReview = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review updated', post });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Reviews
exports.getReviews = async (req, res) => {
    const isAdmin = req.query.admin === 'true';
    console.log(`GET /reviews calling. Admin param: ${req.query.admin}, Mode: ${isAdmin ? 'Admin' : 'Public'}`);

    try {
        let query = { status: 'approved' };
        if (isAdmin) {
            query = {}; // Admin sees all
        }

        const posts = await Post.find(query).sort({ created_at: -1 });
        console.log(`Found ${posts.length} reviews.`);
        res.json(posts);
    } catch (err) {
        console.error("GetReviews Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve Review (Admin)
exports.approveReview = async (req, res) => {
    console.log(`Approving Review ID: ${req.params.id}`);
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        if (!post) return res.status(404).json({ message: 'Review not found' });
        console.log("Review Approved");
        res.json({ message: 'Review approved', post });
    } catch (err) {
        console.error("Approve Review Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Review (Admin)
exports.deleteReview = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Like/Unlike Review
exports.likeReview = async (req, res) => {
    try {
        const userId = req.user.enrollment; // Assuming enrollment is the unique identifier in token
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Review not found' });

        // Initialize likedBy if it doesn't exist (for old posts)
        if (!post.likedBy) post.likedBy = [];

        const index = post.likedBy.indexOf(userId);

        if (index === -1) {
            // Not liked yet -> Like it
            post.likedBy.push(userId);
            post.likes = post.likedBy.length;
            await post.save();
            res.json({ message: 'Liked', likes: post.likes, liked: true });
        } else {
            // Already liked -> Unlike it (Toggle behavior)
            post.likedBy.splice(index, 1);
            post.likes = post.likedBy.length;
            await post.save();
            res.json({ message: 'Unliked', likes: post.likes, liked: false });
        }
    } catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
