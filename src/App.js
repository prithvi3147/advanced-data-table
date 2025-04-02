import React, { useState } from 'react';

function App() {
    const initialData = [
        { col1: 'A', col2: 'B', col3: 1 },
        { col1: 'C', col2: 'D', col3: 2 },
        { col1: 'E', col2: 'F', col3: 3 },
    ];

    const [sortedData, setSortedData] = useState([...initialData]);

    const sortByCol3 = () => {
        const sorted = [...sortedData].sort((a, b) => a.col3 - b.col3);
        setSortedData(sorted);
    };

    return (
        <div>
            <button onClick={sortByCol3}>Sort by Col 3</button>
            <table>
                <thead>
                    <tr>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.col1}</td>
                            <td>{row.col2}</td>
                            <td>{row.col3}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;