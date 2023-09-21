const Database = require("../db/config");

module.exports = {
  async create(req, res) {
    const db = await Database();
    const pass = req.body.password;
    let roomId;
    let isRoom = true;

    while (isRoom) {
      // Gera o numero da sala
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString());
      }

      // Verificar se esse numero ja existe
      const roomsExistIds = await db.all(`SELECT id FROM rooms`);

      isRoom = roomsExistIds.some((roomsExistIds) => roomsExistIds === roomId);

      if (!isRoom) {
        // Inseri a sala no banco
        await db.run(`INSERT INTO rooms (
          id,
          pass
          ) VALUES (
          ${parseInt(roomId)},
          ${pass}
          )`);
      }
    }

    await db.close();

    res.redirect(`/room/${roomId}`);
  },

  async open(req, res) {
    const db = await Database();
    const roomId = req.params.room;
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    );
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    );
    let isNoQyestions

    if (questions.length == 0) {
      if (questionsRead.length == 0) {
        isNoQyestions = true
      }
    }

    res.render("room", {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isNoQyestions: isNoQyestions
    });
  },
  async enter(req, res) {
    const db = await Database();

    const roomId = req.body.roomId

    const roomsExistIds = await db.all(`SELECT id FROM rooms`);


    isRoom = roomsExistIds.some((roomsExistIds) => roomsExistIds.id == roomId);


    if (roomId.length != 6) {
      res.render('erropasss', { roomId: roomId })


    } else if (!isRoom) {

      res.render('errocode', { roomId: roomId })



    } else {

      res.redirect(`/room/${roomId}`)

    }


  }
};

