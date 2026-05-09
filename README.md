# Vault — Digital Asset Management System

A production-ready MVP DAM system for uploading, browsing, searching, and downloading digital assets.

Built with **React + Vite + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## Features

- 📤 **Drag-and-drop file upload** with real-time progress bar
- 🖼️ **Image thumbnail previews** with lazy loading
- 📄 **PDF & video file icons** for non-image assets
- 🔍 **Search by filename** with debounced queries
- 🗂️ **Filter by type** (image, PDF, video) and **tags**
- 📑 **Pagination** (12 assets per page)
- 🗑️ **Delete assets** with confirmation guard
- ⬇️ **Download** and **view** files directly
- 🏷️ **Tag system** (comma-separated, stored in DB)
- 💀 **Loading skeletons** and empty/error states
- 🌙 **Light mode UI** — polished, modern design

---

## Tech Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios     |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB with Mongoose                   |
| Upload    | Multer (local disk storage)             |
| Routing   | React Router v6                         |

---

## Project Structure

```
dam-system/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── assetController.js  # Business logic
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handler
│   │   └── upload.js           # Multer config
│   ├── models/
│   │   └── Asset.js            # Mongoose schema
│   ├── routes/
│   │   └── assetRoutes.js      # API routes
│   ├── uploads/                # Stored files (gitignored)
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AssetCard.jsx       # Asset grid card
    │   │   ├── AssetThumbnail.jsx  # Image/icon previews
    │   │   ├── FilterBar.jsx       # Search + filters
    │   │   ├── Navbar.jsx          # Navigation
    │   │   ├── Pagination.jsx      # Page controls
    │   │   ├── Skeleton.jsx        # Loading placeholders
    │   │   └── ToastContainer.jsx  # Notifications
    │   ├── hooks/
    │   │   ├── useAssets.js        # Asset data + state
    │   │   └── useToast.js         # Toast manager
    │   ├── pages/
    │   │   ├── DashboardPage.jsx   # Asset library
    │   │   └── UploadPage.jsx      # Upload form
    │   ├── services/
    │   │   └── assetService.js     # Axios API calls
    │   ├── utils/
    │   │   └── helpers.js          # Formatting utilities
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- npm or yarn

---

### 1. Backend Setup

```bash
cd dam-system/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# Create uploads directory (if not exists)
mkdir -p uploads

# Start development server
npm run dev

# Or production
npm start
```

The backend runs on **http://localhost:5000**

---

### 2. Frontend Setup

```bash
cd dam-system/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                              | Description               |
|----------------|--------------------------------------|---------------------------|
| `PORT`         | `5000`                               | Express server port       |
| `MONGODB_URI`  | `mongodb://localhost:27017/dam_system`| MongoDB connection string |
| `NODE_ENV`     | `development`                        | Environment mode          |
| `MAX_FILE_SIZE`| `20971520`                           | Max upload size (bytes)   |
| `FRONTEND_URL` | `http://localhost:5173`              | CORS allowed origin       |

### Frontend (`frontend/.env`)

| Variable       | Default                       | Description          |
|----------------|-------------------------------|----------------------|
| `VITE_API_URL` | `http://localhost:5000/api`   | Backend API base URL |

---

## API Endpoints

### Assets

| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | `/api/assets/upload`    | Upload a new asset             |
| GET    | `/api/assets`           | Get all assets (filterable)    |
| GET    | `/api/assets/tags`      | Get all unique tags            |
| GET    | `/api/assets/:id`       | Get single asset               |
| DELETE | `/api/assets/:id`       | Delete asset + file            |

### Static Files

| Route           | Description            |
|-----------------|------------------------|
| `/uploads/:file`| Serve uploaded files   |

### Query Parameters for `GET /api/assets`

| Param       | Example           | Description               |
|-------------|-------------------|---------------------------|
| `search`    | `?search=report`  | Search by filename        |
| `type`      | `?type=pdf`       | Filter by type (image/pdf/video) |
| `tag`       | `?tag=invoice`    | Filter by tag             |
| `page`      | `?page=2`         | Page number (default: 1)  |
| `limit`     | `?limit=12`       | Items per page (max: 50)  |
| `startDate` | `?startDate=2024-01-01` | Filter from date   |
| `endDate`   | `?endDate=2024-12-31`   | Filter to date     |

**Examples:**
```
GET /api/assets?type=pdf
GET /api/assets?tag=invoice
GET /api/assets?search=report&page=2
GET /api/assets?type=image&limit=24
```

---

## Upload API

**POST** `/api/assets/upload`

| Field  | Type        | Required | Description           |
|--------|-------------|----------|-----------------------|
| `file` | `File`      | Yes      | The file to upload    |
| `tags` | `string`    | No       | JSON array or CSV     |

**Allowed types:** `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`, `video/mp4`  
**Size limit:** 20MB

**Response:**
```json
{
  "success": true,
  "message": "Asset uploaded successfully",
  "data": {
    "_id": "...",
    "filename": "1699000000-abc123.jpg",
    "originalName": "photo.jpg",
    "mimetype": "image/jpeg",
    "size": 204800,
    "tags": ["nature", "2024"],
    "uploadDate": "2024-11-03T10:00:00Z",
    "path": "/path/to/uploads/...",
    "fileUrl": "http://localhost:5000/uploads/..."
  }
}
```

---

## Database Schema

```js
Asset {
  filename:     String   // Stored filename (unique, hash-based)
  originalName: String   // Original user filename
  mimetype:     String   // MIME type
  size:         Number   // File size in bytes
  tags:         [String] // Array of tags
  uploadDate:   Date     // Upload timestamp
  path:         String   // Absolute disk path
  fileUrl:      String   // Public access URL
  createdAt:    Date     // Auto (Mongoose timestamps)
  updatedAt:    Date     // Auto (Mongoose timestamps)
}
```

---

## Error Responses

All errors return:
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

| Status | Cause                         |
|--------|-------------------------------|
| 400    | Bad request / validation fail |
| 404    | Asset not found               |
| 413    | File too large (> 20MB)       |
| 415    | Unsupported file type         |
| 500    | Internal server error         |

---

## Development Notes

- Files are stored in `backend/uploads/` with randomized names
- Add `backend/uploads/*` to `.gitignore` (keep the folder)
- For production, consider using S3/Cloudinary instead of local disk
- MongoDB indexes are set on `mimetype`, `uploadDate`, `tags`, and `originalName` for query performance

---

## License

MIT
