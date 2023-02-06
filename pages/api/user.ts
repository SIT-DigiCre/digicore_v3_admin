import { queryDb } from "@/util/db";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: string;
  studentNumber: string;
  username: string;
  schoolGrade: number;
  iconUrl: string;
  discordUserId: string;
  activeLimit: string;
  shortIntroduction: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  isMale: boolean;
  phoneNumber: string;
  address: string;
  parentName: string;
  parentCellphoneNumber: string;
  parentHomephoneNumber: string;
  parentAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      activeLimit: r.active_limit,
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
      parentAddress: r.parentAddress,
    };
  });
  res.status(200).json(users);
}
