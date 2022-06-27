const db = require("../bd");

class accessController {
  async createAccess(req, res) {
    const { id_access, id_giver, id_reciver, state, data } = req.body;
    const newAccess = await db.query(
      `insert into access values ($1, $2, $3, $4, $5)`,
      [id_access, id_giver, id_reciver, state, data]
    );
    res.json(newAccess.rows);
  }
  async getAllAccess(req, res) {
    const allAccess = await db.query("select * from access");
    res.json(allAccess.rows);
  }
  async getOneAccess(req, res) {
    const id = req.params.id;
    const allAccess = await db.query(
      "select * from access where id_access = $1",
      id
    );
    res.json(allAccess.rows[0]);
  }
  async updateAccess(req, res) {
    const { id, state } = req.body;
    const access = await db.query(
      "UPDATE access SET state = $1 where id_access = $2 RETURNING *",
      [state, id]
    );
    res.json(access.rows[0]);
  }
}

module.exports = new accessController();
