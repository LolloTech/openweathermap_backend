'use strict'
import knex from 'knex';
import config from '../../db/knexfile.cjs'
import bcrypt from 'bcryptjs'

class UserRepository {
  constructor () {
    this.db = knex(config.development);
  }

  async findByUsername (username) {
    return this.db('users').where({ username: username });
  }

  async findByUsernameAndPassword (username, password) {
    if (username == null || password == null) {
      return false;
    }
    const user = await this.db('users').where({ username: username }).catch((e) => console.error(e));
    const userEncryptedPass = (user.length && user[0].password) || '';
    const result = await bcrypt.compare(password, userEncryptedPass);

    return result;
  }

  async changePassword (username, oldPassword, newPassword) {
    if (username == null || oldPassword == null || newPassword == null) {
      return false;
    }
    const saltRounds = 3;
    const user = await this.findByUsername(username).catch((e) => console.error(e));
    const userEncryptedPassword = (user.length && user[0].password) || '';
    const isOldPassSameAsGivenInput = await bcrypt.compare(oldPassword, userEncryptedPassword);

    if (isOldPassSameAsGivenInput) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPass = await bcrypt.hash(newPassword, salt);

      await this
        .db('users')
        .where({ id: user[0].id })
        .update({ password: hashedPass })
        .catch((e) => console.error(e));
      return true;
    } else {
      return false;
    }
  }
}

export { UserRepository };
