import { queryDb } from "@/util/db";
import { GetServerSideProps } from "next";
import { Row, Table } from "react-bootstrap";
import { User } from "./api/user";

type Props = {
  users: User[];
  error?: string;
};

const ListPage = ({ users, error }: Props) => {
  return (
    <>
      <h1>部員一覧</h1>
      {error && (
        <Row>
          <p style={{ color: "red" }}>{error}</p>
        </Row>
      )}
      <Row>
        <div className="overflow-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>学籍番号</th>
                <th>学年</th>
                <th>性別</th>
                <th>氏名</th>
                <th>電話番号</th>
                <th>緊急連絡先氏名</th>
                <th>緊急連絡先電話番号</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.studentNumber}</td>
                  <td>{user.schoolGrade}</td>
                  <td>{user.isMale ? "男" : "女"}</td>
                  <td>
                    {user.firstName}　{user.lastName}
                  </td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.parentName}</td>
                  <td>{user.parentCellphoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Row>
    </>
  );
};

export default ListPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const rows = await queryDb(
      `SELECT 
      BIN_TO_UUID(users.id) as id, 
      student_number, 
      username, 
      school_grade, 
      icon_url, 
      discord_userid, 
      active_limit, 
      short_introduction,
      first_name,
      last_name,
      first_name_kana,
      last_name_kana,
      is_male,
      phone_number,
      address,
      parent_name,
      parent_cellphone_number,
      parent_homephone_number,
      parent_address
    FROM 
      users 
    LEFT JOIN 
      user_profiles 
    ON 
      users.id=user_profiles.user_id 
    LEFT JOIN 
      user_private_profiles 
    ON 
      users.id=user_private_profiles.user_id`
    );
    const users: User[] = rows.map((r) => {
      return {
        id: r.id,
        studentNumber: r.student_number,
        username: r.username,
        schoolGrade: r.school_grade,
        iconUrl: r.icon_url,
        discordUserId: r.discord_userid,
        activeLimit: r.active_limit.toLocaleString("ja-JP"),
        shortIntroduction: r.short_introduction,
        firstName: r.first_name,
        lastName: r.last_name,
        firstNameKana: r.first_name_kana,
        lastNameKana: r.last_name_kana,
        isMale: r.is_male == 1 ? true : false,
        phoneNumber: r.phone_number,
        address: r.address,
        parentName: r.parent_name,
        parentCellphoneNumber: r.parent_cellphone_number,
        parentHomephoneNumber: r.parent_homephone_number,
        parentAddress: r.parent_address,
      };
    });

    const props: Props = {
      users,
    };

    return {
      props: props,
    };
  } catch (e: any) {
    return {
      props: { users: [], error: e.message },
    };
  }
};
