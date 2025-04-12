import { useState } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { queryDb } from "@/util/db";
import type { User } from "../api/user";

const EditUserPage = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState(user);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("ユーザー情報が更新されました。");
      router.push("/list");
    } else {
      alert("更新に失敗しました。");
      const errorData = await response.json();
      console.error("Error details:", errorData);
    }
  };

  return (
    <div>
      <h1>ユーザー情報編集</h1>
      <form onSubmit={handleSubmit}>
        <label>
          氏名:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          姓名:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          電話番号:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  if (!id) {
    return { notFound: true };
  }

  const rows = await queryDb(
    `SELECT * FROM users WHERE id = UUID_TO_BIN(${id})`
  );

  if (rows.length === 0) {
    return { notFound: true };
  }

  const user = rows[0];
  return { props: { user } };
};

export default EditUserPage;
