const mongoose = require('mongoose');
const uri = "mongodb://pokefunsmp_db_user:2YP1AzwM6MnE5pCu@ac-gj7dthj-shard-00-00.hcja1t9.mongodb.net:27017,ac-gj7dthj-shard-00-01.hcja1t9.mongodb.net:27017,ac-gj7dthj-shard-00-02.hcja1t9.mongodb.net:27017/?ssl=true&replicaSet=atlas-xtbc9x-shard-0&authSource=admin&appName=Pokefunuser";
mongoose.connect(uri).then(async () => {
  const posts = await mongoose.connection.collection('posts').find({ type: 'REEL' }).toArray();
  for(let p of posts) {
    if (p.media && p.media.includes('instagram.com/')) {
      console.log(`Checking ${p._id} with media ${p.media} and type ${p.mediaType}`);
      let newMedia = p.media;
      if (p.media.includes('instagram.com/p/') && !p.media.includes('embed')) {
        const instaId = p.media.split('instagram.com/p/')[1].split('/')[0];
        newMedia = `https://www.instagram.com/p/${instaId}/embed`;
      } else if (p.media.includes('instagram.com/reel/') && !p.media.includes('embed')) {
        const instaId = p.media.split('instagram.com/reel/')[1].split('/')[0];
        newMedia = `https://www.instagram.com/reel/${instaId}/embed`;
      }
      if (p.mediaType !== 'instagram' || newMedia !== p.media) {
        console.log(`Fixing ${p._id} to ${newMedia}`);
        await mongoose.connection.collection('posts').updateOne({ _id: p._id }, { $set: { mediaType: 'instagram', media: newMedia } });
      }
    }
  }
  console.log("Done");
  process.exit(0);
});
