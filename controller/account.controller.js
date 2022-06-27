const db = require("../bd");

class accountController {
  async register(req, res) {
    const {
      id_pers,
      first_name,
      midle_name,
      sec_name,
      birthdate,
      job_phone_num,
      department,
      post,
      workplace,
      about_me,
      id_acc,
      email,
      password,
      is_show_bd,
      is_show_num,
      photo_url,
      id_deleted,
      is_admin,
    } = req.body;
    try {
      // const id = 'select max(id)' // сделать запрос для поиска максимального id и для access
      const data = await db.query(`SELECT * FROM account WHERE email= $1;`, [
        email,
      ]);
      const arr = data.rows;
      if (arr.length != 0) {
        return res.status(400).json({
          error: "Email already used",
        });
      } else {
        const newAcc = await db.query(
          `insert into person values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
          insert into account values ($11, $12, $13, $14, $15, $16, $17, $18, $19);`,
          [
            id_pers,
            first_name,
            midle_name,
            sec_name,
            birthdate,
            job_phone_num,
            department,
            post,
            workplace,
            about_me,
            id_acc,
            id_pers,
            email,
            password,
            is_show_bd,
            is_show_num,
            photo_url,
            id_deleted,
            is_admin,
          ]
        );
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const data = await db.query(
        `SELECT id_account, email, password FROM account WHERE email = $1;`,
        [email]
      );
      const user = data.rows;
      if (user.length === 0) {
        res.status(400).json({ error: "User in not exist" });
      } else {
        if (user[0].password == password) {
          res.status(200).json({
            message: "User signed in",
            isAdmin: false,
            id: user[0].id_account,
          });
        } else {
          res.status(400).json({ error: "Incorrect password" });
        }
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }

  async loginAdmin(req, res) {
    const { email, password } = req.body;
    try {
      const data = await db.query(
        `SELECT id_account, email, password FROM account WHERE email = $1 and is_admin = true;`,
        [email]
      );
      const user = data.rows;
      if (user.length === 0) {
        res.status(400).json({ error: "User in not exist" });
      } else {
        if (user[0].password == password) {
          res.status(200).json({
            message: "User signed in",
            isAdmin: true,
            id: user[0].id_account,
          });
        } else {
          res.status(400).json({ error: "Incorrect password" });
        }
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }

  async getOneAccount(req, res) {
    const { id_account } = req.params.id;
    const oneAccount = await db.query(
      `select * from account a
      left join person p on p.id_person = a.id_person
      where id_account = $1 `,
      id_account
    );
    const phone_numbers = await db.query(
      `select * from phone_number 
      where id_person = $1 `,
      id_account
    );
    res.json({
      mainInfo: oneAccount.rows[0],
      phoneNumbers: phone_numbers.rows[0],
    });
  }

  async getAllAccounts(req, res) {
    const oneAccount = await db.query(
      `select * from account a
      left join person p on p.id_person = a.id_person`
    );
    res.json(oneAccount.rows);
  }

  async editAccount(req, res) {
    const { id } = req.params.id;
    const {
      first_name,
      midle_name,
      sec_name,
      birthdate,
      job_phone_num,
      department,
      post,
      workplace,
      about_me,
      email,
      password,
      is_show_bd,
      is_show_num,
      photo_url,
      id_deleted,
      is_admin,
    } = req.body;
    const newAcc = await db.query(
      `UPDATE account set (id_person, first_name, midle_name, second_name, birthdate, job_phone_num, department, post, workplace, about_me) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
      UPDATE account set (id_account,id_person,email,password,is_show_bd,is_show_num,photo_url,is_deleted_acc,is_admin) = ($11, $12, $13, $14, $15, $16, $17, $18, $19);`,
      [
        id,
        first_name,
        midle_name,
        sec_name,
        birthdate,
        job_phone_num,
        department,
        post,
        workplace,
        about_me,
        id,
        id,
        email,
        password,
        is_show_bd,
        is_show_num,
        photo_url,
        id_deleted,
        is_admin,
      ]
    );
    res.json(account.rows[0]);
  }

  // async deleteAccount(req, res) {
  //   const { id } = req.params.id;
  //   const { require_state } = req.body;
  //   const account = await db.query(
  //     "UPDATE account SET is_deleted_acc = $1 where id_account = $2 RETURNING *",
  //     [require_state, id]
  //   );
  //   res.json(account.rows[0]);
  // }

  async addNumber(req, res) {
    const { id } = req.params.id;
    const { new_number } = req.body;
    const phone_num = await db.query(
      "insert into phone_number values ($1,$2)",
      [new_number, id]
    );
  }

  async deleteNumber(req, res) {
    const { id } = req.params.id;
    const { number_for_delete } = req.body;
    const phone_num = await db.query(
      "delete from phone_number where id_person = $1 and phone_number = $2",
      [id, number_for_delete]
    );
  }

  async updateAccess(req, res) {
    const { id_giver } = req.params.id;
    const { id, id_receiver, new_state, data } = req.body;
    const new_access = await db.query(
      "UPDATE access SET (id_access, id_giver, id_receiver, state, data",
      [id, id_giver, id_receiver, new_state, data]
    );
  }

  async getAllAccess(req, res) {
    const { id_receiver } = req.params.id;
    const allAccesses = await db.query(
      `select * from access where id_receiver = $1`,
      [id_receiver]
    );
    res.json(allAccesses.rows);
  }
}

module.exports = new accountController();
