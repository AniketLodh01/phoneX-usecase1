export const userSignupQuery = () => {
  const query = `
      INSERT INTO user
        (username,
        email,
        password,
        address)
      VALUES (?)
      `;
  return query;
};
export const userSigninQuery = () => {
  const query = `
      SELECT 
        email,
        password
      FROM user
          WHERE email = ?
          AND password = ?
      LIMIT 1
      `;
  return query;
};
export const checkAuthorizedUserQuery = () => {
  const query = `
    SELECT 
      email,
      username
    FROM user
        WHERE email = ?
    LIMIT 1
    `;
  return query;
};

export const createItemQuery = () => {
  const query = `
    INSERT INTO items 
      (name, 
      quantity,
      price,
      status)
    VALUES (?)
    `;
  return query;
};

export const deleteItemQuery = () => {
  const query = `
    DELETE FROM items 
    WHERE id = (?)
    `;
  return query;
};

export const updateItemQuery = (fields) => {
  const query = `
    UPDATE items SET  
      ${fields}
    WHERE 
      id = ?
    `;
  return query;
};

export const getAllItemQuery = () => {
  const query = `
    SELECT 
      * 
    FROM items
    `;
  return query;
};

export const createOrderQuery = () => {
  const query = `
    INSERT INTO orders 
      (item, 
       order_status, 
       item_quantity,
       buyer)
    VALUES (?)
    `;
  return query;
};

export const deleteOrderQuery = () => {
  const query = `
    DELETE FROM orders 
    WHERE id = (?)
    `;
  return query;
};

export const updateOrderQuery = (fields) => {
  const query = `
    UPDATE orders SET  
      ${fields}
    WHERE 
      id = ?
    `;
  return query;
};

export const getAllOrderQuery = () => {
  const query = `
    SELECT 
      * 
    FROM orders
    `;
  return query;
};
