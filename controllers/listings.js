const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const categories = require('../utils/categories.js');
const mapToken = process.env.MAP_TOKEN;
console.log('MAP TOKEN: ', mapToken);

const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  const filter = {};

  if (category && categories.some((c) => c.key === category)) {
    filter.category = category;
  }

  if (q && q.trim() !== '') {
    const searchRegex = new RegExp(q.trim(), 'i'); // Case-insensitive matching

    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
    ];
  }

  const allListings = await Listing.find(filter);
  res.render('listings/index.ejs', {
    allListings,
    categories,
    activeCategory: filter.category || null,
    searchQuery: q || '',
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs', { categories });
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist');
    return res.redirect('/listings');
  }
  console.log(listing);

  res.render('listings/show.ejs', { listing, categories });
};

module.exports.createListing = async (req, res) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash('success', 'New Listing Created');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist');
    return res.redirect('/listings');
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250');
  res.render('listings/edit.ejs', { listing, originalImageUrl, categories });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let existingListing = await Listing.findById(id);
  if (!existingListing) {
    req.flash('error', 'Listing you requested for does not exist');
    return res.redirect('/listings');
  }

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  const locationChanged =
    existingListing.location !== req.body.listing.location;

  if (locationChanged) {
    let response = await geoCodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    listing.geometry = response.body.features[0].geometry;
  }

  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();

  req.flash('success', 'Listing Updated');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Listing Deleted!');
  res.redirect('/listings');
};
