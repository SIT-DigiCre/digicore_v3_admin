import { queryDb } from "@/util/db";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Container, Row, Form, Table } from "react-bootstrap";
import { User } from "./api/user";

type Props = {
  users: User[];
  error?: string;
};
type TableDataType = "公開情報" | "有効期限・ID" | "個人情報" | "保護者情報";

const allTableDataTypes: TableDataType[] = [
  "公開情報",
  "有効期限・ID",
  "個人情報",
  "保護者情報",
];

const defaultTableDataTypes: TableDataType[] = ["公開情報", "有効期限・ID"];

const kanjiNameStyle = {
  width: "100px",
};

const kanaNameStyle = {
  width: "125px",
};

const phoneNumberStyle = {
  width: "115px",
};

const addressStyle = {
  width: "200px",
};

const UsersPage = ({ users, error }: Props) => {
  const [selectTypes, setSelectTypes] = useState<TableDataType[]>([
    ...defaultTableDataTypes,
  ]);
  const onCheckFilter = (checked: boolean, type: TableDataType) => {
    if (checked) setSelectTypes([...selectTypes, type]);
    else setSelectTypes(selectTypes.filter((t) => t !== type));
  };
  return (
    <Container fluid>
      {error ? (
        <Row>
          <p style={{ color: "red" }}>{error}</p>
        </Row>
      ) : (
        <></>
      )}
      <Row>
        <div className="p-2">
          {allTableDataTypes.map((t) => (
            <Form.Check
              defaultChecked={defaultTableDataTypes.includes(t)}
              inline
              key={t}
              label={t}
              type="checkbox"
              id={t}
              onChange={(e) => {
                onCheckFilter(e.target.checked, t);
              }}
            />
          ))}
        </div>
      </Row>
      <Row>
        <div className="overflow-auto">
          <Table
            striped
            bordered
            hover
            style={{ tableLayout: "fixed", overflow: "auto" }}
          >
            <thead>
              <tr>
                <th style={{ width: "82px" }}>学籍番号</th>
                <th style={{ width: "125px" }}>ユーザー名</th>
                <th style={{ width: "30px" }}>学年</th>
                {selectTypes.indexOf("公開情報") !== -1 ? (
                  <>
                    <th style={{ width: 66 }}>アイコン</th>
                    <th style={{ width: 200 }}>自己紹介</th>
                  </>
                ) : (
                  <></>
                )}
                {selectTypes.indexOf("有効期限・ID") !== -1 ? (
                  <>
                    <th style={{ width: "100px" }}>有効期限</th>
                    <th style={{ width: "150px" }}>ID</th>
                    <th style={{ width: "100px" }}>Discord ID</th>
                  </>
                ) : (
                  <></>
                )}
                {selectTypes.indexOf("個人情報") !== -1 ? (
                  <>
                    <th style={kanjiNameStyle}>名字</th>
                    <th style={kanjiNameStyle}>名前</th>
                    <th style={kanaNameStyle}>名字カナ</th>
                    <th style={kanaNameStyle}>名前カナ</th>
                    <th style={{ width: "30px" }}>性別</th>
                    <th style={phoneNumberStyle}>電話番号</th>
                    <th style={addressStyle}>住所</th>
                  </>
                ) : (
                  <></>
                )}
                {selectTypes.indexOf("保護者情報") !== -1 ? (
                  <>
                    <th style={{ width: "100px" }}>親氏名</th>
                    <th style={phoneNumberStyle}>親電話番号</th>
                    <th style={phoneNumberStyle}>親固定電話番号</th>
                    <th style={addressStyle}>親住所</th>
                  </>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.studentNumber}</td>
                  <td>{user.username}</td>
                  <td>{user.schoolGrade}</td>
                  {selectTypes.indexOf("公開情報") !== -1 ? (
                    <>
                      <td>
                        <img
                          src={user.iconUrl}
                          alt=""
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>{user.shortIntroduction}</td>
                    </>
                  ) : (
                    <></>
                  )}
                  {selectTypes.indexOf("有効期限・ID") !== -1 ? (
                    <>
                      <td>{user.activeLimit}</td>
                      <td>{user.id}</td>
                      <td>{user.discordUserId}</td>
                    </>
                  ) : (
                    <></>
                  )}
                  {selectTypes.indexOf("個人情報") !== -1 ? (
                    <>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.firstNameKana}</td>
                      <td>{user.lastNameKana}</td>
                      <td>{user.isMale ? "男" : "女"}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.address}</td>
                    </>
                  ) : (
                    <></>
                  )}
                  {selectTypes.indexOf("保護者情報") !== -1 ? (
                    <>
                      <td>{user.parentName}</td>
                      <td>{user.parentCellphoneNumber}</td>
                      <td>{user.parentHomephoneNumber}</td>
                      <td>{user.parentAddress}</td>
                    </>
                  ) : (
                    <></>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  );
};

export default UsersPage;

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
