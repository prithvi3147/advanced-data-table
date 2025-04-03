import React, { useState, useMemo, useCallback } from 'react';
import './style.css';
import { debounce } from 'lodash';

function App() {
    const initialData = useMemo(() => {
        const names = ["Aarav Patel", "Aanya Sharma", "Advik Singh", "Anaya Verma", "Arjun Kumar", "Avni Yadav", "Dhruv Rajput", "Diya Mehta", "Ishaan Joshi", "Kavya Tiwari", "Lakshya Pandey", "Maira Chauhan", "Nakul Rawat", "Navya Negi", "Omkar Rana", "Prisha Bisht", "Rohan Gusain", "Saanvi Thapa", "Tanay Pokhriyal", "Urvi Bhatt", "Veer Rawat", "Yashika Fonia", "Zoya Joshi", "Aaditya Rana", "Aarohi Mehta", "Abhay Singh", "Aditi Chauhan", "Akshay Kumar", "Amisha Pandey", "Aniket Yadav", "Anjali Verma", "Aryan Rajput", "Bhavya Negi", "Chirag Rawat", "Deepika Bisht", "Divyansh Gusain", "Garima Thapa", "Gaurav Pokhriyal", "Harsh Bhatt", "Himanshi Fonia", "Jagriti Joshi", "Karan Rana", "Kirti Mehta", "Krish Singh", "Lavanya Chauhan", "Manav Kumar", "Meera Pandey", "Mohit Yadav", "Muskan Verma", "Naman Rajput", "Neha Negi", "Nikhil Rawat", "Nisha Bisht", "Palak Gusain", "Piyush Thapa", "Pooja Pokhriyal", "Pranav Bhatt", "Preeti Fonia", "Rahul Joshi", "Rajni Rana", "Riya Mehta", "Rohit Singh", "Sakshi Chauhan", "Samar Kumar", "Sanaya Pandey", "Sarthak Yadav", "Seema Verma", "Shantanu Rajput", "Shivani Negi", "Shreya Rawat", "Siddharth Bisht", "Simran Gusain", "Sneha Thapa", "Soham Pokhriyal", "Sonali Bhatt", "Sourabh Fonia", "Subham Joshi", "Surbhi Rana", "Tanya Mehta", "Tarun Singh", "Trisha Chauhan", "Ujjwal Kumar", "Utkarsh Pandey", "Vaishnavi Yadav", "Varun Verma", "Vikas Rajput", "Vinita Negi", "Vishal Rawat", "Yogesh Bisht", "Yukta Gusain", "Zainab Thapa", "Zara Pokhriyal", "Aakash Bhatt", "Aarzoo Fonia", "Abhishek Joshi", "Adarsh Rana", "Ahana Mehta", "Ajay Singh", "Akriti Chauhan", "Alok Kumar", "Amrita Pandey", "Anand Yadav"];
        const technologies = ['Java Spring Boot', 'Kubernetes', 'Node.js', 'PostgreSQL', 'Terraform', 'Kafka', 'Elasticsearch', 'GraphQL', 'Go', 'Azure DevOps'];
        const departments = ['Development', 'Infrastructure', 'Analytics', 'Security', 'Operations', 'Testing', 'Database', 'Cloud'];
        const positions = ['Software Engineer', 'DevOps Engineer', 'Data Engineer', 'Backend Developer', 'Cloud Architect', 'Security Engineer', 'Database Administrator', 'Site Reliability Engineer', 'Systems Engineer', 'Integration Specialist'];

        const records = [];
        for (let i = 0; i < 100; i++) {
            const technology = technologies[Math.floor(Math.random() * technologies.length)];
            let projectName = '';

            const projectNames = {
                'Java Spring Boot': ['Microservices API', 'RESTful Backend', 'Enterprise App', 'Spring Batch Job'],
                'Kubernetes': ['Cluster Deployment', 'Container Orchestration', 'Service Mesh', 'CI/CD Pipelines'],
                'Node.js': ['Real-time App', 'Serverless Functions', 'API Development', 'Full-Stack Project'],
                'PostgreSQL': ['Data Migration', 'Performance Tuning', 'Database Design', 'Reporting System'],
                'Terraform': ['Infrastructure Automation', 'Cloud Provisioning', 'Module Development', 'Resource Management'],
                'Kafka': ['Data Streaming Pipeline', 'Message Broker', 'Real-time Analytics', 'Event-Driven System'],
                'Elasticsearch': ['Log Aggregation', 'Search Platform', 'Data Indexing', 'Monitoring Tool'],
                'GraphQL': ['API Aggregation', 'Schema Design', 'Client Integration', 'Data Fetching'],
                'Go': ['High-Performance Service', 'Command-Line Tool', 'Network Programming', 'Distributed System'],
                'Azure DevOps': ['CI/CD Implementation', 'Release Management', 'Pipeline Automation', 'Artifact Repository'],
            };

            projectName = projectNames[technology][Math.floor(Math.random() * projectNames[technology].length)];

            // Introduce 20% duplication (V)
            if (Math.random() < 0.2) {
                // Pick a random existing project name
                if (records.length > 0) {
                    projectName = records[Math.floor(Math.random() * records.length)].project;
                }
            }

            records.push({
                id: 100 + i,
                name: names[i],
                position: positions[Math.floor(Math.random() * positions.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                experience: Math.floor(Math.random() * 15) + 1,
                technology: technology,
                project: projectName,
                salary: Math.floor(Math.random() * 50000) + 60000,
            });
        }
        return records;
    }, []);

    const [data, setData] = useState([...initialData]);
    const [sortConfig, setSortConfig] = useState({});
    const [filters, setFilters] = useState({ department: '', technology: '', experienceRange: [0, 15] });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [visibleColumns, setVisibleColumns] = useState(['id', 'name', 'position', 'department', 'experience', 'technology', 'project', 'salary']);
    const [loading, setLoading] = useState(false);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData.filter(item => {
            const departmentFilter = filters.department ? item.department.toLowerCase().includes(filters.department.toLowerCase()) : true;
            const technologyFilter = filters.technology ? item.technology.toLowerCase().includes(filters.technology.toLowerCase()) : true;
            const experienceFilter = item.experience >= filters.experienceRange[0] && item.experience <= filters.experienceRange[1];
            const searchFilter = searchTerm
                ? Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
                : true;
            return departmentFilter && technologyFilter && experienceFilter && searchFilter;
        });
    }, [sortedData, filters, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, page, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const debouncedSearch = useCallback(debounce((value) => {
        setSearchTerm(value);
    }, 300), []);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleExportCSV = () => {
        const csv = filteredData.map(row => Object.values(row).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="app">
            <div className="controls">
                <input type="text" placeholder="Search..." onChange={handleSearchChange} />
                <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                    <option value="">All Departments</option>
                    {['Development', 'Infrastructure', 'Analytics', 'Security', 'Operations', 'Testing', 'Database', 'Cloud'].map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <select value={filters.technology} onChange={(e) => setFilters({ ...filters, technology: e.target.value })}>
                    <option value="">All Technologies</option>
                    {['Java Spring Boot', 'Kubernetes', 'Node.js', 'PostgreSQL', 'Terraform', 'Kafka', 'Elasticsearch', 'GraphQL', 'Go', 'Azure DevOps'].map(tech => (
                        <option key={tech} value={tech}>{tech}</option>
                    ))}
                </select>
                <div className="range-filter">
                    <label>Experience Range:</label>
                    <input type="range" min="0" max="15" value={filters.experienceRange[0]} onChange={(e) => setFilters({ ...filters, experienceRange: [parseInt(e.target.value), filters.experienceRange[1]] })} />
                    <input type="range" min="0" max="15" value={filters.experienceRange[1]} onChange={(e) => setFilters({ ...filters, experienceRange: [filters.experienceRange[0], parseInt(e.target.value)] })} />
                    <span>{filters.experienceRange[0]} - {filters.experienceRange[1]}</span>
                </div>
                <button onClick={handleExportCSV}>Export CSV</button>
            </div>
            <table>
                <thead>
                    <tr>
                        {visibleColumns.map(col => (
                            <th key={col} onClick={() => requestSort(col)}>{col.charAt(0).toUpperCase() + col.slice(1)} {sortConfig.key === col && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map(row => (
                        <tr key={row.id} className={row.salary > 80000 ? 'high-salary' : ''}>
                            {visibleColumns.map(col => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
}

export default App;