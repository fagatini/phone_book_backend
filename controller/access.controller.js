const db = require("../bd");

class accessController {
  async createAccess(req, res) {
    const { id_giver, id_reciver } = req.body;
    let id = await db.query("SELECT max(id_access) FROM access");
    id = id.rows[0].max + 1;

    let date = new Date();

    const newAccess = await db.query(
      `insert into access values ($1, $2, $3, 'аwaiting', $4)`,
      [id, id_giver, id_reciver, date]
    );
    res.json(newAccess.rows[0]);
  }

  async updateAccess(req, res) {
    const { id_access, state } = req.body;
    const new_access = await db.query(
      "UPDATE access SET state = $2 where id_access = $1",
      [id_access, state]
    );
  }

  async getAllAccess(req, res) {
    let id = req.params.id;
    id = id.slice(1);
    const allAccesses = await db.query(
      `select p.first_name, p.second_name, a.id_access from access a
      left join person p on p.id_person = a.id_giver
      where a.id_receiver = $1 and a.state='аwaiting'`,
      [id]
    );
    res.json(allAccesses.rows);
  }

  async getOneAccess(req, res) {
    let id = req.params.id;
    id = id.slice(1);
    const { id_giver } = req.body;
    const oneAccesses = await db.query(
      `select state from access
      where id_receiver = $1 and id_giver = $2`,
      [id, id_giver]
    );
    if (oneAccesses.rowCount) {
      res.json(oneAccesses.rows[0]);
    } else {
      res.json({ state: "notExist" });
    }
  }

  async getAllAccessAdmin(req, res) {
    const allAccesses = await db.query(
      `select p.first_name, p.second_name, a.id_access, pt.first_name as recFN, pt.second_name as recSN, a.state, a.data from access a
      left join person p on p.id_person = a.id_giver
      left join person pt on pt.id_person = a.id_receiver
      order by a.id_access`
    );
    res.json(allAccesses.rows);
  }
}

module.exports = new accessController();
