const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_login_db');
const {UUID, UUIDV4, STRING} = Sequelize;

const User = conn.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  username: {
    type: STRING,
    unique: true
  },
  password: {
    type: STRING,
  }
});

const syncAndSeed = async () =>{
  await conn.sync({force: true});

  const [moe, lucy] = await Promise.all([
    {
      username: 'moe',
      password: 'MOE1'
    },
    {
      username: 'lucy',
      password: 'LUCY2'
    }
  ].map(user => User.create(user)))
}

module.exports = {
  syncAndSeed,
  models: {
    User
  }
};
