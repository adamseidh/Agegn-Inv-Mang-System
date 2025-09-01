const db = require("../../db");

const StockCapital = (req, res) => {
  const query = `
    SELECT 
      p.*,  
      i.name, 
      i.image as itemImage,
      c.name as categoryName, 
      sp.name AS supplierName, 
      pt.name AS typeName,
      COALESCE((
        SELECT SUM(s.quantity) 
        FROM sells_product s 
        WHERE s.product_id = p.id
      ), 0) AS sold_quantity,
      p.quantity - COALESCE((
        SELECT SUM(s.quantity) 
        FROM sells_product s 
        WHERE s.product_id = p.id
      ), 0) AS available_quantity
    FROM product_list p
    LEFT JOIN items i ON p.item_id = i.id
    LEFT JOIN category c ON i.category_id = c.id
    LEFT JOIN product_type pt ON i.type_id = pt.id
    LEFT JOIN purchase_list pl ON p.purchase_id = pl.id
    LEFT JOIN supplier sp ON pl.supplier_id = sp.id
    WHERE p.quantity - COALESCE((
      SELECT SUM(s.quantity) 
      FROM sells_product s 
      WHERE s.product_id = p.id
    ), 0) > 0`;

  db.query(query, (err, results) => {
    if (err) {
      console.log("error", err);
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
};

module.exports = { StockCapital };
