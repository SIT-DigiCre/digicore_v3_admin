import mysql from "mysql2";
import { resolve } from "path";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "digicre",
  database: "digicre",
});
connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
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
