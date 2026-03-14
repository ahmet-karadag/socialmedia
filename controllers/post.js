
const Post = require('../model/post');


exports.createPost = async (req,res) => {
    try {
        const savedPost = await Post.createPost({
            ... req.body,
            authorId: req.user.id
        });
       res.status(201).json({
        message: 'Post created successfully',
        post: savedPost
       });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const Post = require('../model/post'); 
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
            
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};