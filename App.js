import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/search?query=${query}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error searching documents:', error);
        }
    };

    return (
        <div className="App">
            <h1>Document Maintenance System</h1>
            <input
                type="text"
                placeholder="Search documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <div>
                {results.map((doc) => (
                    <div key={doc._id}>
                        <h3>{doc.title}</h3>
                        <p>{doc.description}</p>
                        <p><b>Tags:</b> {doc.tags.join(', ')}</p>
                        <a href={`http://localhost:5000/${doc.filePath}`} download>Download</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
