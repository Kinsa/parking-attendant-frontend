# Parking Attendant Frontend

This project demonstrates a GUI interface for querying vehicle entries into a parking lot and assessing whether they have overstayed their session. It is running at [`https://parking.kinsacreative.com/`](https://parking.kinsacreative.com/) and queries the [backend](https://github.com/Kinsa/ParkingAttendantBackend).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The design is a proof-of-concept prototype validating that the ordering of results from the backend (which allows that the plate may be stored partially in the database due to a bad OCR capture) is usable in the real world. This UI can be used to validate all the scenarios described in the [Postman workspace](https://kinsacreative-9361599.postman.co/workspace/Kinsa-Creative's-Workspace~0b9e49cf-f915-49e3-833c-f71cae8edbe0/collection/49907170-7408272b-c732-468f-8f25-6613326e2065?action=share&creator=49907170) which are generally built around the idea that the user is a traffic warden managing a lot with a 2-hour parking window, where clients pay when they enter and their Vehicle Registration Mark (VRM) is captured via OCR and stored in a database along with the time and date.

In the UI, results older than 2.5x that window (or 5 hours) are faded back by default to give prominence to less exact matches that may be newer.

While any of [the plates from the fixture](https://github.com/Kinsa/ParkingAttendantBackend?tab=readme-ov-file#production-fixture-data) can be searched, the search input prompts you to try `MA16 GXX` which specifically addresses the use case described above. 

> As a traffic warden managing a lot with a 2-hour parking window, where clients pay when they enter. I manually entered a VRM mark into the system to verify whether the vehicle's session has expired.  
> Unbeknownst to me, the driver entered at an odd angle in poor lighting, and the camera captured only a partial view.
> The system uses wildcard matching to look up partial values. The response includes the VRM value captured for manual verification.
> The response shows a match for: '16 GX' at 20:41:00. I can see the exact vehicle entered the lot at 15:49. Since the next most likely match also has a '6 G' but the numbers and letters immediately before and after aren't anywhere close to '1' or 'X' I can be reasonably sure this is my car and ticket it.
> The API is a bit confusing in its response ordering. The older exact match is returned above the newer partial. The UI resolves this by noticing that it has been at least 5 hours since the exact match and deprecates it visually while looping through the output.   

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

## Deployment

Deployment is handled by a GitHub action which refers to 3 repository secrets:

- `SSH_HOST` - the IP address or domain name to use when connecting to rsync files
- `SSH_USERNAME` - username to use when connecting to rsync files
- `SSH_PRIVATE_KEY` - entire contents of the deployment private key (get value by running: `cat ~/.ssh/github_deploy_key | pbcopy`; the public key must exist in the `~/.ssh/authorized_keys` dir on the server for the user whose username is being used in the step above)

During deployment, the `NEXT_PUBLIC_API_URL` is set by the deployment script prior to building. Locally, during development, that variable is set in `.env.local`. 

## Release Outline

This is a work in progress the current release outline is as follows:

- [x] Initial MVP queries the development server and returns results; a basic UI is established for querying VRMs
- [x] Revise the hierarchy of results so that results older than 2.5x the window are knocked back
- [x] Move hard-coded URL into an .env config file 
- [ ] Add fields for query from and query to and window: Add a button to toggle open a sidebar panel with the advanced controls: "Search from" as a drop-down select menu with a default of 5 hours ago with options for every hour to 12 hours ago (including 1 to 4), then 18, 24, and 72 hours, same for "Search to" field, but it defaults to the current datetime. An alternate format for "Search from" and "Search to" which opens a date picker (possible interaction would be a "Custom" option in each select menu which exposes the picker control which opens the picker itself). "Window" as two numerical fields, one for hours and one for minutes.
