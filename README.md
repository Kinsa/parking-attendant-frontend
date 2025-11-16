# Parking Attendant Frontend

This project demonstrates an end-user interface for the [Parking Attendant Backend project](https://github.com/Kinsa/ParkingAttendantBackend) where a parking attendant would query Vehicle Registration Marks of vehicles parked in a parking lot to assess whether they paid when entering and if they have overstayed their session.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Release Outline

This is a work in progress the current release outline is as follows:

- [x] Initial MVP queries the development server and returns results; a basic UI is established for querying VRMs
- [x] Revise the hierarchy of results so that results older than 2.5x the window are knocked back
- [ ] Move hard-coded URL into an .env config file 
- [ ] Add fields for query from and query to and window and remove the hard-coded initial values; the initial thought for this is to add a button to toggle open a sidebar panel with the advanced controls: "Search from" as a drop-down select menu with a default of 5 hours ago with options for every hour to 12 hours ago (including 1 to 4), then 18, 24, and 72 hours, same for "Search to" field, but it defaults to the current datetime. An alternate format for "Search from" and "Search to" which opens a date picker (possible interaction would be a "Custom" option in each select menu which exposes the picker control which opens the picker itself). "Window" as two numerical fields, one for hours and one for minutes.
