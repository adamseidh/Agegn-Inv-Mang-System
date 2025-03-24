const db = require("../db");
const bcrypt = require('bcryptjs');
const Account = (req, res) => {
    let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

    const userId = req.query.userId;

    console.log('user id:', userId);

    // Defaults
    _sort = _sort || 'id';
    _order = _order === 'desc' ? 'DESC' : 'ASC';
    _page = parseInt(_page, 10) || 1;
    _limit = parseInt(_limit, 10) || 10;
    let offset = (_page - 1) * _limit;

    if (range) {
        try {
            const rangeArray = JSON.parse(range);
            if (rangeArray.length === 2) {
                offset = rangeArray[0];
                _limit = rangeArray[1] - rangeArray[0] + 1;
            }
        } catch (err) {
            console.error("Error parsing range parameter:", err);
        }
    }

    let payment_status = null;
    let filterObj = {};
    if (filter) {
        try {
            filterObj = JSON.parse(decodeURIComponent(filter));
            payment_status = filterObj.payment_status || null;
            q = q || filterObj.q || null;
        } catch (err) {
            console.error("Error parsing filter JSON:", err);
        }
    }

    let whereClause = 'WHERE 1 = 1';
    if (q) {
        whereClause += ` AND (TIN LIKE '%${q}%' OR phone LIKE '%${q}%' OR name LIKE '%${q}%')`;
    }

    if (payment_status) {
        whereClause += ` AND payment_status = '${payment_status}'`;
    }

    if (sort) {
        try {
            const sortArray = JSON.parse(sort);
            _sort = sortArray[0] || _sort;
            _order = sortArray[1] || _order;
        } catch (err) {
            console.error("Error parsing sort parameter:", err);
        }
    }

    const validSortColumns = ['id', 'name'];
    if (!validSortColumns.includes(_sort)) {
        _sort = 'id';
    }

    if (_sort === 'capital') {
        _sort = 'CAST(capital AS DECIMAL)';
    }

    const query = `
        SELECT * FROM users
        ${whereClause} AND id = ?
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}  `;

    db.query(query, userId, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const countQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
            db.query(countQuery, (err, countResult) => {
                if (err) {
                    console.log('error', err)
                    res.status(500).json({ error: err });
                } else {
                    const total = countResult[0].total;

                    // Calculate the summation for each column
                    const totalRow = {
                        id: null,
                        source: "Total",
                        amount: results.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0).toString(),

                    };

                    // Append the total row to the results
                    // results.push(totalRow);

                    // Set headers and return the response
                    res.setHeader('Content-Range', `client ${offset}-${offset + results.length}/${total}`);
                    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                    res.json(results);
                }
            });
        }
    });
};





const EditAccount = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, newPassword, oldPassword } = req.body; // Removed "password" from req.body
    console.log('Old password entered:', oldPassword);

    // Fetch the user's current hashed password from the database
    const fetchPasswordQuery = "SELECT password FROM users WHERE id = ?";
    db.query(fetchPasswordQuery, [id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const storedPassword = results[0].password; // Get the hashed password from the database
        console.log('Stored hashed password:', storedPassword);

        // Compare entered old password (hashed) with stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, storedPassword);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // If new password is provided, hash it before updating
        let updatedPassword = storedPassword; // Keep the same password if not changing
        if (newPassword) {
            const saltRounds = 10;
            updatedPassword = await bcrypt.hash(newPassword, saltRounds);
        }

        console.log('Updated password:', updatedPassword);

        // Update the user info in the database
        const updateQuery = `
            UPDATE users 
            SET name = ?, email = ?, phone = ?, password = ? 
            WHERE id = ?`;

        db.query(updateQuery, [name, email, phone, updatedPassword, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            res.json({ id: result.insertId, message: "Account updated successfully" });
        });
    });
};




const showAccount = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'data not found' });
        } else {
            res.json(results[0]); // Return the trader's data
        }
    });
}


const FetchUserName = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT name FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'data not found' });
        } else {
            res.json(results[0].name); // Return the trader's data
        }
    });
}



module.exports = { Account, EditAccount, showAccount, FetchUserName };
