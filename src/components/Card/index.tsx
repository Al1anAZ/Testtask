import { useState } from "react";
import { IUser } from "../../models/user";
import classes from "./Card.module.scss";

// Компонент Card принимает IUser в качестве свойств
const Card: React.FC<IUser> = ({ name, email, phone, position, photo }) => {
  // Состояние для отслеживания ошибки при загрузке изображения
  const [errorImg, setErrorImg] = useState<boolean>(false);

  // Функция для обрезки текста, если он превышает определенную длину
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // Функция для отображения подсказки, если текст превышает определенную длину
  const renderTooltip = (text: string, maxLength: number) => {
    return (
      text.length > maxLength && (
        <div className={classes.card_tooltip}>{text}</div>
      )
    );
  };

  // Обрезанный текст для отображения
  const truncatedName = truncateText(name, 20);
  const truncatedPosition = truncateText(position, 20);
  const truncatedEmail = truncateText(email, 23);

  return (
    // Контейнер для тела карточки
    <div className={classes.card_body}>
      {/* Отображение изображения по умолчанию, если возникла ошибка при загрузке фото */}
      {errorImg ? (
        <img
          src="./imgs/UI/photo-cover.svg"
          alt="card_img"
          className={classes.card_img}
          width={70}
          height={70}
        />
      ) : (
        // Отображение фотографии пользователя, обработка ошибок загрузки изображения
        <img
          src={photo}
          alt="card_img"
          onError={() => setErrorImg(true)}
          className={classes.card_img}
          width={70}
          height={70}
        />
      )}
      <div
        className={classes.card_name}
        style={{ cursor: `${truncatedName.length > 20 && "pointer"}` }}
      >
        <p>{truncatedName}</p>
        {/* Отображение подсказки для полного имени */}
        {renderTooltip(name, 20)}
      </div>
      <br />
      <span className={classes.card_desc_box}>
        <div
          className={classes.card_desc_job}
          style={{ cursor: `${truncatedPosition.length > 20 && "pointer"}` }}
        >
          <p>{truncatedPosition}</p>
          {/* Отображение подсказки для полной должности */}
          {renderTooltip(position, 20)}
        </div>
        <br />
        <div
          className={classes.card_desc_email}
          style={{ cursor: `${truncatedEmail.length > 23 && "pointer"}` }}
        >
          <p>{truncatedEmail}</p>
          {/* Отображение подсказки для полной электронной почты */}
          {renderTooltip(email, 23)}
        </div>
        <p className={classes.card_desc_phone}>{phone}</p>
      </span>
    </div>
  );
};

// Экспорт компонента Card
export default Card;
