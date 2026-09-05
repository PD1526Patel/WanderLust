if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('connected to DB');

  // Find listings that have no geometry, or no coordinates set
  const listings = await Listing.find({
    $or: [
      { geometry: { $exists: false } },
      { 'geometry.coordinates': { $exists: false } },
      { 'geometry.coordinates': { $size: 0 } },
    ],
  });

  console.log(`Found ${listings.length} listings missing geometry`);

  for (let listing of listings) {
    try {
      let response = await geoCodingClient
        .forwardGeocode({
          query: `${listing.location}, ${listing.country}`,
          limit: 1,
        })
        .send();

      if (!response.body.features.length) {
        console.log(
          `No geocode result for: ${listing.title} (${listing.location})`,
        );
        continue;
      }

      listing.geometry = response.body.features[0].geometry;
      await listing.save();
      console.log(`Updated: ${listing.title}`);
    } catch (err) {
      console.log(`Failed for ${listing.title}:`, err.message);
    }
  }

  console.log('Done backfilling geometry');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
