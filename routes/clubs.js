const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wdc.studentclub@gmail.com',
    pass: 'gkcyxusviubohoak'
  }
});


function sendEmail(to, subject, text) {
  let mailOptions = {
    from: 'wdc.studentclub@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

router.get('/', (req, res) => {
  let user_id;
  if (req.session.user) {
    user_id = req.session.user.id;
  } else {
    user_id = 0;
  }
  const sql = `
    SELECT clubs.id AS club_id, clubs.name AS club_name, clubs.logo_url, clubs.description, events.id AS event_id, events.title AS event_name, events.event_time,
      CASE WHEN user_event_rsvps.event_id IS NULL THEN 0 ELSE 1 END AS has_rsvp
    FROM clubs
    LEFT JOIN events ON clubs.id = events.club_id
    LEFT JOIN user_event_rsvps ON events.id = user_event_rsvps.event_id AND user_event_rsvps.user_id = ?
    ORDER BY clubs.id, events.event_time
  `;
  db.query(sql, user_id, (error, results) => {
    if (error) throw error;

    let clubs = [];
    let currentClub;

    results.forEach((row) => {
      if (!currentClub || currentClub.id !== row.club_id) {
        currentClub = {
          id: row.club_id,
          name: row.club_name,
          description: row.description,
          logo_url: row.logo_url,
          events: []
        };
        clubs.push(currentClub);
      }

      if (row.event_id) {
        currentClub.events.push({
          id: row.event_id,
          name: row.event_name,
          date: row.date,
          hasRSVP: Boolean(row.has_rsvp)
        });
      }
    });
    res.json(clubs);
  });
});

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

router.get('/:id', async (req, res) => {
  let club_id = req.params.id;
  let user_id = req.session.user ? req.session.user.id : 0;

  const clubQuery = `
    SELECT clubs.id AS club_id, clubs.name AS club_name, clubs.description, user_clubs.is_manager,
      events.id AS event_id, events.title AS event_title, events.event_time, events.description AS event_description,
      CASE WHEN user_clubs.club_id IS NULL THEN 0 ELSE 1 END AS is_member,
      CASE WHEN user_event_rsvps.event_id IS NULL THEN 0 ELSE 1 END AS has_rsvp
    FROM clubs
    LEFT JOIN events ON clubs.id = events.club_id
    LEFT JOIN user_event_rsvps ON events.id = user_event_rsvps.event_id AND user_event_rsvps.user_id = ?
    LEFT JOIN user_clubs ON clubs.id = user_clubs.club_id AND user_clubs.user_id = ?
    WHERE clubs.id = ?
    ORDER BY clubs.id, events.event_time
  `;

  const postsQuery = `
    SELECT id, is_private, title, description, updated_at
    FROM club_posts
    WHERE club_id = ?
    ORDER BY is_private, updated_at DESC
  `;

  const usersQuery = `
    SELECT users.id AS id, username, email, user_clubs.is_manager, user_clubs.created_at AS joined_at
    FROM users
    INNER JOIN user_clubs ON user_clubs.user_id = users.id AND user_clubs.club_id = ?
    ORDER BY joined_at DESC
  `;

  const eventUsersQuery = `
    SELECT users.id AS id, username, users.email
    FROM users
    INNER JOIN user_event_rsvps ON user_event_rsvps.user_id = users.id AND user_event_rsvps.event_id = ?
    ORDER BY username
  `;

  const [clubResults, postsResults, usersResults] = await Promise.all([
    runQuery(clubQuery, [user_id, user_id, club_id]),
    runQuery(postsQuery, [club_id]),
    runQuery(usersQuery, [club_id])
  ]);

  let club = {
    id: club_id,
    name: clubResults[0].club_name,
    description: clubResults[0].description,
    is_manager: clubResults[0].is_manager,
    is_member: clubResults[0].is_member,
    events: [],
    club_posts: [],
    users: []
  };

  let eventPromises = clubResults.map(async (row) => {
    if (row.event_id) {
      let event = {
        id: row.event_id,
        title: row.event_title,
        description: row.event_description,
        event_time: row.event_time,
        hasRSVP: Boolean(row.has_rsvp),
        showAttendees: false,
        users: []
      };
      if (row.is_manager) {
        let eventUsersResult = await runQuery(eventUsersQuery, [row.event_id]);
        eventUsersResult.forEach((user_row) => {
          event.users.push({
            id: user_row.id,
            username: user_row.username,
            email: user_row.email
          });
        });
      }
      return event;
    }
    return null;
  });

  club.events = await Promise.all(eventPromises);
  club.events = club.events.filter((event) => !!event);

  postsResults.forEach((row) => {
    if (!row.is_private || club.is_member) {
      club.club_posts.push({
        id: row.id,
        title: row.title,
        description: row.description,
        updated_at: row.updated_at,
        is_private: Boolean(row.is_private)
      });
    }
  });

  usersResults.forEach((row) => {
    if (club.is_manager) {
      club.users.push({
        id: row.id,
        email: row.email,
        username: row.username
      });
    }
  });

  res.json(club);
});

router.post('/:id/posts', (req, res) => {
  const user_id = req.session.user.id;
  const club_id = req.params.id;
  const { description, is_private } = req.body;

  const sql = `
    INSERT INTO club_posts (description, is_private, club_id, user_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [description, is_private, club_id, user_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error creating post' });
      return;
    }
    const fetchUsersSql = `
      SELECT users.email, clubs.name as club_name
      FROM user_clubs
      INNER JOIN users ON user_clubs.user_id = users.id
      INNER JOIN clubs ON user_clubs.club_id = clubs.id
      WHERE user_clubs.club_id = ? AND user_clubs.notify_updates = 1
    `;

    db.query(fetchUsersSql, [club_id], (_, user_results) => {
      // Send emails to members
      for (let user of user_results) {
        sendEmail(user.email, `New post in ${user.club_name}`, `A new post has been made in your club. ${description}`);
      }
    });
    res.status(200).json(results.insertId);
  });
});

router.put('/:id/events/:event_id', (req, res) => {
  const { title, description, event_time } = req.body;
  const id = req.params.event_id;
  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_time = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, event_time, id], (error, result) => {
    if (error) {
      res.status(500).send('An error occurred while updating the event');
    } else {
      res.send('Event updated successfully');
    }
  });
});

router.post('/:id/events', (req, res) => {
  const { title, description, event_time } = req.body;
  const club_id = req.params.id;

  const sql = `
    INSERT INTO events (title, description, event_time, club_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [title, description, event_time, club_id], (error, result) => {
    if (error) {
      res.status(500).send('Error creating event');
      return;
    }

    const fetchUsersSql = `
      SELECT users.email, clubs.name as club_name
      FROM user_clubs
      INNER JOIN users ON user_clubs.user_id = users.id
      INNER JOIN clubs ON user_clubs.club_id = clubs.id
      WHERE user_clubs.club_id = ? AND user_clubs.notify_events = 1
    `;

    db.query(fetchUsersSql, [club_id], (_, user_results) => {
      // Send emails to members
      for (let user of user_results) {
        sendEmail(user.email, `New event in ${user.club_name}`, `A new event has been created in your club. ${title} - ${description}`);
      }
    });
    res.status(200).json(result.insertId);
  });
});

router.post('/:id/join', (req, res) => {
  const user_id = req.session.user ? req.session.user.id : 0;
  const club_id = req.params.id;

  if (user_id === 0) {
    res.status(401).json({ message: 'Please register first' });
    return;
  }

  const sql = `
    INSERT INTO user_clubs (user_id, club_id)
    VALUES (?, ?)
  `;

  db.query(sql, [user_id, club_id], (error, results) => {
    if (error) throw error;
    res.status(200).json({ message: 'Successfully joined the club' });
  });
});

router.post('/:id/events/:event_id/rsvp', (req, res) => {
  const user_id = req.session.user ? req.session.user.id : 0;
  const { event_id } = req.params;
  const club_id = req.params.id;

  if (user_id === 0) {
    res.status(401).json({ message: 'Please register first' });
    return;
  }

  const userClubsQuery = `
    SELECT * FROM user_clubs
    WHERE user_id = ? AND club_id = ?
  `;

  db.query(userClubsQuery, [user_id, club_id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Server error' });
    } else if (results.length > 0) {
      const rsvpQuery = `
        INSERT INTO user_event_rsvps (user_id, event_id)
        VALUES (?, ?)
      `;

      db.query(rsvpQuery, [user_id, event_id], (err, _) => {
        if (err) {
          res.status(500).json({ message: 'Server error' });
        } else {
          let user = {
            id: req.session.user.id,
            username: req.session.user.username,
            email: req.session.user.email
          };
          res.json(user);
        }
      });
    } else {
      res.status(401).json({ message: 'Please join first' });
    }
  });
});

module.exports = router;
