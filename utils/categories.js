// Single source of truth for listing categories.
// key   -> stored in DB / used in query params
// label -> shown to the user
// icon  -> FontAwesome classes used on the filter bar
module.exports = [
  { key: 'trending', label: 'Trending', icon: 'fa-solid fa-fire' },
  { key: 'rooms', label: 'Rooms', icon: 'fa-solid fa-bed' },
  {
    key: 'iconic-cities',
    label: 'Iconic Cities',
    icon: 'fa-solid fa-mountain-city',
  },
  { key: 'mountains', label: 'Mountains', icon: 'fa-solid fa-mountain' },
  { key: 'castles', label: 'Castles', icon: 'fa-brands fa-fort-awesome' },
  {
    key: 'pools',
    label: 'Amazing Pools',
    icon: 'fa-solid fa-person-swimming',
  },
  { key: 'camping', label: 'Camping', icon: 'fa-solid fa-campground' },
  { key: 'farms', label: 'Farms', icon: 'fa-solid fa-cow' },
  { key: 'arctic', label: 'Arctic', icon: 'fa-regular fa-snowflake' },
  { key: 'domes', label: 'Domes', icon: 'fa-solid fa-igloo' },
  { key: 'boats', label: 'Boats', icon: 'fa-solid fa-ship' },
];
