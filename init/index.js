if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const categories = require('../utils/categories.js').map((c) => c.key);
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('connected to DB');
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithExtras = [];

  for (let obj of initData.data) {
    let geometry = { type: 'Point', coordinates: [0, 0] }; // fallback

    try {
      let response = await geoCodingClient
        .forwardGeocode({
          query: `${obj.location}, ${obj.country}`,
          limit: 1,
        })
        .send();

      if (response.body.features.length) {
        geometry = response.body.features[0].geometry;
      } else {
        console.log(`No geocode result for: ${obj.title} (${obj.location})`);
      }
    } catch (err) {
      console.log(`Geocode failed for ${obj.title}:`, err.message);
    }

    listingsWithExtras.push({
      ...obj,
      owner: '6a8d8d3ec3fa99fa772a743d',
      category: categories[Math.floor(Math.random() * categories.length)],
      geometry,
    });
  }

  await Listing.insertMany(listingsWithExtras);
  console.log(`Inserted ${listingsWithExtras.length} listings`);
};

main()
  .then(initDB)
  .then(() => {
    console.log('data was initialized');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
