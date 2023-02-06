import { Button } from "react-bootstrap";

const HomePage = () => {
  const onClick = () => {
    alert("クリックされた");
  };
  return (
    <>
      <Button onClick={onClick}> ボタン</Button>
    </>
  );
};

export default HomePage;
