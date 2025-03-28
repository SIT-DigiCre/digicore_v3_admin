import { queryDb } from "@/util/db";
import { GetServerSideProps } from "next";
import { Row, Table } from "react-bootstrap";

type Props = {
  error?: string;
  dbMbSizes: { name: string; mbSize: number }[];
  storageMbSize: number;
};

const ServerInfoPage = (props: Props) => {
  if (props.error)
    return (
      <>
        <h1>サーバー情報</h1>
        <Row>
          <p style={{ color: "red" }}>{props.error}</p>
        </Row>
      </>
    );
  else {
    return (
      <>
        <h1>サーバー情報</h1>
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>DB NAME</th>
                <th>DB SIZE (MB)</th>
              </tr>
            </thead>
            <tbody>
              {props.dbMbSizes.map((db) => (
                <tr key={db.name}>
                  <td>{db.name}</td>
                  <td>{db.mbSize}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </>
    );
  }
};

export default ServerInfoPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const rows = await queryDb(`SELECT
  table_schema, sum(data_length+index_length) /1024 /1024 AS MB
FROM
  information_schema.tables
GROUP BY
  table_schema
ORDER BY
  sum(data_length+index_length) DESC;`);
    const dbMbSizes = rows.map((r) => {
      return { name: r.TABLE_SCHEMA, mbSize: r.MB };
    });
    console.log(dbMbSizes);
    const props: Props = {
      dbMbSizes,
      storageMbSize: 0,
    };

    return {
      props: props,
    };
  } catch (e: any) {
    return {
      props: {
        error: e.message,
        dbMbSizes: [],
        StorageMbSize: 0,
      },
    };
  }
};
