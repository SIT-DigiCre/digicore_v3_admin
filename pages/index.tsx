import Link from "next/link";
import { Card, Stack } from "react-bootstrap";

const HomePage = () => {
  return (
    <>
      <h1>デジコア管理</h1>
      <Stack className="mt-4" gap={3}>
        <Card>
          <Card.Body>
            <Card.Title>部員一覧</Card.Title>
            <Card.Text>
              学事課に提出ための部員一覧情報を確認できます。
            </Card.Text>
            <Card.Link href="/list" as={Link}>
              部員一覧
            </Card.Link>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>サーバー情報</Card.Title>
            <Card.Text>
              サーバーの稼働状況やリソース使用率を確認できます。
            </Card.Text>
            <Card.Link href="/serverinfo" as={Link}>
              サーバー情報
            </Card.Link>
          </Card.Body>
        </Card>
      </Stack>
    </>
  );
};

export default HomePage;
