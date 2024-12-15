# Ingenzi Tech | LLM-Powered Philips HDI 5000 Ultrasound Machine Troubleshooting Tool

## Demo Video
[![Watch the demo video]](https://www.youtube.com/watch?v=hG8LZTb0rpc)

---

## Setup Instructions

### Step 1: Clone the Repository
Clone the repository to your local machine.

```bash
git clone https://github.com/ahmedinhotahiru/ingenzi_tech.git
cd ingenzi_tech
```

### Step 2: Install Python Dependencies
- First, create a python virtual environment (of your preferred name) in the project directory:

```bash
python -m venv capstone_venv
```

- Once the virtual environment is created, activate it by running:

```bash
capstone_venv\Scripts\Activate.ps1
```

You can replace 'capstone_venv' with your preferred virtual environment name.

- In the root directory of the project, install the required Python dependencies using `requirements.txt`.

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment and API Keys
Certain tools and APIs used in the project require configuration. Follow the instructions below to set up the necessary keys and configurations.

#### 1. Google API Keys (Google Calendar Integration)
The Google API keys (`CLIENT_ID`, `API_KEY`, and `SCOPES`) are located in the `ultrasound-dashboard/src/Home.js` file. Replace the placeholders with your own keys:

- Visit the [Google Cloud Console](https://console.cloud.google.com/).
- Create a project and enable the Google Calendar API.
- Generate OAuth 2.0 Client IDs and an API key.
- Replace the following values in `Home.js`:
  ```javascript
  const CLIENT_ID = 'your-client-id.apps.googleusercontent.com';
  const API_KEY = 'your-api-key';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';
  ```

#### 2. Chainlit Copilot Configuration
The Chainlit copilot is configured in `ultrasound-dashboard/public/index.html`. By default, it uses port `8000`. If this port is occupied, update the following line to use a different port:

```html
<script>
  window.mountChainlitWidget({
      chainlitServer: "http://localhost:<new-port>",
  });
</script>
```

#### 3. Flask Backend GitHub Token
The GitHub token and repository information are defined in `backend/end_points.py`. Replace the token with your own:

- Create a [GitHub Personal Access Token](https://github.com/settings/tokens).
- Replace the token in the `end_points.py` file:
  ```python
  g = Github("your-personal-access-token")
  ```

#### 4. Tavily and OpenAI API Keys
The `RAG/chat_ultrasound_chroma.py` file uses API keys for Tavily and OpenAI. Replace these with your own:

- Generate a Tavily API key from [Tavily's API Console](https://tavily.com/developers).
- Create an OpenAI API key from [OpenAI's API Key Management](https://platform.openai.com/account/api-keys).
- Replace the placeholders in the script:
  ```python
  os.environ["TAVILY_API_KEY"] = 'your-tavily-api-key'
  embeddings = OpenAIEmbeddings(openai_api_key="your-openai-api-key")
  llm = ChatOpenAI(openai_api_key="your-openai-api-key", model="gpt-3.5-turbo")
  ```

### Step 4: Run the Application

The application has three main components that need to be run simultaneously in separate terminals.

#### 1. Start the React App (Ultrasound Dashboard)
   - Navigate to the `ultrasound-dashboard` directory.
   - If this is the first time you're running the app, install the required Node packages:

     ```bash
     npm install
     ```

   - Then, start the React development server:

     ```bash
     npm start
     ```

   - If the default port (`3000`) is occupied, you can run the app on a different port. For example:

     ```bash
     PORT=3001 npm start
     ```

   - Once running, access the application at http://localhost:3000/ (or the specified port)

#### 2. Start the Backend Server
   - In a new terminal, navigate to the `backend` directory.
   - Run the `end_points.py` file to start the backend server:

     ```bash
     python .\end_points.py
     ```

   - By default, the server runs on port `5000`. If this port is occupied, modify the `app.run` statement in the script:
     ```python
     app.run(debug=True, port=<new-port>)
     ```

#### 3. Start the Chainlit Chat Server (RAG)
   - In a third terminal, navigate to the `RAG` folder.
   - Run the `chat_ultrasound_chroma.py` file using Chainlit:

     ```bash
     chainlit run .\chat_ultrasound_chroma.py --port <new-port>
     ```

   Replace `<new-port>` if port `8000` is occupied.
   - Once running, the Chainlit copilot can also be accessed as a standalone application at http://localhost:8000/ (or the specified port).

#### 4. Run the Feedback App (For Admins)
   - In a fourth terminal, navigate to the `RAG` folder.
   - Run the app using the following command:

     ```bash
     python feedback_app.py
     ```

   - Access the app at `http://127.0.0.1:8050/`.

### Step 5: Access the Application
Once all components are running:

- Access the main application with the Chainlit copilot widget at http://localhost:3000/ (or the specified React app port).

- The Chainlit copilot can also be accessed as a standalone application at http://localhost:8000/ (or the specified Chainlit server port).

- Admins can access the feedback app at http://127.0.0.1:8050/.

---

### Admin Guide
For detailed setup, maintenance, and troubleshooting instructions, refer to the [Comprehensive Admin Guide](https://docs.google.com/document/d/1AEEONaFrA4EH3LazvzqPEq9Cce8cfGuAa_ih4bQtR94/edit?usp=sharing).

### Notes
- Ensure that all components (React app, backend server, Chainlit chat server, and the feedback app) are running simultaneously in separate terminals.
- Replace all API keys and tokens as outlined to avoid authorization issues.
- Use appropriate ports to prevent conflicts with other services.

---
