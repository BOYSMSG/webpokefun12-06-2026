const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=');
  if (key && value) {
    let val = value.trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key.trim()] = val;
  }
});

mongoose.connect(env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    const postSchema = new mongoose.Schema({
      authorId: String,
      type: String,
      category: String,
      title: String,
      content: String,
      media: String,
      mediaType: String,
      likes: [String],
      dislikes: [String],
      views: Number,
      impressions: Number,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
    
    const guidesToInsert = [
      {
        title: "Community Guide: How to Upload Videos",
        content: "If you want to share a video of your gameplay or builds, it's very easy!\n\n1. **YouTube Videos:** If you have uploaded your video to YouTube, simply copy the video URL (e.g. youtube.com/watch?v=...) and paste it into the 'Media URL' box when creating a post. It will automatically embed!\n\n2. **Direct MP4/WebM:** If you have a raw video file, upload it to Discord, right-click the video, and select 'Copy Media Link'. Paste that link into the Media URL box.",
        category: "Guides"
      },
      {
        title: "DM Guide: How to Send Direct Messages",
        content: "You can privately chat with anyone on the server directly through the website!\n\n**How to start a DM:**\n1. Click on any player's name or avatar to view their Profile.\n2. Click the blue 'Message' button.\n3. Type your message and hit send!\n\nYou can also click the 'Messages' icon in the top right to view all your recent conversations, search for players, and manage your chats. Click the 'X' button to close an active chat.",
        category: "Guides"
      }
    ];

    for (const guide of guidesToInsert) {
      const existing = await Post.findOne({ title: guide.title });
      if (!existing) {
        await Post.create({
          authorId: 'boysmsg832@gmail.com', // Admin email
          type: 'GUIDE',
          category: guide.category,
          title: guide.title,
          content: guide.content,
          // Explicitly omit media for text-only posts
          media: null,
          mediaType: null,
          likes: [],
          dislikes: [],
          views: 0,
          impressions: 0
        });
        console.log("Inserted:", guide.title);
      } else {
        console.log("Already exists:", guide.title);
      }
    }
    
    // Also update the existing image guide to remove its media if requested
    await Post.updateOne(
      { title: 'How to Create an Image Link for Posts' },
      { $set: { media: null, mediaType: null } }
    );
    console.log("Removed image from the previous guide.");
    
    console.log("Done!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
