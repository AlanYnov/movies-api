const connection = require("../../config/db");

class Category {
    static checkIfCategoryExists(category) {
        return new Promise((resolve, reject) => {
          const query = `SELECT label FROM categories WHERE label = ?`;
          connection.query(query, category, (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results[0]);
            }
          });
        });
      }
}

module.exports = Category;