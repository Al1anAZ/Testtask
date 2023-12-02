import MyButton from "../UI/MyButton";
import classes from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={classes.header}>
      <div className="container">
        <div className={classes.header_body}>
          <img
            src="/imgs/UI/Logo.svg"
            alt="header_body_img"
            className={classes.header_img}
          />
          <span className={classes.header_body_btns_box}>
            <MyButton handle={() => {}}>Users</MyButton>
            <MyButton handle={() => {}}>Sing up</MyButton>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
