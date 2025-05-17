// filename: reactjs-learning-assistant/frontend/src/components/TextFile.tsx
import React, { useState, useEffect } from 'react';
import FileCreate from './FileCreate';
import './TextFiles.css'; // Create a CSS file for this component
import axios from 'axios';

interface FileInfo {
    filename: string;
}

function TextFiles() {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<FileInfo[]>('http://192.168.1.100:8000/api/files');
            setFiles(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error fetching file list.');
            console.error('Error fetching file list:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        if (!selectedFile) {
            alert('Please select a file to seed data.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://192.168.1.100:8000/api/seed_data', {
                filenames: [selectedFile],
            });
            alert(response.data.message); // Show success message
            console.log(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Error seeding data.');
            console.error('Error seeding data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="text-files-container">
            <h1>NOTES</h1>
            <h2>This is the TextFile Page</h2>
            <p>Here you can create, edit, delete, and select text files to add to the database.</p>
            <FileCreate />

            {loading && <div>Loading...</div>}
            {error && <div className="error-message">Error: {error}</div>}

            <div className="file-list-container">
                <h3>Available Files:</h3>
                {files.length > 0 ? (
                    <select className="siz"value={selectedFile || ''} onChange={(e) => setSelectedFile(e.target.value)}>
                        <option value="">Select a file</option>
                        {files.map((file) => (
                            <option key={file.filename} value={file.filename}>{file.filename}</option>
                        ))}
                    </select>
                ) : (
                    <div>No files available.</div>
                )}
                <button onClick={handleSeedData} disabled={!selectedFile || loading}>
                    {loading ? 'Seeding Data...' : 'Add Selected File to Database'}
                </button>
            </div>
<div style={{ textAlign: 'left' }}>
<span>
"Please generate seed text in the following structure:<br/>
Topic: [Describe what Storms, tornado and hurricanes are]<br/>
Style: The seed text should consist of eight or more paragraphs,<br/>
each containing 40-60 words. The paragraphs should not have titles,<br/>
and should be single-spaced.<br/>
You are speaking to an isolated group that have never experienced<br/>
life outside a cave.<br/>
Structure:<br/>
Practical role: Describe the topic's direct, practical function in<br/>
the world of the story.<br/>
Symbolic importance: Explain what the topic represents or symbolizes<br/>
within the context of the community or culture.<br/>
Sensory experience: Capture the sensory details associated with the<br/>
topic, invoking sight, sound, smell, touch, or taste.<br/>
Emotional impact: Focus on the emotional effect the topic has on the<br/>
community, specifically on key characters like Saltman, and describe<br/>
how it shapes their experiences or worldview.<br/>
The text should maintain a descriptive and evocative tone, focusing on<br/>
both the objective and emotional significance of the topic.<br/>
Do not include titles or bullet points—just the paragraphs as detailed above."
</span>
</div>            
        </div>
    );
}

export default TextFiles;