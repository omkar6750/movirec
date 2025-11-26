# Backend API Documentation

This backend is built using Node.js and Express. It serves two main purposes: handling secure authentication via Google OAuth and serving movie data from a local dataset.

I chose to load the movie data (`moviesFull.json`) into memory when the server starts. Since the dataset isn't massive, this makes read operations like searching, filtering, and sorting blazing fast without needing to constantly hit a database for static content. MongoDB is used strictly for user persistence (storing profiles, favourites, and watchlists).

## Base URL

All API requests are prefixed with: `http://localhost:4000` (or your production URL).

---

## 1\. Authentication

I implemented a hybrid auth flow. Google handles the identity verification, but once they verify the user, I issue my own JWT stored in an `HttpOnly` cookie. This means the frontend doesn't need to manage tokens in local storage—the browser handles the security automatically.

### Login Flow

**Endpoint:** `GET /auth/google`

-   **Description:** Redirects the user to Google's login screen.
-   **Input:** None.
-   **Output:** Redirects to Google, then back to the frontend on success.

### Check Session

**Endpoint:** `GET /api/me`

-   **Description:** The frontend calls this on load to see if a user is already logged in. It checks the `token` cookie.
-   **Input:** (Automatic) `token` cookie.
-   **Response:**
    ```json
    {
    	"authenticated": true,
    	"user": {
    		"_id": "60d5ec...",
    		"email": "user@gmail.com",
    		"displayName": "John Doe",
    		"image": "https://lh3.google...",
    		"favourites": [],
    		"watchlist": []
    	}
    }
    ```

### Logout

**Endpoint:** `POST /api/logout`

-   **Description:** Clears the `HttpOnly` cookie.
-   **Response:** `{ "message": "Logged out" }`

---

## 2\. Movies Data (General)

This endpoint handles the heavy lifting for browsing. I built a flexible filter system that handles pagination, genre filtering, and sorting in one go.

**Endpoint:** `GET /api/movies` (or `GET /api/genres` depending on your route mount)

-   **Query Parameters:**

    -   `page` (optional, default: 1): The page number.
    -   `limit` (optional, default: 20): Items per page.
    -   `genre` (optional): Filter by genre string (e.g., "Action").
    -   `sortBy` (optional): Field to sort by (e.g., "year").
    -   `order` (optional): "asc" or "desc".

-   **Example Request:**
    `GET /api/movies?page=1&limit=10&genre=Action&sortBy=year`

-   **Response:**

    ```json
    {
    	"page": 1,
    	"limit": 10,
    	"totalMovies": 150,
    	"totalPages": 15,
    	"genre": "Action",
    	"sortBy": "year",
    	"results": [
    		{
    			"id": "tt0111161",
    			"title": "The Shawshank Redemption",
    			"year": 1994,
    			"genres": ["Crime", "Drama"],
    			"poster": "..."
    		}
    		// ... more movies
    	]
    }
    ```

---

## 3\. Search Functionality

**Endpoint:** `GET /api/search`

I built this endpoint specifically to handle text-based queries.

**Why I did it this way:**
Since I already have the full movie dataset loaded into memory from the JSON file, I decided against setting up a complex text-search index in MongoDB. Instead, I used native JavaScript array filtering. It takes the user's query, normalizes it (lowercases it and trims whitespace), and checks if it exists inside any movie title.

This approach is incredibly fast for this dataset size and saves me from managing database text indexes. It effectively turns the server memory into a read-only cache.

-   **Query Parameters:**

    -   `title` (Required): The partial or full movie title.
    -   `page` (Optional): Pagination support.

-   **Example Request:**
    `GET /api/search?title=batman&page=1`

-   **Response:**

    ```json
    {
    	"page": 1,
    	"limit": 20,
    	"totalMovies": 12,
    	"totalPages": 1,
    	"query": "batman",
    	"results": [
    		{
    			"title": "Batman Begins",
    			"year": 2005
    			// ... other details
    		},
    		{
    			"title": "The Batman",
    			"year": 2022
    			// ... other details
    		}
    	]
    }
    ```

---

## 4\. User Collections (Protected)

These routes require the user to be logged in. They interact with MongoDB to store user preferences.

**Endpoints:**

-   `GET /api/user/favourites`: Returns array of full movie objects.

-   `POST /api/user/favourites/:id`: Adds a movie ID to the user's list.

-   `DELETE /api/user/favourites/:id`: Removes a movie ID.

-   _(Same pattern applies to `/api/user/watchlist`)_

-   **Note:** When fetching favourites, the backend takes the IDs stored in MongoDB, looks them up in the local JSON file, and returns the full movie details to the frontend. This keeps the database size small (only storing IDs) while still serving rich data.
