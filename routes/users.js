var express = require('express');
var router = express.Router();
const db = require('../db');
/* Argon2 hashing + salting */
const argon2 = require('argon2');

function runQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

/* GET current user */
router.get('/current', async (req, res) => {
  let { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const userQuery = 'SELECT id AS id, first_name, last_name, email, phone, username FROM users WHERE id = ?';
  const userResult = await runQuery(userQuery, [user.id]);
  let user_details = userResult[0];

  const userClubsQuery = 'SELECT clubs.id AS id, clubs.name, user_clubs.notify_events, user_clubs.notify_updates FROM clubs JOIN user_clubs ON clubs.id = user_clubs.club_id WHERE user_clubs.user_id = ? ORDER BY clubs.name';
  user_details.clubs = await runQuery(userClubsQuery, [user.id]);

  const userEventsQuery = 'SELECT events.id AS id, events.event_time, events.title FROM events JOIN user_event_rsvps ON events.id = user_event_rsvps.event_id WHERE user_event_rsvps.user_id = ? ORDER BY events.event_time';
  user_details.events = await runQuery(userEventsQuery, [user.id]);

  res.json(user_details);
});

router.put('/current', async (req, res) => {
  let { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  let { first_name, last_name, phone } = req.body;
  const updateQuery = 'UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?';
  await runQuery(updateQuery, [first_name, last_name, phone, user.id]);
  res.json({ message: 'User details updated successfully' });
});

router.put('/current/password', async (req, res) => {
  let { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  let { password } = req.body;
  password = await argon2.hash(password);
  const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
  await runQuery(updateQuery, [password, user.id]);
  res.json({ message: 'Password changed successfully' });
});

router.put('/current/clubs/:id', async (req, res) => {
  let { user } = req.session;
  if (!user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }
  const { notify_updates, notify_events } = req.body;
  const club_id = req.params.id;

  const query = `
      UPDATE user_clubs
      SET notify_updates = ?, notify_events = ?
      WHERE user_id = ? AND club_id = ?
  `;

  const result = await db.query(query, [notify_updates, notify_events, user.id, club_id]);

  if (result.affectedRows === 0) {
      res.status(400).send({ message: 'You are not a member of this club.' });
  } else {
      res.send({ message: 'Update successful.' });
  }
});

module.exports = router;
