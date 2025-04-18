import type { User } from "@/pages/api/user";

export const gradeMap: Record<number, string> = {
  1: "1年",
  2: "2年",
  3: "3年",
  4: "4年",
  5: "修1",
  6: "修2",
  7: "博1",
  8: "博2",
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // 日本の携帯電話番号 (090, 080, 070 から始まる11桁) の場合
  if (/^(090|080|070)\d{8}$/.test(phoneNumber)) {
    return phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  }

  // 固定電話番号 (市外局番が1~4桁、7~8桁の番号) の場合
  if (/^(0\d{1,4})(\d{1,4})(\d{4})$/.test(phoneNumber)) {
    return phoneNumber.replace(/^(0\d{1,4})(\d{1,4})(\d{4})$/, "$1-$2-$3");
  }

  // フォーマットに合わない場合はそのまま返す
  return phoneNumber;
};

export const formatParentName = (user: User): string => {
  const familyName = user.firstName;
  if (typeof user.parentName === "string") {
    // 全角スペースがあればそのまま返す
    if (user.parentName.includes("　")) {
      return user.parentName;
    }
    // 半角スペースがあれば全角スペースに変換して返す
    if (user.parentName.includes(" ")) {
      return user.parentName.replace(/ /g, "　");
    }
    // スペースがないとき、親子の姓が同じ場合は、子の姓の文字数を参考にスペースを入れる
    const parentFamilyName = user.parentName.slice(0, familyName.length);
    if (familyName === parentFamilyName) {
      return `${user.firstName}　${user.parentName.slice(familyName.length)}`;
    }
  }
  // これ以外はそのまま返す
  return user.parentName;
};
