import { queryDb } from "@/util/db";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { User } from "./api/user";

type Props = {
  users: User[];
};

type TableDataType = "id" | "icon" | "discord";
const allTableDataTypes: TableDataType[] = ["id", "icon", "discord"];
const UsersPage = ({ users }: Props) => {
  const [selectTypes, setSelectTypes] = useState<TableDataType[]>([]);
  const onCheckFilter = (checked: boolean, type: TableDataType) => {
    if (checked) setSelectTypes([...selectTypes, type]);
    else setSelectTypes(selectTypes.filter((t) => t !== type));
  };
  return (
    <div style={{ width: "90vw", margin: "auto" }} className="overflow-auto">
      {allTableDataTypes.map((t) => (
        <>
          <input
            type="checkbox"
            key={t}
            onChange={(e) => {
              onCheckFilter(e.target.checked, t);
            }}
          />
          {t}
        </>
      ))}
      <Table
        striped
        bordered
        hover
        style={{ tableLayout: "fixed", overflow: "scroll" }}
      >
        <thead>
          <tr>
            {/* 幅は調整中。細かい調整は後ほど。*/}
            {selectTypes.indexOf("id") !== -1 ? (
              <th style={{ width: 150 }}>ID</th>
            ) : (
              <></>
            )}
            <th className="table-th-studentNumber">学籍番号</th>
            <th className="table-th-username">ユーザー名</th>
            <th style={{ width: 30 }}>学年</th>
            {selectTypes.indexOf("icon") !== -1 ? (
              <th style={{ width: 66 }}>アイコン</th>
            ) : (
              <></>
            )}
            {selectTypes.indexOf("discord") !== -1 ? (
              <th style={{ width: 100 }}>Discord ID</th>
            ) : (
              <></>
            )}
            <th style={{ width: 100 }}>有効期限</th>
            <th style={{ width: 150 }}>自己紹介</th>
            <th className="table-th-name">名字</th>
            <th className="table-th-name">名前</th>
            <th className="table-th-name-kana">名字カナ</th>
            <th className="table-th-name-kana">名前カナ</th>
            <th style={{ width: 30 }}>性別</th>
            <th className="table-th-phoneNumber">電話番号</th>
            <th className="table-th-address">住所</th>
            <th style={{ width: 100 }}>親氏名</th>
            <th className="table-th-phoneNumber">親電話番号</th>
            <th className="table-th-phoneNumber">親固定電話番号</th>
            <th className="table-th-address">親住所</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {selectTypes.indexOf("id") !== -1 ? <td>{user.id}</td> : <></>}
              <td>{user.studentNumber}</td>
              <td>{user.username}</td>
              <td>{user.schoolGrade}</td>
              {selectTypes.indexOf("icon") !== -1 ? (
                <td>
                  <img src={user.iconUrl} alt="" style={{ width: "50px" }} />
                </td>
              ) : (
                <></>
              )}
              {selectTypes.indexOf("discord") !== -1 ? (
                <td>{user.discordUserId}</td>
              ) : (
                <></>
              )}
              <td>{user.activeLimit}</td>
              <td>{user.shortIntroduction}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.firstNameKana}</td>
              <td>{user.lastNameKana}</td>
              <td>{user.isMale ? "男" : "女"}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.address}</td>
              <td>{user.parentName}</td>
              <td>{user.parentCellphoneNumber}</td>
              <td>{user.parentHomephoneNumber}</td>
              <td>{user.parentAddress}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
      activeLimit: r.active_limit.toString(),
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
};
