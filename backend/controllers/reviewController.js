const Post = require('../models/Post');
const User = require('../models/User');
const Login = require('../models/Login');

// Create Review (Student)
// Create Review (Student)
exports.createReview = async (req, res) => {
    const { company_name, role, type, steps, level, tips, comments } = req.body;

    if (!company_name || !type || !steps || !level) {
        return res.status(400).json({ message: 'Required fields missing' });
    }

    try {
        // Fetch user to get name
        const user = await User.findOne({ enrollment: req.user.enrollment });

        let createby = req.user.enrollment; // Default to enrollment number
        if (user && user.first_name && user.last_name) {
            createby = `${user.first_name} ${user.last_name}`;
        }

        const newPost = new Post({
            company_name,
            role,
            type,
            steps,
            level,
            tips,
            comments,
            author: createby, // Fixed: Schema field is 'author', not 'createdby'
            enrollment: req.user.enrollment, // Save enrollment
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

    try {
        let query = { status: 'approved' };
        if (isAdmin) {
            query = {};
        }

        // Optimize: Select only needed fields to reduce payload size
        const posts = await Post.find(query)
            .select('company_name role type level steps views likes created_at enrollment status author')
            .sort({ created_at: -1 })
            .lean();

        // Dynamically populate author names
        const enrollments = [...new Set(posts.map(p => p.enrollment).filter(Boolean))];

        if (enrollments.length > 0) {
            const users = await User.find({ enrollment: { $in: enrollments } })
                .select('enrollment first_name last_name')
                .lean();

            const userMap = users.reduce((acc, u) => {
                acc[u.enrollment] = `${u.first_name} ${u.last_name}`;
                return acc;
            }, {});

            posts.forEach(post => {
                if (post.enrollment && userMap[post.enrollment]) {
                    post.author = userMap[post.enrollment];
                }
            });
        }

        res.json(posts);
    } catch (err) {
        console.error("GetReviews Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve Review (Admin)
// Approve Review (Admin)
// Approve Review (Admin)
exports.approveReview = async (req, res) => {
    console.log(`Approving Review ID: ${req.params.id}`);
    console.log('User requesting approval:', req.user);

    try {
        let approvedByName = 'Admin';

        if (req.user && req.user.enrollment) {
            // Fetch Admin User Profile to get Name
            const adminUser = await User.findOne({ enrollment: req.user.enrollment });

            if (adminUser && adminUser.first_name && adminUser.last_name) {
                approvedByName = `${adminUser.first_name} ${adminUser.last_name}`;
            } else {
                approvedByName = req.user.enrollment;
            }
        }

        const post = await Post.findByIdAndUpdate(req.params.id, {
            status: 'approved',
            approved_by_email: approvedByName
        }, { new: true });

        if (!post) return res.status(404).json({ message: 'Review not found' });

        console.log("Review Approved by:", approvedByName);
        res.json({ message: 'Review approved', post });
    } catch (err) {
        console.error("Approve Review Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
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

// Get My Reviews (Student)
exports.getMyReviews = async (req, res) => {
    try {
        const posts = await Post.find({ enrollment: req.user.enrollment }).sort({ created_at: -1 });
        res.json(posts);
    } catch (err) {
        console.error("Get My Reviews Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete My Review (Student)
exports.deleteMyReview = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, enrollment: req.user.enrollment });

        if (!post) {
            return res.status(404).json({ message: 'Review not found or you are not authorized to delete this review' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error("Delete My Review Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
