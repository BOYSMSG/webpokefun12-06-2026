const mongoose = require('mongoose');
const uri = "mongodb://pokefunsmp_db_user:2YP1AzwM6MnE5pCu@ac-gj7dthj-shard-00-00.hcja1t9.mongodb.net:27017,ac-gj7dthj-shard-00-01.hcja1t9.mongodb.net:27017,ac-gj7dthj-shard-00-02.hcja1t9.mongodb.net:27017/?ssl=true&replicaSet=atlas-xtbc9x-shard-0&authSource=admin&appName=Pokefunuser";
mongoose.connect(uri).then(async () => {
  const posts = await mongoose.connection.collection('posts').find({ type: 'REEL' }).toArray();
  for(let p of posts) {
    console.log(`Reel ${p._id}: ${p.media} (Type: ${p.mediaType})`);
  }
  console.log("Done");
  process.exit(0);
});
