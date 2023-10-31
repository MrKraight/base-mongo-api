# base-mongo-api
    Видеодемонстрация: https://drive.google.com/file/d/1VFenj0nh1WfihfHhEDmacsTBv6a41Fi4/view
    Фронтенд: https://github.com/MrKraight/base-vue-front-for-mongo
    Базовый апи для бд mongo
    Задание: 

    Backend

    Нужно написать API для написания новостей. Должен быть реализован следующий функционал:
    *** Регистрация/авторизация пользователя. При авторизации пользователь на клиент получает JWT из которого можно получить id пользователя. 
    *** Авторизованному пользователю доступны endpoints для сущности news (должен быть middleware в котором будет проверка валидного токена)
    Можно создавать, редактировать, удалять и публиковать новость
    Настроить отложенную публикацию новости (по заданной автором новости дате-времени)

    Стек технологий:
    NodeJS
    Express
    MongoDB/Mongoose (mongoDb Atlas)
    JWT
    bcrypt (для хеширования пароля)

    настроить уведомления (real-time взаимодействие) при создании-изменении-удалении todo

    Инициализация:
    1. Скопируйте содержимое репозиторий на свою локальную машину
    2. Установите зависимости командой npm install
    3. Укажите данные своего подключения к базе MongoDB в файле .env
    4. (Опционально) Выполните сид командой node seed.js (Что именно добавилось в базу, можно посмотреть в файле seedData.js)
    5. Запустите сервер командой node index.js
    6. Установите и запустите фронт
    7. ...
    8. Profit!
