const db = require("../bd");

class accountController {
  async getOneAccount(req, res) {
    let id_account = req.params.id;
    id_account = id_account.slice(1);
    const oneAccount = await db.query(
      "select * from account a left join person p on p.id_person = a.id_person where id_account = $1",
      [id_account]
    );
    const phone_numbers = await db.query(
      "select phone_number from phone_number where id_person = $1",
      [id_account]
    );
    res.json({
      mainInfo: oneAccount.rows[0],
      phoneNumbers: phone_numbers.rows,
    });
  }

  async getAllAccounts(req, res) {
    const oneAccount = await db.query(
      `select a.id_person, a.photo_url, p.first_name, p.midle_name, p.second_name from account a
      left join person p on p.id_person = a.id_person 
      where a.is_deleted_acc = false
      order by a.id_person`
    );
    res.json(oneAccount.rows);
  }

  async editAccount(req, res) {
    let id_account = req.params.id;
    id_account = id_account.slice(1);
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
      const data = await db.query(
        `SELECT * FROM account WHERE email= $1 and id_account != $2;`,
        [email, id_account]
      );

      const arr = data.rows;
      if (arr.length != 0) {
        return res.json({
          error: "Email is already used",
        });
      } else {
        const updatedPers = await db.query(
          `UPDATE person SET (first_name, midle_name, second_name, birthdate, job_phone_num, department, post, workplace, about_me) = ($1, $2, $3, $4, $5, $6, $7, $8, $9) where id_person = $10`,
          [
            first_name,
            midle_name,
            sec_name,
            birthdate,
            job_phone_num,
            department,
            post,
            workplace,
            about_me,
            id_account,
          ]
        );
        const updatedAcc = await db.query(
          `UPDATE account SET (email, password, is_show_bd, is_show_num, photo_url) = ($1, $2, $3, $4, $5) where id_account = $6`,
          [email, password, is_show_bd, is_show_num, photo_url, id_account]
        );
        const phones = await db.query(
          `DELETE FROM phone_number WHERE id_person = $1`,
          [id_account]
        );
        if (phone_number.length) {
          await phone_number.forEach((element) => {
            db.query(`INSERT INTO phone_number VALUES ($1,$2)`, [
              element,
              id_account,
            ]);
          });
        }
        return res.json({
          message: "user changed",
        });
      }
    } catch (err) {
      res.status(500).json({ error: "database error" });
    }
  }

  async deleteAccount(req, res) {
    let id_account = req.params.id;
    id_account = id_account.slice(1);
    const { state } = req.body;

    const changedAcc = await db.query(
      `UPDATE account set is_deleted_acc = $1 where id_account = $2;`,
      [state, id_account]
    );
  }
}

module.exports = new accountController();
