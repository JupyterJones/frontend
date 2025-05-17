#!/mnt/HDD500/reactjs-learning-assistant/backend/venv/bin/python3.9
'''
DOCUMENTATION
Flask Application Generator (app_builder.py)
Analysis: This Flask script serves as a powerful utility to bootstrap new topic-specific FastAPI backends based on your template_app_v2.py.

Core Functionality:Web Interface: Provides a simple HTML form to input:

Topic Name: The subject for the new learning assistant (e.g., "Quantum Physics").

Structured Prompt Text: The base prompt specific to this topic, used for features like conversation generation in the FastAPI app.

Input Processing & Sanitization: Retrieves topic_name and structured_prompt from the form.Performs basic validation to ensure inputs are provided.Sanitizes the topic_name using sanitize_for_path() to create a lowercase, underscore-separated version suitable for filenames and directory names (e.g., "quantum_physics").Creates a capitalized version using topic_name.title() (e.g., "Quantum Physics") for display purposes within the generated code.

Path Generation: Dynamically defines paths for:The output Python file for the new FastAPI app (e.g., quantum_physics.py).A directory for topic-specific files (e.g., quantum_physics_files/).A directory for ChromaDB persistence (e.g., quantum_physics_chroma_db/).The structured prompt text file (e.g., quantum_physics_files/structured_prompt_quantum_physics.txt).

Template Customization:Reads the content of your TEMPLATE_FILENAME (TEXT/template_app_v2.py).Replaces placeholders %%TOPIC_LOWER%% and %%TOPIC_CAPITALIZED%% with the derived topic names.

File and Directory Creation: Creates the necessary output directories (_files, _chroma_db) if they don't already exist.Writes the modified template content to the new topic-specific Python file.Saves the provided structured prompt into its designated text file within the _files directory.

Feedback & Error Handling:Displays success or error messages on the web page.Checks if the main Python file for the topic already exists to prevent accidental overwrites.Handles FileNotFoundError if the main template is missing.Includes a general try-except block to catch other unexpected errors during the generation process.Uses icecream (ic()) for helpful debugging output to the console.Strengths of the Flask Builder:Automation & Efficiency: Drastically reduces the manual effort and potential for errors when setting up a new topic backend.Consistency: Ensures that all generated topic backends adhere to the same structure and conventions defined in the master template.

User-Friendly (Developer UX): The web form is more convenient than a command-line script, especially for pasting multi-line structured prompts.Clear Structure: The generated output (Python file, directories, prompt file) is well-organized.Good Basic Validation: Prevents common issues like missing inputs or overwriting existing applications.Helpful Debugging: The use of icecream is a good practice for development and troubleshooting.Self-Contained HTML: Embedding the HTML template within the Python script keeps the builder simple and portable.Minor Considerations/Potential Enhancements for the Builder:Advanced Capitalization: topic_name.title() is good for most cases. If you encounter topics with acronyms (e.g., "AI") or specific casing preferences that title() doesn't handle (it would make "AI" into "Ai"), you might consider a more sophisticated capitalization strategy or allow manual input for the capitalized version if strictness is required in generated class names or UI titles. For the current template's usage (mostly display strings and tags), title() is likely sufficient.Configuration Flexibility: OUTPUT_BASE_DIR and TEMPLATE_FILENAME are hardcoded. For greater flexibility, these could be configurable via environment variables or additional form fields.

Security Note: While render_template_string is used, the message variable is server-generated, mitigating XSS risks. This is generally fine for an internal development tool. Interaction with the FastAPI Template (template_app_v2.py)The builder script is designed to work seamlessly with the FastAPI template you previously shared. The placeholders %%TOPIC_LOWER%% and %%TOPIC_CAPITALIZED%% in the FastAPI template are correctly targeted and replaced by this builder.

This ensures that each generated FastAPI application is properly configured with:Topic-specific database file paths (SQLite history, conversation).Topic-specific directory paths (_files, _chroma_db).A unique ChromaDB collection name (e.g., quantum_physics_qa).Topic-aware logging/print statements.Contextualized prompts for Gemini (e.g., "In the context of Quantum Physics...").Correctly named structured_prompt_<topic_lower>.txt file which the generated FastAPI app will then load.The FastAPI template itself (as analyzed previously) is robust, feature-rich, and uses modern practices. The builder complements it perfectly by automating its instantiation for various topics.

Overall:This builder script is a very effective tool for your project. It's well-written, handles common cases gracefully, and significantly enhances your ability to scale your learning assistant to new topics by leveraging the power of your FastAPI template. The combination of the Flask builder and the FastAPI template creates a solid foundation for your application.
'''


import os
import traceback
from flask import Flask, request, render_template_string
from icecream import ic # Using icecream for debugging

app = Flask(__name__)
app.secret_key = 'your_secret_key' # Consider using environment variables for secrets

# --- Configuration ---
OUTPUT_BASE_DIR = '.' # Base directory for generated files/folders
# *** IMPORTANT: Update this to the path of your NEW template file ***
TEMPLATE_FILENAME = 'TEXT/template_app_v2.py' # Assumes new template is here

# Ensure base output directory exists
os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)

def sanitize_for_path(name):
    """Sanitizes a string to be suitable for use in file/directory names."""
    # Keep alphanumeric, replace others with underscore, ensure lowercase
    return ''.join(c if c.isalnum() else '_' for c in name.strip()).lower()

#--------------------
# Main Flask route for the generator form
@app.route('/', methods=['GET', 'POST'])
def index():
    message = None
    success = False

    if request.method == 'POST':
        # Get data from the submitted form
        topic_name = request.form.get('topic_name')
        structured_prompt = request.form.get('structured_prompt')

        # Use ic for debugging form inputs
        ic(f"Received Topic Name: {topic_name}")
        ic(f"Received Structured Prompt (first 100 chars): {structured_prompt[:100]}")

        # Basic validation
        if not topic_name or not structured_prompt:
            message = 'Topic name and structured prompt are required.'
            ic(f"Validation Error: {message}")
        else:
            try:
                # Prepare topic names (lowercase for paths/ids, title case for display)
                topic_lower = sanitize_for_path(topic_name)
                # Use title() for simple capitalization, adjust if needed for specific cases like AI -> Ai
                topic_capitalized = topic_name.title()

                # Define output paths based on the sanitized topic name
                output_py_file = os.path.join(OUTPUT_BASE_DIR, f"{topic_lower}.py")
                output_files_dir = os.path.join(OUTPUT_BASE_DIR, f"{topic_lower}_files")
                output_chroma_dir = os.path.join(OUTPUT_BASE_DIR, f"{topic_lower}_chroma_db") # For ChromaDB persistence
                output_prompt_file = os.path.join(output_files_dir, f"structured_prompt_{topic_lower}.txt")

                # Log the generated paths for debugging
                ic(f"Generated Python File Path: {output_py_file}")
                ic(f"Generated Files Directory Path: {output_files_dir}")
                ic(f"Generated ChromaDB Directory Path: {output_chroma_dir}")
                ic(f"Generated Prompt File Path: {output_prompt_file}")

                # Check if the main Python file already exists to prevent overwriting
                if os.path.exists(output_py_file):
                    message = f"Error: Backend file '{os.path.basename(output_py_file)}' already exists for topic '{topic_name}'. Please choose a different topic name or delete the existing file."
                    ic(message)
                else:
                    # Read the template file content
                    try:
                        with open(TEMPLATE_FILENAME, 'r', encoding='utf-8') as f_template:
                            template_content = f_template.read()
                        ic(f"Template file '{TEMPLATE_FILENAME}' read successfully.")
                    except FileNotFoundError:
                        message = f"FATAL Error: Template file '{TEMPLATE_FILENAME}' not found. Cannot generate application."
                        ic(message)
                        # Return immediately if template is missing
                        return render_template_string(HTML_TEMPLATE, message=message, success=False)
                    except Exception as read_err:
                         message = f"FATAL Error: Could not read template file '{TEMPLATE_FILENAME}': {read_err}"
                         ic(message)
                         ic(traceback.format_exc())
                         return render_template_string(HTML_TEMPLATE, message=message, success=False)


                    # --- *** MODIFIED PLACEHOLDER REPLACEMENT *** ---
                    # Replace placeholders with the derived topic names
                    content = template_content.replace("%%TOPIC_LOWER%%", topic_lower)
                    content = content.replace("%%TOPIC_CAPITALIZED%%", topic_capitalized)
                    ic("Placeholders replaced in template content.")
                    # --- *** END OF MODIFICATION *** ---

                    # Create necessary output directories
                    # exist_ok=True prevents errors if directories already exist
                    os.makedirs(output_files_dir, exist_ok=True)
                    # ChromaDB directory is also needed, though the client might create it too
                    os.makedirs(output_chroma_dir, exist_ok=True)
                    ic(f"Ensured directories exist: {output_files_dir}, {output_chroma_dir}")


                    # Write the modified content to the new Python file
                    with open(output_py_file, 'w', encoding='utf-8') as f_out:
                        f_out.write(content)
                    ic(f"Generated Python file written: {output_py_file}")

                    # Write the provided structured prompt to its file
                    with open(output_prompt_file, 'w', encoding='utf-8') as f_prompt:
                        f_prompt.write(structured_prompt)
                    ic(f"Structured prompt file written: {output_prompt_file}")

                    # Set success message
                    message = f"Successfully generated backend application '{os.path.basename(output_py_file)}' for topic '{topic_name}'. Files are located in the '{OUTPUT_BASE_DIR}' directory."
                    ic(message)
                    success = True

            except Exception as e:
                # Catch any unexpected errors during the process
                ic("An unexpected exception occurred during generation.")
                ic(e)
                ic(traceback.format_exc())
                message = f"An unexpected error occurred during generation: {e}"
                success = False # Ensure success is false on error

    # Render the HTML page, passing the message and success status
    return render_template_string(HTML_TEMPLATE, message=message, success=success)

#--------------------
# HTML template for the web form (remains the same)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Generate Topic Assistant App</title>
    <style>
        body { font-family: sans-serif; margin: 2em; background-color: #f4f4f4; color: #333; }
        h1 { color: #0056b3; }
        form { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto;}
        label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
        input[type="text"], textarea {
             display: block;
             margin-bottom: 15px;
             width: 95%; /* Slightly less than 100% for padding */
             padding: 10px;
             border: 1px solid #ccc;
             border-radius: 4px;
             font-size: 1rem;
        }
        textarea { height: 200px; font-family: monospace; }
        button {
             padding: 10px 20px;
             background-color: #007bff;
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
             font-size: 1rem;
             transition: background-color 0.2s ease;
        }
        button:hover { background-color: #0056b3; }
        .message { margin: 20px auto; padding: 15px; border-radius: 5px; max-width: 600px; text-align: center; }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <h1>Generate New Topic Assistant Backend</h1>

    {% if message %}
        <div class="message {{ 'success' if success else 'error' }}">{{ message }}</div>
    {% endif %}

    <form method="POST">
        <label for="topic_name">Topic Name:</label>
        <input type="text" id="topic_name" name="topic_name" required placeholder="e.g., Consciousness, Quantum Physics">

        <label for="structured_prompt">Structured Prompt Text:</label>
        <textarea id="structured_prompt" name="structured_prompt" required placeholder="Paste the base prompt structure for this topic here... Use {start_prompt} and {context} as placeholders."></textarea>

        <button type="submit">Generate Topic App</button>
    </form>
</body>
</html>
"""
#--------------------

# Main execution block to run the Flask development server
if __name__ == '__main__':
    ic("Starting Flask app generator...")
    # Runs on port 5400 by default, debug=True enables auto-reload and more detailed errors
    # Set debug=False for production environments
    app.run(debug=True, port=5400)
