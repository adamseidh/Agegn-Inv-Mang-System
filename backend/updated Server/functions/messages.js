const db = require("../db");

const Messages = (req, res) => {
    let { _sort, _order, _page, _limit, q, filter, range, sort } = req.query;

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

    let message_status = null;
    let filterObj = {};
    if (filter) {
        try {
            filterObj = JSON.parse(decodeURIComponent(filter));
            message_status = filterObj.message_status || null;
            q = q || filterObj.q || null;
        } catch (err) {
            console.error("Error parsing filter JSON:", err);
        }
    }

    let whereClause = 'WHERE 1 = 1';
    if (q) {
        whereClause += ` AND (title LIKE '%${q}%' )`;
    }

    if (message_status) {
        whereClause += ` AND message_status = '${message_status}'`;
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
        SELECT * FROM messages
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const countQuery = `SELECT COUNT(*) AS total FROM messages ${whereClause}`;
            db.query(countQuery, (err, countResult) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    const total = countResult[0].total;

                    // Calculate the summation for each column
                    const totalRow = {
                        id: null,
                        reason: "Total",
                        amount: results.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0).toString(),

                    };

                    // Append the total row to the results
                    //results.push(totalRow);

                    // Set headers and return the response
                    res.setHeader('Content-Range', `articles ${offset}-${offset + results.length}/${total}`);
                    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                    res.json(results);
                }
            });
        }
    });
};



const AMessage = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM messages WHERE id = ?';
    console.log('message id', id)
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Data not found' });
        } else {


            //make the message status as seen
            const query = `
        UPDATE messages 
        SET message_status = 'Seen'
        WHERE id = ?`;

            db.query(query, id, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Data not found" });
                }


            });

            /// resposne the fetched messagee
            res.json(results[0]); //
        }
    });
}


const InsertMessage = (req, res) => {
    const { name, phone, email, message_content } = req.body;

    const messageStatus = 'UnSeen';// insert message status as UnSeen as dafault.

    const query = `
        INSERT INTO messages (name, phone, email, message_content, message_status)
        VALUES (?, ?, ?, ?,?)
    `;

    const values = [name, phone, email || '', message_content, messageStatus];

    db.query(query, values, (err, result) => {
        if (err) {
            console.log('error', err);
            return res.status(500).json({ error: err });
        }

        res.json({ id: result.insertId });
    });
};




const deleteMessage = (req, res) => {
    const { id } = req.params;



    const query = 'DELETE FROM messages WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }

        res.json({ message: "Data deleted successfully" });
    });
}


module.exports = { Messages, AMessage, InsertMessage, deleteMessage }