# DU Vibes

Build a Delhi University Student Music Website
Create a highly polished, immersive, modern music-discovery website designed specifically for Delhi University (DU) students.
Use the first uploaded image as the primary visual/UI reference for the overall composition, layout, typography placement, music-player presentation, counters, and visual atmosphere.
Use the second uploaded image as the initial website background. Do not simply copy the screenshot; recreate the same overall experience and visual hierarchy as a functional, interactive website.
The website should feel like a trending music platform built around DU student culture, combining music discovery, college identity, playlists, and atmospheric visuals.
---
1. Overall Visual Design
Create a full-screen, immersive music interface.
Background
- Use the second uploaded image as the default background.
- The background should cover the entire viewport.
- Add a subtle dark/transparent gradient overlay where necessary so text and controls remain readable.
- Preserve the important visual elements of the background.
- The website should feel cinematic and atmospheric.
- Add subtle animations such as slow background movement, grain, glow, or parallax, but keep them elegant rather than excessive.
Reference Image
The first uploaded image should be treated as the UI/experience reference.
Recreate its general visual structure:
- Minimal interface
- Large visual background
- Music information layered over the background
- Listening count
- Support option
- Central currently-playing section
- Bottom navigation
- Playlist/music discovery functionality
Do NOT create a pixel-for-pixel copy. Build an original interface inspired by the reference.
---
2. Top-Left Section
At the top-left, display a small live status area similar to the reference.
Example:
8:39 PM • 500 listening
The listening number should be dynamic.
For example:
- 487 listening
- 512 listening
- 1.2K listening
The number can fluctuate slightly to create the feeling of a live student music platform.
Also include a small:
Support us
button at the top-right.
---
3. Central Music Experience
The centre of the screen should be the main focus.
Display:
Currently Playing
- Song artwork
- Song title
- Artist name
- Play/pause button
- Progress bar
- Current time / total duration
- Previous/next controls
- Volume control
- Like/favourite button
The currently playing section should visually blend into the background rather than looking like a traditional rectangular music player.
Create a subtle animated music visualizer around or behind the player whenever a song is playing.
For example:
- Animated waveform
- Equalizer bars
- Soft pulsing glow
- Audio-reactive visual elements
When the song is paused, the animation should stop.
---
4. Student-Culture Messaging
In the central area, include a small contextual message that can change dynamically.
Examples:
"What are Delhi University students listening to?"
"The DU campus is listening right now."
"Music for every DU mood."
"What's playing across campus?"
The message should change occasionally or depending on the selected college/category.
---
5. Bottom Navigation
Create a sleek bottom navigation system inspired by the reference image.
The navigation should contain three major sections:
LEFT — Categories
A Music Categories section.
Categories could include:
- Hip-Hop
- Bollywood
- Indie
- Punjabi
- Lo-Fi
- Rap
- R&B
- Pop
- Rock
- Electronic
- Classical
- Ghazal
- Trending
- Study
- Late Night
- Chill
When the user clicks Categories, open an elegant expandable panel/drawer containing all available categories.
---
6. Category → Playlist System
When the user selects a category such as:
Hip-Hop
open a dedicated playlist view.
For example:
Hip-Hop
Trending Hip-Hop among DU students
Display a list of songs:
1. Song Name — Artist
2. Song Name — Artist
3. Song Name — Artist
4. Song Name — Artist
5. Song Name — Artist
Each song should have:
- Artwork
- Song title
- Artist
- Duration
- Play button
- Add-to-playlist/favourite option
Clicking a song should immediately load it into the main music player.
The background should remain visible behind the playlist with a translucent/glass interface.
---
7. MIDDLE — Current Playlist / Song
The middle/bottom area should show the currently selected song and playlist information.
Example:
Now Playing
Song Name
Artist Name
Playlist: DU Trending
Include:
- Previous
- Play/Pause
- Next
- Progress
- Shuffle
- Repeat
Make the controls minimal and elegant.
---
8. RIGHT — COLLEGE SECTION
Create a prominent COLLEGES option on the bottom-right.
When clicked, open a college-selection interface.
Display colleges such as:
- SRCC
- Hindu College
- Hansraj College
- St. Stephen's College
- Ramjas College
- Miranda House
- Lady Shri Ram College
- Sri Venkateswara College
- Kirori Mal College
- Shaheed Sukhdev College of Business Studies
- Jesus and Mary College
- Gargi College
- Delhi University
- Add more colleges
The college list should be searchable.
---
9. Dynamic College Background System
This is one of the most important features.
Each college should have its own background image.
For example:
SRCC → SRCC background image
Hindu → Hindu College background image
Hansraj → Hansraj background image
DU → University of Delhi background image
The website should allow the administrator/developer to upload or replace these images later.
When a user selects a college:
1. The current background smoothly fades out.
2. The selected college's background fades in.
3. The college name changes.
4. The playlists/content can optionally change according to that college.
5. The interface remains in the same position.
6. The transition should feel cinematic.
Example:
SRCC selected
→ SRCC campus image appears
→ Header changes to "SRCC"
→ SRCC-specific playlists can appear
→ Student listening count can update.
Do not reload the entire website. Make this a smooth client-side transition.
---
10. College-Specific Music Experience
Each college should be capable of having its own music data.
For example:
SRCC
- SRCC Trending
- SRCC Late Night
- SRCC Hip-Hop
- SRCC Bollywood
Hindu
- Hindu Trending
- Hindu Indie
- Hindu Rap
Hansraj
- Hansraj Trending
- Hansraj Chill
This data should be structured so that more colleges and playlists can easily be added later.
---
11. Playlist Section
Create a dedicated playlist system.
Users should be able to browse:
Trending
College Playlists
Categories
Recently Played
Popular This Week
Each playlist should display:
- Cover image
- Playlist name
- Short description
- Number of songs
- Play button
Example:
DU After Hours
"The songs DU students are playing after midnight."
DU Trending 2026
"The most played tracks across campus."
SRCC Vibes
"Songs currently dominating SRCC."
---
12. Music Player Functionality
The website should be a functional music player rather than just a visual mockup.
Implement:
- Play
- Pause
- Next
- Previous
- Seek/progress
- Volume
- Mute
- Shuffle
- Repeat
- Playlist queue
- Recently played
- Favourite songs
When a user clicks a song anywhere on the website, it should automatically become the currently playing song.
The music player should remain accessible while navigating between playlists and categories.
Use user-provided/licensed audio files or placeholder audio assets during development rather than embedding copyrighted music without permission.
---
13. Search
Add a global search function.
Users should be able to search:
- Songs
- Artists
- Playlists
- Colleges
- Categories
Example:
Search:
"Arijit"
→ show matching songs.
Search:
"SRCC"
→ show SRCC playlists.
Search:
"Hip-Hop"
→ show Hip-Hop category and playlists.
---
14. Upload / Admin-Friendly Structure
Design the data architecture so I can later upload:
College backgrounds
- College name
- Background image
- Logo/image
Songs
- Song title
- Artist
- Audio file
- Cover artwork
- Category
- College
- Playlist
Playlists
- Playlist name
- Description
- Cover image
- Songs
I should be able to add new colleges, songs, categories and playlists without redesigning the frontend.
If possible, create a simple data structure/database schema that makes this easy.
---
15. Responsive Design
The website must work beautifully on:
- Mobile
- Tablet
- Laptop
- Desktop
On mobile:
- Keep the immersive background.
- Convert bottom navigation into a mobile-friendly navigation system.
- Make the music player easy to operate with one hand.
- College and category menus should open as bottom sheets or full-screen overlays.
- Do not allow important controls to overlap.
On desktop:
- Use the full cinematic layout.
---
16. Animations
Use subtle premium animations:
- Background crossfade when changing college
- Smooth playlist opening
- Music visualizer animation
- Hover effects
- Button micro-interactions
- Song transition animation
- Glass-panel animations
- Fade/slide transitions
Avoid excessive animations.
The overall experience should feel premium, youthful and culturally relevant to DU students.
---
17. Visual Style
Use a combination of:
- Cinematic photography
- Warm campus imagery
- Dark translucent overlays
- Glassmorphism where appropriate
- Clean modern typography
- Subtle shadows
- Soft gradients
- Minimal icons
The UI should not look like a generic Spotify clone.
It should have its own identity:
"The Music Platform of Delhi University."
---
18. Suggested Homepage Layout
The final homepage should approximately follow this hierarchy:
┌──────────────────────────────────────────────────────────┐
│  8:39 PM • 500 listening                    Support us    │
│                                                          │
│                                                          │
│                    [COLLEGE / DU]                        │
│                                                          │
│              What's DU listening to?                     │
│                                                          │
│                 [Album Artwork]                          │
│                                                          │
│                 Song Name                                │
│                 Artist Name                              │
│                                                          │
│            ────────●──────────                           │
│             ◀     ▶     ▶                                │
│                                                          │
│                                                          │
│  CATEGORIES          NOW PLAYING              COLLEGES   │
│                                                          │
└──────────────────────────────────────────────────────────┘
The actual design should be more visually sophisticated than this wireframe.
---
19. Important Interaction Flow
Flow 1 — Listen to a song
Homepage
→ Click Categories
→ Select Hip-Hop
→ Hip-Hop playlist opens
→ Click song
→ Song starts playing
→ Main player updates
Flow 2 — Change college
Homepage
→ Click Colleges
→ Select SRCC
→ Background smoothly changes to SRCC image
→ SRCC becomes the active college
→ SRCC playlists become available
Flow 3 — Browse playlist
Homepage
→ Open Playlists
→ Select "DU Trending"
→ Playlist opens
→ Select song
→ Song begins playing
---
20. Technical Requirements
Build this as a real functional web application, not a static design.
Recommended stack:
- React / Next.js
- Tailwind CSS
- JavaScript/TypeScript
- HTML5 Audio API for music playback
- Framer Motion or equivalent for animations
- A simple backend/database structure for songs, playlists and colleges
Keep the architecture modular so that I can later connect a database such as Supabase/Firebase or another backend.
Create reusable components for:
- MusicPlayer
- BackgroundManager
- CollegeSelector
- CategorySelector
- PlaylistPanel
- SongList
- Search
- Navigation
- AudioVisualizer
---
21. Final Product Goal
The final result should feel like a real product rather than a college project.
The concept is:
"A music platform built around Delhi University culture."
The user opens the website and immediately sees a beautiful DU-related environment.
They can:
Choose their college → discover what students are listening to → choose a category → open playlists → play songs → switch colleges → experience a different visual environment.
Make the experience immersive, modern, interactive, fast, responsive and visually impressive, while keeping the UI clean and easy to understand.
Use the two uploaded images as follows:
Image 1 = UI/experience reference
Image 2 = initial/default Delhi University background
The architecture must allow me to upload additional college background images later and assign each image to its respective college.IMPORTANT: COLLEGE AND CATEGORY STRUCTURE
The college selector and music categories must be completely separate systems.
COLLEGE SELECTOR
The college section should ONLY control the visual identity/background of the website.
Available colleges can include:
- Delhi University
- SRCC
- Hindu College
- Hansraj College
- Ramjas College
- Miranda House
- LSR
- Kirori Mal College
- Venky
- Other DU colleges
When the user selects a college:
- Change the background image to the image associated with that college.
- Change the displayed college name if applicable.
- Smoothly transition between the background images.
- Do NOT change the playlists.
- Do NOT change the music categories.
- Do NOT create college-specific playlists.
- Do NOT create college-specific categories.
- Do NOT create options such as "SRCC Hip-Hop", "SRCC Trending", "Hindu Hip-Hop", etc.
The college selection is essentially a background/visual theme selector.
---
COMMON MUSIC CATEGORIES
Music categories must remain exactly the same regardless of which college is selected.
For example:
- Hip-Hop
- Trending
- Bollywood
- Punjabi
- Lo-Fi
- Rap
- Indie
- R&B
- Pop
- Rock
- Chill
- Study
- Ghazal
- Classical
These categories are GLOBAL and are not connected to individual colleges.
For example:
SRCC selected
Background → SRCC image
Categories:
Hip-Hop | Trending | Bollywood | Punjabi | Lo-Fi | Rap | Indie
Hindu College selected
Background → Hindu image
Categories:
Hip-Hop | Trending | Bollywood | Punjabi | Lo-Fi | Rap | Indie
Hansraj selected
Background → Hansraj image
Categories:
Hip-Hop | Trending | Bollywood | Punjabi | Lo-Fi | Rap | Indie
The category interface and playlists remain identical.
---
CATEGORY → PLAYLIST
When the user clicks a category such as Hip-Hop, open the global Hip-Hop playlist.
The playlist is NOT associated with a college.
For example:
COLLEGE
   ↓
SRCC
   ↓
Background changes to SRCC
   ↓
Categories remain unchanged
   ↓
HIP-HOP
   ↓
Global Hip-Hop Playlist
If the user switches to Hindu College:
COLLEGE
   ↓
Hindu College
   ↓
Background changes to Hindu College
   ↓
Categories remain unchanged
   ↓
HIP-HOP
   ↓
THE SAME Global Hip-Hop Playlist
There must be only ONE global Hip-Hop category/playlist unless I explicitly create another playlist in the future.
---
DATA ARCHITECTURE
Keep these two data systems separate.
Colleges
const colleges = [
  {
    id: "du",
    name: "Delhi University",
    background: "/backgrounds/du.jpg"
  },
  {
    id: "srcc",
    name: "SRCC",
    background: "/backgrounds/srcc.jpg"
  },
  {
    id: "hindu",
    name: "Hindu College",
    background: "/backgrounds/hindu.jpg"
  },
  {
    id: "hansraj",
    name: "Hansraj College",
    background: "/backgrounds/hansraj.jpg"
  }
];
Categories / Playlists
const categories = [
  {
    id: "hiphop",
    name: "Hip-Hop",
    playlist: [...]
  },
  {
    id: "trending",
    name: "Trending",
    playlist: [...]
  },
  {
    id: "bollywood",
    name: "Bollywood",
    playlist: [...]
  },
  {
    id: "lofi",
    name: "Lo-Fi",
    playlist: [...]
  }
];
Do NOT connect "collegeId" to the category or playlist data.
---
CORE RULE
College = Background/Visual Theme
Category = Music Discovery
Changing the college must NEVER change the selected category, playlist or music.
Changing the category must NEVER change the selected college or background.
The two systems should work independently.
The only relationship between them is that both appear within the same website experience.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://du-campus-beats.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ec34374f-1b1c-4dd1-a393-3bfd6e737dbf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
