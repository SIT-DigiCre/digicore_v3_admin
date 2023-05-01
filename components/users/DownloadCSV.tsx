import { User } from "@/pages/api/user";
import { Button } from "react-bootstrap";
import { saveAs } from "file-saver";

type Props = {
  users: User[];
};
const DownloadCSV = ({ users }: Props) => {
  const onClickDownload = () => {
    const blob = new Blob(
      [
        users
          .map((u, i) => {
            let line = "";
            if (i == 0) {
              for (const key in u) {
                line += key + ",";
              }
              line = line.slice(0, -1);
              line += "\n";
            }
            const u2 = u as any;
            for (const key in u2) {
              line += u2[key] + ",";
            }
            line = line.slice(0, -1);
            return line;
          })
          .join("\n"),
      ],
      {
        type: "text/csv;charset=utf-8",
      }
    );
    saveAs(blob, `users-${new Date().toLocaleDateString()}.csv`);
  };
  return (
    <>
      <Button onClick={onClickDownload} disabled={users.length == 0}>
        CSVをダウンロード
      </Button>
    </>
  );
};

export default DownloadCSV;
