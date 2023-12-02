import { useEffect, useState } from "react";
import "./App.scss";
import Card from "./components/Card";
import Header from "./components/Header";
import MyButton from "./components/UI/MyButton";
import MyInput from "./components/UI/MyInput";
import { IUser } from "./models/user";
import axios from "axios";
import { IPosition } from "./models/positions";
import { Itoken } from "./models/token";

type ResponsePositions = {
  positions: IPosition[];
};
type RegisteringUserStatus = {
  status: "pending" | "loading" | "complete" | "error";
};
type ResponseUser = {
  success: boolean;
  page: number;
  total_pages: number;
  links: {
    next_url: string;
  };
  users: IUser[];
};
type formData = {
  name: string;
  validName: boolean;
  phone: string;
  validPhone: boolean;
  email: string;
  validEmail: boolean;
  position_id: number;
  photo: string;
  validPhoto: boolean;
};

const App = () => {
  //Стейт отвечающий за поля формы
  const [formData, setFormData] = useState<formData>({
    name: "",
    validName: false,
    phone: "",
    validPhone: false,
    email: "",
    validEmail: false,
    position_id: 1,
    validPhoto: false,
    photo: "",
  });
  //Стейт отвечающий за отображение прелоудера регистрации при запросе
  const [isRegisteringUser, setisRegisteringUser] =
    useState<RegisteringUserStatus>({ status: "pending" });
  //Стейт отвечающий за отображение прелоудера пользователей при запросе
  const [isFetchingUsers, setIsFetchingUsers] = useState<boolean>(false);
  //Стейт отвечающий за массив позиций
  const [positions, setPositions] = useState<IPosition[]>([]);
  //Стейт отвечающий за массив пользователей
  const [users, setUsers] = useState<IUser[]>([]);
  //Стейт отвечающий за хранение следующего запроса
  const [nextrequest, setNextRequest] = useState<string>(
    "https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6",
  );
  //хендлер для пост запроса
  const handleRegistrUser = async () => {
    try {
      setisRegisteringUser({ status: "loading" });
      const response = await axios.get<Itoken>(
        "https://frontend-test-assignment-api.abz.agency/api/v1/token",
      );
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("position_id", String(formData.position_id));
      form.append("photo", formData.photo);
      const { request } = await axios.post(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users",
        form,
        {
          headers: {
            Token: response.data.token,
          },
        },
      );
      setNextRequest(
        "https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6",
      );
      fetchUsers(true);
      setisRegisteringUser({ status: "complete" });
    } catch (e) {
      console.log(e);
      setisRegisteringUser({ status: "error" });
    }
  };
  // Хендлер для заполнения формы + валидация данных
  function handleSetFormData(
    action: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    switch (action) {
      case "name":
        setFormData({
          ...formData,
          name: e.target.value,
          validName: !(e.target.value.length > 1 && e.target.value.length < 60),
        });
        break;
      case "phone":
        const phoneValid = /^\+\d{1,4}\d{10}$/;
        setFormData({
          ...formData,
          phone: e.target.value,
          validPhone: !phoneValid.test(e.target.value),
        });
        break;
      case "email":
        const emainValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        setFormData({
          ...formData,
          email: e.target.value,
          validEmail: !emainValid.test(e.target.value),
        });
        break;
      case "position_id":
        setFormData({ ...formData, position_id: Number(e.target.value) });
        break;
      case "img":
        const file = e.target.files && e.target.files[0];
        if (file) {
          const img = new Image();
          img.onload = function () {
            const imageValid =
              file.type.startsWith("image/") &&
              file.size <= 5 * 1024 * 1024 && // проверка размера(5мб) картинки
              img.width >= 70 && // проверка ширины картинки
              img.height >= 70; // проверка высоты картинки

            setFormData({
              ...formData,
              photo: e.target.value,
              validPhoto: !imageValid,
            });
          };

          img.src = URL.createObjectURL(file);
        }
        break;
      default:
        break;
    }
  }
  //Получить пользователей из бд
  const fetchUsers = async (registr?: boolean) => {
    try {
      setIsFetchingUsers(true);
      //если зарегестрировался новый юзер, обновляем список юзеров и отображаем первую страницу
      if (registr) {
        const response = await axios.get<ResponseUser>(
          "https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6",
        );
        setUsers([...response.data.users]);
        setNextRequest(response.data.links.next_url);
      }
      //дефолтный запрос
      else {
        const response = await axios.get<ResponseUser>(nextrequest);
        setUsers([...users, ...response.data.users]);
        setNextRequest(response.data.links.next_url);
      }
      setIsFetchingUsers(false);
    } catch (e) {
      console.log(e);
    }
  };
  //Получить позиции для инпутов из бд
  const fetchPositions = async () => {
    try {
      const response = await axios.get<ResponsePositions>(
        "https://frontend-test-assignment-api.abz.agency/api/v1/positions",
      );
      setPositions(response.data.positions);
    } catch (e) {
      console.log(e);
    }
  };
  //Вызвать при первом рендере компонента
  useEffect(() => {
    fetchUsers();
    fetchPositions();
  }, []);
  return (
    <div className="App">
      <Header />
      <main className="main_body">
        <section className="main_body_landing">
          <div className="main_body_landing_contnent">
            <h1 className="main_body_landing_contnent_title">
              Test assignment for front-end developer
            </h1>
            <p className="main_body_landing_contnent_text">
              What defines a good front-end developer is one that has skilled
              knowledge of HTML, CSS, JS with a vast understanding of User
              design thinking as they'll be building web interfaces with
              accessibility in mind. They should also be excited to learn, as
              the world of Front-End Development keeps evolving.
            </p>
            <MyButton handle={() => {}}>Sign up</MyButton>
          </div>
        </section>
        <div className="container">
          <section className="main_body_working_withget">
            <div className="container">
              <div className="main_body_working_withget_content">
                <h1 className="main_body_working_withget_content_title">
                  Working with GET request
                </h1>
                <div className="main_body_working_withget_content_cardsbox">
                  {users.map((item) => (
                    <Card
                      id={item.id}
                      name={item.name}
                      phone={item.phone}
                      photo={item.photo}
                      position={item.position}
                      email={item.email}
                      key={item.id}
                    />
                  ))}
                </div>
                {/* Если мы ожидаем ответ, то показываем прелоадер */}
                <img
                  src="/imgs/UI/preLoader.svg"
                  alt="preLoader"
                  style={{ display: `${isFetchingUsers ? "block" : "none"}` }}
                  className="main_body_working_withget_content_preLoader"
                />
                {/* Если последняя страница в запросе, не рендерим кнопку */}
                {nextrequest && (
                  <MyButton
                    handle={() => {
                      fetchUsers();
                    }}
                    inlineStyle={{ width: 120 }}
                  >
                    Show more
                  </MyButton>
                )}
              </div>
            </div>
          </section>
          <section className="main_body_working_withpost">
            <div className="container">
              <div className="main_body_working_withpost_content">
                <h1 className="main_body_working_withpost_content_title">
                  {isRegisteringUser.status !== "complete" &&
                    `Working with GET request `}
                </h1>
                {/* //Прелоадер регистрации пользователя */}
                {isRegisteringUser.status === "loading" ? (
                  <img
                    src="/imgs/UI/preLoader.svg"
                    alt="preLoader"
                    className="main_body_working_withget_content_preLoader"
                  />
                ) : // Рендерим, если статус регистрации успешный
                isRegisteringUser.status === "complete" ? (
                  <div className="main_body_working_withget_content_success">
                    <h1 className="main_body_working_withget_content_success_title">
                      User successfully registered
                    </h1>
                    <img
                      src="/imgs/UI/success-image.svg"
                      alt="success-image"
                      className="main_body_working_withget_content_success_img"
                    />
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRegistrUser();
                    }}
                    className="main_body_working_withpost_content_form"
                  >
                    <div className="main_body_working_withpost_content_form_inputs_text">
                      <MyInput
                        valid={formData.validName}
                        legend="Your name"
                        name="name"
                        type="text"
                        helper="Username should contain 2-60 characters"
                        handle={handleSetFormData}
                      />
                      <MyInput
                        valid={formData.validEmail}
                        legend="Email"
                        type="text"
                        name="email"
                        helper="User email, must be a valid email according to RFC2822"
                        handle={handleSetFormData}
                      />
                      <MyInput
                        valid={formData.validPhone}
                        legend="Phone"
                        helper="+38 (XXX) XXX - XX - XX"
                        type="text"
                        name="phone"
                        handle={handleSetFormData}
                      />
                    </div>
                    <div className="main_body_working_withpost_content_form_inputs_radio">
                      <p className="main_body_working_withpost_content_form_inputs_radio_p">
                        Select your position
                      </p>
                      {/* Рендерим все позиции и первую позицию ставим выбраной по умолчанию  */}
                      {positions.map((item) => (
                        <MyInput
                          valid={true}
                          legend="position"
                          type="radio"
                          name="position_id"
                          label={item.name}
                          key={item.id}
                          value={item.id}
                          checked={item.id === 1}
                          handle={handleSetFormData}
                        />
                      ))}
                    </div>
                    <div className="main_body_working_withpost_content_form_inputs_file">
                      <MyInput
                        valid={formData.validPhoto}
                        legend="photo"
                        type="file"
                        name="img"
                        chosenImg={formData.photo}
                        label="Designer"
                        handle={handleSetFormData}
                      />
                    </div>
                    {/* Выключаем кнопку, если у нас поля инпутов пустые или не прошли валидацию */}
                    <MyButton
                      handle={() => {}}
                      disable={Boolean(
                        !formData.name ||
                          !formData.email ||
                          !formData.photo ||
                          !formData.phone ||
                          formData.validName ||
                          formData.validEmail ||
                          formData.validPhone ||
                          formData.validPhoto,
                      )}
                    >
                      Sign up
                    </MyButton>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
