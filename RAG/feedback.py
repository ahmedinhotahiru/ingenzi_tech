import dash
from dash import dcc, html, dash_table
from dash.dependencies import Input, Output
import json
import os

# Initialize the app
app = dash.Dash(__name__)

# Path to the feedback file
feedback_file = "feedback.jsonl"

# Helper function to load feedback data
def load_feedback():
    try:
        with open(feedback_file, "r") as file:
            return [json.loads(line) for line in file]
    except FileNotFoundError:
        return []  # Return an empty list if the file doesn't exist

# App layout
app.layout = html.Div(
    style={
        "background-color": "#f8f8fb",
        "color": "#495057",
        "font-family": "'Poppins', sans-serif",
        "text-align": "center",
        "padding": "20px",
    },
    children=[
        html.H1(
            "Ingenzi Feedback",
            style={"font-size": "36px", "margin-bottom": "20px"}
        ),
        html.Div(
            id="table-container",
            style={
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "margin-bottom": "20px",
            },
            children=[
                dash_table.DataTable(
                    id="feedback-table",
                    style_table={"width": "80%", "margin": "auto"},
                    style_data={
                        "whiteSpace": "normal",
                        "height": "auto",
                        "lineHeight": "20px",
                    },
                    style_header={
                        "backgroundColor": "#007bff",
                        "color": "white",
                        "fontWeight": "bold",
                    },
                    style_cell={
                        "textAlign": "left",
                        "padding": "5px",
                    },
                    style_data_conditional=[
                        {
                            "if": {"filter_query": "{raw_value} = 0"},
                            "backgroundColor": "#f8d7da",
                            "color": "#721c24",
                        },
                    ],
                    columns=[
                        {"name": "ID", "id": "id"},
                        {"name": "User Prompt", "id": "user_prompt"},
                        {"name": "Feedback", "id": "feedback"},
                        {
                            "name": "Helpful",
                            "id": "value",
                            "presentation": "markdown",
                        },
                    ],
                    markdown_options={"link_target": "_blank"},
                ),
            ],
        ),
        html.Button(
            "Download Feedback Data",
            id="download-button",
            style={
                "background-color": "#007bff",
                "color": "white",
                "padding": "10px 20px",
                "border": "none",
                "border-radius": "5px",
                "cursor": "pointer",
            },
        ),
        dcc.Download(id="download-dataframe-json"),
    ],
)

# Callback to load data into the table
@app.callback(
    Output("feedback-table", "data"),
    Input("feedback-table", "id"),
)
def update_table(_):
    feedback = load_feedback()
    for entry in feedback:
        # Add a raw_value column for conditional styling
        # entry["raw_value"] = entry["value"]  # Store the raw numeric value
        # Add a markdown column with thumbs icons
        entry["value"] = (
            "![Green thumbs up](https://img.icons8.com/ios/30/4CAF50/thumb-up.png)"
            if entry["value"] == 1
            else "![Red thumbs down](https://img.icons8.com/ios/30/FF0000/thumbs-down.png)"
        )
    return feedback


# Callback for the download button
@app.callback(
    Output("download-dataframe-json", "data"),
    Input("download-button", "n_clicks"),
    prevent_initial_call=True,
)
def download_feedback(n_clicks):
    with open(feedback_file, "r") as file:
        data = file.read()
    return dict(content=data, filename="feedback.jsonl")


# Run the app
if __name__ == "__main__":
    app.run_server(debug=False)
    # app.run_server(host="0.0.0.0", port=int(os.environ.get("PORT", 8050)))
