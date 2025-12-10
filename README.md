# NoteMint 🍃

NoteMint is a modern, offline-first note-taking application powered by AI. It allows you to create, organize, and summarize your thoughts instantly, all wrapped in a beautiful, responsive user interface.

![NoteMint Screenshot](https://via.placeholder.com/800x400?text=NoteMint+UI+Preview)

## ✨ Key Features

- **🧠 AI Summarization**: Instantly summarize long notes using Google's Gemini AI (`gemini-2.5-flash`).
- **⚡ Offline-First**: Your notes are saved locally to your browser (`localStorage`), so you never lose data even without an internet connection.
- **🌙 Dark Mode**: A fully integrated dark theme for comfortable writing at night.
- **🏷️ Tags & Bookmarks**: Organize your notes with custom tags and pin important ones with bookmarks.
- **🎨 Modern UI**: Built with React & Tailwind CSS, featuring "Bricolage Grotesque" and "Manrope" typography, hidden scrollbars, and smooth transitions.
- **⌨️ Keyboard Shortcuts**: Use `Ctrl/Cmd + Enter` to save instantly.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Heroicons
- **Backend**: Node.js, Express.js, MongoDB (Optional for sync, mostly local)
- **AI**: Google Generative AI SDK (Gemini)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Pruthivi13/Note-mint.git
    cd Note-mint
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```

3.  **Configuration**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5005
    MONGODB_URI=mongodb://127.0.0.1:27017/notemint
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the App**
    You can run both client and server concurrently (if configured) or in separate terminals.

    *Terminal 1 (Server):*
    ```bash
    cd server
    npm run dev
    ```

    *Terminal 2 (Client):*
    ```bash
    cd client
    npm run dev
    ```

5.  **Open in Browser**
    Navigate to `http://localhost:5173`

## 👤 Author

**Pruthiviraj**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
