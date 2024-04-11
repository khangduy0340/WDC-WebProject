/* eslint linebreak-style: ["error", "windows"] */
var express = require('express');
var router = express.Router();

const CLIENT_ID = '675129490712-rhpaqt34mjopqit25qckfmtken16p5rk.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/* Argon2 hashing + salting */
const argon2 = require('argon2');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/event', function (req, res, next) {
  req.pool.getConnection(function (err, connection) {
    connection.release();
    // Handle Error
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT clubs.name, events.club_id,events.title,events.event_time,events.description FROM events INNER JOIN clubs ON events.club_id = clubs.id ;', function (err1, rows) {
      if (err1) {
        res.status(500);
        return;
      }
      res.json(rows);
    });
  });
});
router.get('/loggedin', function (req, res, next) {
  if (req.session.user === undefined || !req.session) {
    let loggedIn = false;
    res.json({ loggedIn });
  } else {
    let loggedIn = true;
    res.json({ loggedIn });
  }
});

router.get('/getname', function (req, res, next) {
  var text = JSON.parse(JSON.stringify(req.session.user));
  res.send(text.username);
});

/* Register an account */
router.post('/register', async function (req, res, next) {
  if ('client_id' in req.body && 'credential' in req.body) {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();

    // Get username from the Google email
    let username = payload.email.split('@')[0];

    req.pool.getConnection(function (cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }

      // Check if username and email are unique
      let uniqueness_query = "SELECT * FROM users WHERE username = ? OR email = ?";

      connection.query(uniqueness_query, [username, payload.email], function (qerr, rows, fields) {
        if (qerr) {
          res.sendStatus(401);
          return;
        }

        if (rows.length > 0) {
          res.status(401).send("Email already exists: please try a different google account");
        }
      });


      let query = `INSERT INTO users (
      username,
      phone,
      mobile,
      first_name,
      last_name,
      email,
      password,
      created_at,
      updated_at,
      is_admin,
      student_id
    ) VALUES (
      ?,
      NULL,
      NULL,
      ?,
      ?,
      ?,
      NULL,
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP(),
      false,
      NULL
    );`;

      connection.query(query, [username, payload.given_name,
        payload.family_name, payload.email], function (qerr, rows, fields) {

          connection.release();

          if (qerr) {
            res.sendStatus(401);
            return;
          }

          res.end();
        });
    });
  } else if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
    req.pool.getConnection(async function (cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }

      // Check if username and email are unique
      let uniqueness_query = "SELECT * FROM users WHERE username = ? OR email = ?";

      connection.query(uniqueness_query, [req.body.username,
      req.body.email], function (qerr, rows, fields) {

        if (qerr) {
          res.sendStatus(401);
          return;
        }

        if (rows.length > 0) {
          res.status(401).send("Username or email already exists: please try a different username or email");
        }
      });

      // Hash + Salt password
      const hash = await argon2.hash(req.body.password);

      let query = `INSERT INTO users (
      username,
      phone,
      mobile,
      first_name,
      last_name,
      email,
      password,
      created_at,
      updated_at,
      is_admin,
      student_id
      ) VALUES (
        ?,
        NULL,
        NULL,
        NULL,
        NULL,
        ?,
        ?,
        CURRENT_TIMESTAMP(),
        CURRENT_TIMESTAMP(),
        false,
        NULL
      );`;

      connection.query(query, [req.body.username, req.body.email,
        hash], function (qerr, rows, fields) {
          connection.release();

          if (qerr) {
            res.sendStatus(401);
            return;
          }
          res.end();
        });
    });
  } else {
    res.sendStatus(401);
  }
});

/* Login to an existing account */
router.post('/login', async function (req, res, next) {
  if ('client_id' in req.body && 'credential' in req.body) {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    req.pool.getConnection(function (cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }
      let query = "SELECT id, username, phone, mobile, first_name, last_name, email, created_at, updated_at, is_admin, student_id FROM users WHERE email = ?";
      connection.query(query, [payload.email], function (qerr, rows, fields) {
        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          [req.session.user] = rows;

          res.sendStatus(200);
        } else {
          res.status(401).send("account not created: please register an account first");
        }
      });
    });
  } else if ('email' in req.body && 'password' in req.body) {

    req.pool.getConnection(function (cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }

      let query = "SELECT id, username, phone, mobile, first_name, last_name, email, password, created_at, updated_at, is_admin, student_id FROM users WHERE email = ?";

      connection.query(query, [req.body.email], async function (qerr, rows, fields) {
        connection.release();

        if (qerr) {
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          if (await argon2.verify(rows[0].password, req.body.password)) {
            // password matches the hash + salt

            let [user_props] = rows;
            delete user_props.password;

            req.session.user = user_props;

            res.sendStatus(200);
          } else {
            // user exists but password does not match
            res.status(401).send("Username or password is incorrect");
          }

        } else {
          // username not found
          res.status(401).send("Username or password is incorrect");
        }
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/logout', function (req, res, next) {
  if (req.session.user) {
    delete req.session.user;
    res.end();
  } else {
    res.sendStatus(403);
  }
});

router.use('/', function (req, res, next) {
  if (!('user' in req.session)) {
    res.sendStatus(403);
  } else {
    next();
  }
});

router.post('/feedback', function (req, res, next) {
  let { fname, femail, ftext } = req.body;
  // Establish the connecttion
  req.pool.getConnection(function (err, connection) {
    if (err) {
      if (err) throw err;
      res.sendStatus(500);
      return;
    }
    let query = "INSERT INTO feedback (name,email,text) VALUES (?,?,?);";
    connection.query(query, [fname, femail, ftext], function (qerr, rows, fields) {
      connection.release();
      if (qerr) {
        res.sendStatus(401);
        return;
      }
      res.json({ success: true });
    });
  });
});

module.exports = router;
