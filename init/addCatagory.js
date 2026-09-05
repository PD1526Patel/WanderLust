if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const categories = require('../utils/categories.js').map((c) => c.key);

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('connected to DB');

  // Find listings that have no category set
  const listings = await Listing.find({
    $or: [
      { category: { $exists: false } },
      { category: null },
      { category: '' },
    ],
  });

  console.log(`Found ${listings.length} listings missing a category`);

  for (let listing of listings) {
    listing.category =
      categories[Math.floor(Math.random() * categories.length)];
    await listing.save();
    console.log(`Updated: ${listing.title} -> ${listing.category}`);
  }

  console.log('Done backfilling categories');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
