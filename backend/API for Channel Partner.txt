// Import required modules
require('dotenv').config();   // 👈 Load .env at the very top
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// Create an Express application
const app = express();
// The hosting provider (Render) sets the PORT variable. We use 3000 as a fallback.
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION POOL ---
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.MYSQLPORT || 3306,   // 👈 fallback to 3306 if not defined
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- TEST DB ENDPOINT ---
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT 1 + 1 AS result');
        res.json({ success: true, dbTest: rows[0] });
    } catch (err) {
        console.error('DB Test Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- API ENDPOINTS ---

/**
 * GET /api/partners/:id
 */
app.get('/api/partners/:id', async (req, res) => {
    const partnerId = req.params.id;
    try {
        const [partnerRows] = await dbPool.query('SELECT * FROM channel_partners WHERE id = ?', [partnerId]);
        if (partnerRows.length === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        const partner = partnerRows[0];
        const [documentRows] = await dbPool.query('SELECT * FROM partner_documents WHERE partner_id = ?', [partnerId]);
        const responseData = { ...partner, documents: documentRows };
        res.json(responseData);
    } catch (error) {
        console.error('Failed to fetch partner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/partners/:id/decision
 */
app.patch('/api/partners/:id/decision', async (req, res) => {
    const partnerId = req.params.id;
    const { final_decision, final_decision_reason } = req.body;
    if (!final_decision || !['Approved', 'Rejected'].includes(final_decision)) {
        return res.status(400).json({ message: "Invalid 'final_decision'. Must be 'Approved' or 'Rejected'." });
    }
    try {
        const query = 'UPDATE channel_partners SET final_decision = ?, final_decision_reason = ?, approval_date = NOW() WHERE id = ?';
        const [result] = await dbPool.query(query, [final_decision, final_decision_reason, partnerId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        res.json({ message: `Partner final decision updated to ${final_decision}` });
    } catch (error) {
        console.error('Failed to update final decision:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/partners/:id/section-status
 */
app.patch('/api/partners/:id/section-status', async (req, res) => {
    const partnerId = req.params.id;
    const { section, status, reason } = req.body;

    console.log(`--- New PATCH request for partner ID: ${partnerId} ---`);
    console.log('Received body:', req.body);

    const validSections = [
        'applicant_details', 
        'current_address', 
        'permanent_address', 
        'kyc_documents', 
        'banking_details'
    ];
    
    if (!section || !validSections.includes(section)) {
        console.error('Validation failed: Invalid section provided.');
        return res.status(400).json({ message: `Invalid 'section' provided. Must be one of: ${validSections.join(', ')}` });
    }

    if (!status || !['Approved', 'Rejected'].includes(status)) {
        console.error('Validation failed: Invalid status provided.');
        return res.status(400).json({ message: "Invalid 'status' provided. Must be 'Approved' or 'Rejected'." });
    }

    const statusColumn = `${section}_status`;
    const reasonColumn = `${section}_reason`;

    try {
        const updateQuery = `
            UPDATE channel_partners 
            SET ${mysql.escapeId(statusColumn)} = ?, ${mysql.escapeId(reasonColumn)} = ? 
            WHERE id = ?
        `;
        
        console.log('Executing SQL:', updateQuery.trim().replace(/\s+/g, ' '));
        
        const [result] = await dbPool.query(updateQuery, [status, reason, partnerId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        console.log('Update successful!');
        res.json({ message: `Section '${section}' for partner ${partnerId} has been updated to '${status}'.` });

    } catch (error) {
        console.error(`--- SQL ERROR for section ${section} ---:`, error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// --- START SERVER ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log("DB Config =>", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE
    });
});
