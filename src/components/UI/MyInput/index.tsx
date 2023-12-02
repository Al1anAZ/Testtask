import { useState } from "react";
import classes from "./MyInput.module.scss";

type MyInputProps = {
  label?: string;
  checked?: boolean;
  type: string;
  legend: string;
  helper?: string;
  valid: boolean;
  value?: number; //для выбора нужной позиции за его айди для radio
  name: string;
  chosenImg?: string; //для отображения выбраного файла для file
  handle: (action: string, e: React.ChangeEvent<HTMLInputElement>) => void; //заполенине формы
};
const MyInput: React.FC<MyInputProps> = ({
  legend,
  label,
  helper,
  type,
  checked,
  value,
  name,
  chosenImg,
  valid,
  handle,
}) => {
  //Стейт отвечающий за анимацию инпута txt
  const [labelAnim, setLabelAnim] = useState<boolean>(false);
  //функция для получения названия файла
  function getFileNameFromPath(filePath: string) {
    const pathParts = filePath.split(/[\\\/]/);

    const fileName = pathParts[pathParts.length - 1];

    return fileName;
  }
  return (
    <>
      {/* Условный рендеринг на основе типа ввода */}
      {/* Рендеринг текстового ввода */}
      {type === "text" ? (
        <span
          className={`${classes.myInput_box_text} ${valid && classes.error}`}
        >
          <label
            htmlFor={name}
            className={`${classes.myInput_box_text_label} ${
              labelAnim && classes.active
            }`}
          >
            {legend}
          </label>
          <input
            required
            type={type}
            className={classes.myInput_box_text_input}
            name={name}
            id={name}
            onFocus={() => {
              setLabelAnim(true);
            }}
            onBlur={(e) => {
              if (!e.target.value) setLabelAnim(false);
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handle(name, e)
            }
          />
          <span className={classes.myInput_box_text_helper}>
            {valid && helper}
          </span>
        </span>
      ) : // Рендеринг радио-кнопки
      type === "radio" ? (
        <span className={classes.myInput_box_radio}>
          <input
            required
            type={type}
            id={label}
            name={name}
            value={value}
            className={classes.myInput_box_radio_input}
            defaultChecked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handle(name, e)
            }
          />
          <label htmlFor={label} className={classes.myInput_box_radio_label}>
            {label}
          </label>
        </span>
      ) : (
        // Рендеринг файла
        <span
          className={`${classes.myInput_box_file} ${valid && classes.error}`}
        >
          <input
            required
            id="fileInput"
            type="file"
            accept="image/jpg, image/jpeg"
            className={classes.myInput_box_file_input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handle(name, e);
            }}
          />
          <label htmlFor="fileInput" className={classes.myInput_box_file_label}>
            {/* Кнопка загрузки файла */}
            <button className={classes.myInput_box_file_label_button}>
              <p>Upload</p>
            </button>
            {/* Сообщение об ошибке для файла */}
            <span className={classes.myInput_box_file_label_file_errormes}>
              {valid &&
                `Min size 70x70px. The photo size must not be greater than 5 Mb.`}
            </span>
            {/* Отображение имени выбранного файла */}
            <div className={classes.myInput_box_file_label_file_box}>
              <p
                className={classes.myInput_box_file_label_file_text}
                style={{ color: `${chosenImg && "black"}` }}
              >
                {chosenImg
                  ? getFileNameFromPath(chosenImg)
                  : `Upload your photo `}
              </p>
            </div>
          </label>
        </span>
      )}
    </>
  );
};

export default MyInput;
