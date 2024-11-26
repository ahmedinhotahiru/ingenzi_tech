
# Ingenzi Tech | LLM-Powered Philips HDI 5000 Ultrasound Machine Troubleshooting Tool

## Setup Instructions

### Step 1: Clone the Repository
Clone the repository to your local machine.

```bash
git clone https://github.com/ahmedinhotahiru/ingenzi_tech.git
cd ingenzi_tech
```

### Step 2: Install Python Dependencies
In the root directory of the project, install the required Python dependencies using `requirements.txt`.

```bash
pip install -r requirements.txt
```

### Step 3: Run the Application

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

   - If you've previously installed the packages, simply run:

     ```bash
     npm start
     ```

#### 2. Start the Backend Server
   - In a new terminal, navigate to the `backend` directory.
   - Run the `end_points.py` file to start the backend server:

     ```bash
     python .\end_points.py
     ```

#### 3. Start the Chainlit Chat Server (RAG)
   - In a third terminal, navigate to the `RAG` folder.
   - Run the `chat_ultrasound_chroma.py` file using Chainlit:

     ```bash
     chainlit run .\chat_ultrasound_chroma.py
     ```

   This will start the Chainlit chat as a standalone interface and as a copilot that will be mounted on the React app once it loads.

### Step 4: Run the Feedback App (For Admins)

If you would like to run the feedback system app:

#### 1. Install Dash Dependencies
   - In a third terminal, navigate to the `RAG` folder.
   - Run the app using the following command:

     ```bash
     python feedback_app.py
     ```

   - This will start the Dash app on your local machine.

#### 3. Access the Feedback App
   - Once the app is running, open your browser and navigate to `http://127.0.0.1:8050/` to view and interact with the feedback table.

### Notes
- Ensure that all components (React app, backend server, Chainlit chat server, and the feedback app) are running simultaneously in separate terminals.
- After setup, you should be able to access both the ultrasound troubleshooting tool and the feedback app as intended.


### Notes
- Ensure that all three components (React app, backend server, and Chainlit chat server) are running simultaneously in separate terminals.
- After setup, you should be able to access the application as intended.

---
