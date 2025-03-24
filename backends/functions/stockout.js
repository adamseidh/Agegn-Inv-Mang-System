const db = require("../db");
const Stockout = (req, res) => {
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

    let categoryId = null;
    let filterObj = {};
    if (filter) {
        try {
            filterObj = JSON.parse(decodeURIComponent(filter));
            categoryId = filterObj.category_id || null;
            q = q || filterObj.q || null;
        } catch (err) {
            console.error("Error parsing filter JSON:", err);
        }
    }

    let whereClause = 'WHERE 1 = 1';
    if (q) {
        whereClause += ` AND i.name LIKE '%${q}%'`; // Ensure `i` is the correct alias for the `items` table
    }

    if (categoryId) {
        whereClause += ` AND so.category_id = '${categoryId}'`;
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
        SELECT so.*, c.name as categoryName, i.name , cus.name as customerName
        FROM stockouts so
        JOIN category c ON so.category_id = c.id
        JOIN items i ON so.item_id = i.id
        JOIN customers cus ON so.customer_id = cus.id
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM stockouts so
                JOIN items i ON so.item_id = i.id
                ${whereClause}`;

            db.query(countQuery, (err, countResult) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    const total = countResult[0].total;

                    // Calculate the summation for each column
                    const totalRow = {
                        id: null,
                        title: "Total",
                        budget_plan: results.reduce((sum, row) => sum + parseFloat(row.budget_plan || 0), 0).toString(),
                        quartOne: results.reduce((sum, row) => sum + parseFloat(row.quartOne || 0), 0).toString(),
                        quartTwo: results.reduce((sum, row) => sum + parseFloat(row.quartTwo || 0), 0).toString(),
                        quartThree: results.reduce((sum, row) => sum + parseFloat(row.quartThree || 0), 0).toString(),
                        quartFour: results.reduce((sum, row) => sum + parseFloat(row.quartFour || 0), 0).toString(),
                    };

                    // Append the total row to the results
                    // results.push(totalRow);

                    // Set headers and return the response
                    res.setHeader('Content-Range', `expenses ${offset}-${offset + results.length}/${total}`);
                    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                    res.json(results);
                }
            });
        }
    });
};

const singleStockout = (req, res) => {
    const { id } = req.params;
    const query = `SELECT so.*, c.name as categoryName, i.name , cus.name as customerName
         FROM stockouts so
        JOIN category c
        ON so.category_id = c.id
        JOIN items i
        On so.item_id = i.id
        JOIN customers cus
        ON so.customer_id = cus.id WHERE so.id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'data not found' });
        } else {
            res.json(results[0]);
        }
    });
}

const AddStockout = (req, res) => {
    const {
        itemId, customerId, quantity
    } = req.body;

    //const stockout = quantity;
    //const available_stock = parseFloat(stockin) - parseFloat(stockout);

    // Fetch category_id from items table
    const getCategorySql = 'SELECT category_id FROM items WHERE id = ?';

    db.query(getCategorySql, [itemId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        const category_id = results[0].category_id; // Access category_id correctly



        // Insert new product into the products table
        const query = `
            INSERT INTO stockouts (item_id, category_id, customer_id,  quantity)
            VALUES (?, ?, ?, ?)
        `;

        const values = [itemId, category_id, customerId, quantity];

        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({ success: true, message: "Data added successfully", id: result.insertId });
        });
    });
};



const EditStockout = (req, res) => {
    const { id } = req.params;
    const {
        item_id, customer_id, quantity
    } = req.body;



    //const available_stock = parseFloat(stockin) - parseFloat(stockout);

    // Fetch category_id from items table
    const getCategorySql = 'SELECT category_id FROM items WHERE id = ?';

    db.query(getCategorySql, [item_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        const category_id = results[0].category_id; // Access category_id correctly



        // Update the products table
        const query = `
            UPDATE stockouts 
            SET item_id = ?,
                category_id = ?,
                customer_id = ?,
                quantity = ?
            WHERE id = ?`;

        db.query(query, [item_id, category_id, customer_id, quantity, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            res.json({ message: "Data updated successfully", id: id });
        });
    });
};



const deleteStockout = (req, res) => {
    const { id } = req.params;



    const query = 'DELETE FROM stockouts WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "data not found" });
        }

        res.json({ message: "data deleted successfully" });
    });
}

module.exports = { Stockout, singleStockout, AddStockout, EditStockout, deleteStockout }