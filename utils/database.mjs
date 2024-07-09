import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Bhoj", "root", "Root1234@", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
