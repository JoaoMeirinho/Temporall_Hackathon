# TemporALL: Plan Your Adventure

### 1\. General Description

The TemporALL project is a website whose purpose is to facilitate access to information related to weather and climate, helping users know if they will be able to carry out activities like trips and events as they want, without the weather getting in the way.

### 2\. Main Features

Among the project's main features is the ability to search for future forecasts about climate-related information for a region and date chosen by the user.

### 3\. Benefits

The main benefit of the project is the ability to make long-term climate forecasts based on an AI model, which is a key differentiator as most existing tools have a very limited forecast range to the short term.

### 4\. Project Impact

The project has the ability to impact users' lives by helping them avoid unnecessary waste of time and money.

### 5\. Technologies Used

The project integrates multiple modern technologies to offer intelligent weather forecasts.

  - **Frontend**:
      - React with TypeScript
      - Tailwind CSS
      - Google Maps API (for the interactive map)
  - **Backend**:
      - Built in Python with FastAPI.
      - Uses the NASA POWER LARC API to collect historical weather data.
      - Uses the Google Gemini API to provide analyses and descriptions with artificial intelligence.
      - The system uses predictive models with Scikit-learn to forecast rain based on historical data.

This combination of APIs and frameworks creates an innovative application that combines climate data, artificial intelligence, and interactive visualization.

### 6\. Why is it Creative?

The project is creative because it transforms complex scientific data, usually accessible only to specialists, into simple and useful information for anyone to plan trips in advance. It combines climate science and artificial intelligence to forecast long-term weather trends, something that goes beyond traditional short-term forecasts. By translating data into clear and practical language, the system offers security and confidence to the user, making climate science a direct tool for real-life decisions.

-----

## Local Development (Front + Back)

To run the frontend and backend integrated locally:

1.  **Install frontend dependencies**:
      - Open the `front` directory and run:
    <!-- end list -->
    ```sh
    npm i
    ```
2.  **Start the FastAPI backend (port 5080)**:
      - Open the `Will_It_Rain` directory.
      - There is no `requirements.txt` file. The user must create a virtual environment and install the following dependencies:
          - `fastapi`
          - `uvicorn`
          - `pandas`
          - `numpy`
          - `requests`
          - `joblib`
          - `prophet`
          - `owslib`
          - `Pillow`
          - `google-generativeai`
      - Run: `python server.py`.
3.  **Start the frontend (port 8080)**:
      - Open the `front` directory.
      - Run: `npm run dev`.

**Development Proxy**:

  - Requests made to `/api/*` on the frontend are redirected to `http://localhost:5080/*`.
  - Optionally, you can define `VITE_API_URL` in `.env` to point to another backend.
