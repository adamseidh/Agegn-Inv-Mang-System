const db = require("../db");
const Stock = (req, res) => {
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
        whereClause += ` AND p.category_id = '${categoryId}'`;
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
        SELECT p.*, c.name as categoryName, i.name , i.id as item_id, s.name as supplierName, 
               p.stockin, p.stockout, p.available_stock
        FROM products p
        JOIN category c ON p.category_id = c.id
        JOIN items i ON p.item_id = i.id
        JOIN supplier s ON p.supplier_id = s.id
        ${whereClause}
        ORDER BY ${_sort} ${_order}
        LIMIT ${_limit} OFFSET ${offset}`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM products p
                JOIN items i ON p.item_id = i.id
                ${whereClause}`;

            db.query(countQuery, (err, countResult) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    const total = countResult[0].total;

                    // Aggregate items by item_id
                    let aggregatedResults = results.reduce((acc, item) => {
                        let existingItem = acc.find(i => i.item_id === item.item_id);

                        if (existingItem) {
                            existingItem.stockin += item.stockin;
                            existingItem.stockout += item.stockout;
                            existingItem.available_stock += item.available_stock;
                        } else {
                            acc.push({ ...item });
                        }

                        return acc;
                    }, []);

                    // Set headers and return the response
                    res.setHeader('Content-Range', `expenses ${offset}-${offset + aggregatedResults.length}/${total}`);
                    res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
                    res.json(aggregatedResults);
                }
            });
        }
    });
};


const singleProduct = (req, res) => {
    const { id } = req.params;
    const query = `SELECT p.*, c.name as categoryName, i.name as itemName, s.name as supplierName
         FROM products p
        JOIN category c
        ON p.category_id = c.id
        JOIN items i
        On p.item_id = i.id
        JOIN supplier s
        ON p.supplier_id = s.id WHERE p.id = ?`;
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

const AddProduct = (req, res) => {
    const {
        item_id, price, stockin, supplier_id, expire_date, description, note
    } = req.body;

    const stockout = 0;
    const available_stock = parseFloat(stockin) - parseFloat(stockout);

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



        // Insert new product into the products table
        const query = `
            INSERT INTO products (item_id, category_id, price, stockin, stockout, available_stock, supplier_id, expire_date, description, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [item_id, category_id, price, stockin, stockout, available_stock, supplier_id, expire_date, description, note];

        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({ success: true, message: "Data added successfully", id: result.insertId });
        });
    });
};



const EditProduct = (req, res) => {
    const { id } = req.params;
    const {
        item_id, price, stockin, stockout, supplier_id, expire_date, description, note
    } = req.body;

    console.log('stock in', stockin)
    console.log('stock out', stockout)

    const available_stock = parseFloat(stockin) - parseFloat(stockout);

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

        console.log('category id', category_id);
        console.log('available stock', available_stock);

        // Update the products table
        const query = `
            UPDATE products 
            SET item_id = ?,
                category_id = ?,
                price = ?,
                stockin = ?,
                stockout = ?,
                available_stock = ?,
                supplier_id = ?,
                expire_date = ?,
                description = ?,
                note = ?
            WHERE id = ?`;

        db.query(query, [item_id, category_id, price, stockin, stockout, available_stock, supplier_id, expire_date, description, note, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data not found" });
            }

            res.json({ message: "Product updated successfully", id: id });
        });
    });
};



const deleteProduct = (req, res) => {
    const { id } = req.params;



    const query = 'DELETE FROM products WHERE id = ?';

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

module.exports = { Stock, singleProduct, AddProduct, EditProduct, deleteProduct }