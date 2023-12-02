import classes from "./MyButton.module.scss";

type MyButtonProps = {
  children: React.ReactNode;
  handle: () => void;
  disable?: boolean;
  inlineStyle?: React.CSSProperties;
};

const MyButton: React.FC<MyButtonProps> = ({
  children,
  handle,
  disable = false,
  inlineStyle,
}) => {
  return (
    <button
      className={classes.mybtn}
      onClick={handle}
      disabled={disable}
      style={inlineStyle}
    >
      <p>{children}</p>
    </button>
  );
};

export default MyButton;
