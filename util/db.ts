import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
connection.connect((err) => {
  if (err) {
    console.log(`error connecting: ${err.stack}`);
    return;
  }
  console.log("success");
});

export const queryDb = async (
  queryStr: string
): Promise<mysql.RowDataPacket[]> => {
  return new Promise((resolve, reject) => {
    connection.query(queryStr, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      const rows: mysql.RowDataPacket[] = results as mysql.RowDataPacket[];
      resolve(rows);
    });
  });
};
