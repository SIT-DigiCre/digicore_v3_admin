import { queryDb } from "@/util/db";
import type { GetServerSideProps } from "next";
import { Row, Table } from "react-bootstrap";
import type { User } from "./api/user";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { formatParentName, formatPhoneNumber, gradeMap } from "@/util/format";

type Props = {
  users: User[];
  error?: string;
};

const ListPage = ({ users, error }: Props) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  useEffect(() => {
    const now = dayjs();
    if (showOnlyActive) {
      const activeUsers = users.filter((user) => {
        const activeLimit = dayjs(user.activeLimit);
        if (activeLimit.isValid()) {
          return activeLimit.isAfter(now);
        }
        return false;
      });
      setUserList(activeUsers);
    }
  }, [users, showOnlyActive]);

  return (
    <>
      <h1>部員一覧</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={(e) => setShowOnlyActive(e.target.checked)}
          />
          有効な部員のみ表示
        </label>
      </div>
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
                <th>編集</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.studentNumber}</td>
                  <td>{gradeMap[user.schoolGrade]}</td>
                  <td>{user.isMale ? "男" : "女"}</td>
                  <td>
                    {user.firstName}　{user.lastName}
                  </td>
                  <td>{formatPhoneNumber(user.phoneNumber)}</td>
                  <td>{formatParentName(user)}</td>
                  <td>{formatPhoneNumber(user.parentCellphoneNumber)}</td>
                  <td>
                    <a href={`/users/${user.id}`}>編集</a>
                  </td>
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
        isMale: r.is_male === 1,
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
  } catch (e: unknown) {
    return {
      props: { users: [], error: e },
    };
  }
};
