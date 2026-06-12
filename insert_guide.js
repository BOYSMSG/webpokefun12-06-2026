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
    
    // Check if Post model exists or we need to define it here
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
    
    // Check if the guide already exists
    const existingGuide = await Post.findOne({ title: "How to Create an Image Link for Posts" });
    if (existingGuide) {
      console.log("Guide already exists.");
      process.exit(0);
    }
    
    const guideContent = `Welcome to the Pokefun Community!
If you want to share a screenshot or video of your base, you will need a direct image link.

**How to get an Image Link:**
1. **Using Discord:** Upload your image to any Discord channel (or a private DM). Right-click the image and select "Copy Image Address" or "Copy Media Link".
2. **Using ImgBB:** Go to https://imgbb.com/, upload your image, and copy the "Direct Link".
3. **Using Imgur:** Upload to Imgur, hover over the image, right-click and select "Copy image address".

Paste that link into the "Media URL" box when creating a post!
If you have a YouTube video, just paste the standard YouTube link and it will automatically embed.`;

    await Post.create({
      authorId: 'boysmsg832@gmail.com', // Setting as the Admin email
      type: 'GUIDE',
      category: 'Guides',
      title: 'How to Create an Image Link for Posts',
      content: guideContent,
      media: 'https://i.ibb.co/6Fh8Y3y/example-guide.png', // Just a placeholder or general image
      mediaType: 'image',
      likes: [],
      dislikes: [],
      views: 0,
      impressions: 0
    });
    
    console.log("Guide inserted successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
