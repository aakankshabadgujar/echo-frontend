# 🎵 Echo - Full-Stack Music Streaming UI

**Echo** is a high-performance, Spotify-inspired music streaming frontend. Built with React and Tailwind CSS, it provides a seamless user experience for exploring music, managing personal playlists, and enjoying high-fidelity audio playback.

### 🌐 [Live Application Link](https://echo-music-frontend.onrender.com)

---

## 🚀 Key Features

* **User Authentication**: Integrated login and registration flows with persistent session management via JWT.
* **Interactive Dashboard**: A dynamic "Explore Music" grid that fetches real-time track data from the backend.
* **Smart Search**: Instant client-side filtering that allows users to find tracks by title or artist name.
* **Playlist Orchestration**: 
    * Create custom playlists through the sidebar interface.
    * Add songs to playlists via an automated dropdown menu (replaces manual ID entry).
    * Delete tracks from specific playlists with real-time UI updates.
* **Custom Audio Player**: A bottom-docked player featuring:
    * Dynamic progress bar movement linked to song playback.
    * Volume slider and mute functionality.
    * Auto-syncing track metadata (cover art, artist, and title).

---

## 🛠️ Tech Stack

* **React.js**: Functional components and Hooks (`useState`, `useEffect`, `useRef`) for state management.
* **Tailwind CSS**: Utility-first CSS for a responsive, dark-themed UI.
* **Lucide-React**: Consistent and scalable iconography.
* **Axios**: Promise-based HTTP client for secure communication with the Flask API.
* **Render**: Deployed as a static site for global availability.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── SideBar.jsx      # Navigation and Playlist management
│   ├── MainContent.jsx  # Music grid and Search logic
│   └── Player.jsx       # Audio controls and Progress logic
├── Auth.jsx             # Login/Signup logic and JWT handling
└── App.jsx              # Application Root and State Brain
