const db = require("../bd");

class loginController {
  async register(req, res) {
    const {
      email,
      password,
      first_name,
      midle_name,
      sec_name,
      birthdate,
      job_phone_num,
      phone_number,
      is_show_bd,
      is_show_num,
      department,
      post,
      workplace,
      about_me,
      photo_url,
    } = req.body;
    try {
      let id = await db.query("SELECT max(id_account) FROM account");
      id = id.rows[0].max + 1;
      const data = await db.query(`SELECT * FROM account WHERE email= $1;`, [
        email,
      ]);

      const arr = data.rows;
      if (arr.length != 0) {
        return res.json({
          error: "Email is already used",
        });
      } else {
        const newPers = await db.query(
          `INSERT INTO person values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
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
          ]
        );
        const newAcc = await db.query(
          `INSERT INTO account values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
          [
            id,
            id,
            email,
            password,
            is_show_bd,
            is_show_num,
            photo_url,
            false,
            false,
          ]
        );
        phone_number.map(async (number, index) => {
          const newPhone = await db.query(
            `insert into phone_number values ($1,$2);`,
            [phone_number[index], id]
          );
        });
        return res.json({
          message: "new user created",
          id: id,
        });
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const data = await db.query(
        `SELECT id_account, email, password, is_deleted_acc FROM account WHERE email = $1;`,
        [email]
      );
      const user = data.rows;
      if (user.length === 0) {
        res.json({ error: "User is not exist" });
      } else {
        if (user[0].is_deleted_acc === true) {
          res.json({ error: "User deleted" });
        } else {
          if (user[0].password == password) {
            res.json({
              message: "User signed in",
              id: user[0].id_account,
            });
          } else {
            res.json({ error: "Incorrect password" });
          }
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
        `SELECT id_account, email, password FROM account WHERE email = $1 AND is_admin = true;`,
        [email]
      );

      const user = data.rows;
      if (user.length === 0) {
        res.json({ error: "Admin is not exist" });
      } else {
        if (user[0].password == password) {
          res.json({
            message: "Admin signed in",
            id: user[0].id_account,
          });
        } else {
          res.json({ error: "Incorrect password" });
        }
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }
}

module.exports = new loginController();
