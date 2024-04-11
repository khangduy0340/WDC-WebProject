var express = require('express');
var router = express.Router();
const db = require('../db');
/* Argon2 hashing + salting */
const argon2 = require('argon2');

router.get('/users', async (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const usersQuery = `SELECT * FROM users`;
  db.query(usersQuery, function (error, results, fields) {
    if (error) {
      res.status(500).send({ error: 'Error fetching users from database' });
    } else {
      res.json(results);
    }
  });
});

router.get('/clubs', async (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const clubsQuery = `
    SELECT clubs.id, clubs.name, clubs.description, clubs.logo_url, users.username
    FROM clubs
    LEFT JOIN user_clubs ON user_clubs.club_id = clubs.id AND user_clubs.is_manager = 1
    LEFT JOIN users ON user_clubs.user_id = users.id
  `;
  db.query(clubsQuery, function (error, results, fields) {
    if (error) {
      res.status(500).send({ error: 'Error fetching clubs from database' });
    } else {
      let clubs = [];
      let currentClub;
      results.forEach((row) => {
        if (!currentClub || currentClub.id !== row.id) {
          currentClub = {
            id: row.id,
            name: row.name,
            description: row.description,
            logo_url: row.logo_url,
            showManagers: false,
            managers: []
          };
          clubs.push(currentClub);
        }

        if (row.username) {
          currentClub.managers.push({
            username: row.username
          });
        }
      });
      res.json(clubs);
    }
  });
});

router.post('/users', async (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  let {
    username, phone, first_name, last_name, email, password, is_admin
  } = req.body;
  password = await argon2.hash(password);
  const insertUserQuery = `
    INSERT INTO users
    (username, phone, first_name, last_name, email, password, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    insertUserQuery,
    [username, phone, first_name, last_name, email, password, is_admin],
    function(error, _) {
    if (error) {
      res.status(500).send({ error: 'Error in inserting new user into database' });
    } else {
      res.status(200).json({ message: 'User created successfully.' });
    }
  });
});

router.put('/users/:id', async (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const { id } = req.params;
  let {
    username, phone, first_name, last_name, email, is_admin
  } = req.body;
  const updateQuery = `
      UPDATE users
      SET username = ?, phone = ?, first_name = ?, last_name = ?, email = ?, is_admin = ? WHERE id = ?
  `;

  db.query(
    updateQuery,
    [username, phone, first_name, last_name, email, is_admin, id],
    function (error, results) {
      if (error) {
        res.status(500).send({ error: 'Error updating user in database' });
      } else {
        res.status(200).json({ message: 'User saved successfully.' });
      }
  });
});

router.post('/clubs', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const club = req.body;
  const insertClubQuery = `
    INSERT INTO clubs
    (name, description, logo_url)
    VALUES (?, ?, ?)`;

  db.query(insertClubQuery, [club.name, club.description, club.logo_url], function(error, results) {
    if (error) {
      res.status(500).send({ error: 'Error in inserting new club into database' });
    } else {
      res.status(200).json({ message: 'club created successfully.' });
    }
  });
});

router.put('/clubs/:id', async (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const { id } = req.params;
  const { name, description, logo_url } = req.body;
  const updateQuery = `
      UPDATE clubs
      SET name = ?, description = ?, logo_url = ? WHERE id = ?
  `;

  db.query(updateQuery, [name, description, logo_url, id], function (error, results) {
      if (error) {
        res.status(500).send({ error: 'Error updating club in database' });
      } else {
        res.status(200).json({ message: 'Club saved successfully.' });
      }
  });
});

router.post('/user_clubs', (req, res) => {
  if (!req.session.user || !req.session.user.is_admin) {
    res.sendStatus(403);
    return;
  }

  const user_club = req.body;
  const insertClubQuery = `
    INSERT INTO user_clubs (user_id, club_id, is_manager)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      user_id = VALUES(user_id),
      club_id = VALUES(club_id),
      is_manager = VALUES(is_manager)
  `;

  db.query(
    insertClubQuery,
    [user_club.user_id, user_club.club_id, user_club.is_manager],
    function(error, results) {
      if (error) {
        res.status(500).send({ error: 'Error in inserting new manager into database' });
      } else {
        res.status(200).json({ message: 'manager created successfully.' });
      }
    }
  );
});


module.exports = router;
