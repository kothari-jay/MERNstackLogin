const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {

  app.post('/api/account/signin', (req, res, next) => {
    const {
      body
    } = req;
    const {
      password
    } = body;

    let {
      email
    } = body;
    if (!email) {
      return res.send({
        success: false,
        message: 'Error : Email cannot be blank'
      });
    }
    if (!password) {
      res.end({
        success: false,
        message: 'Error : Password cannot be blank'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error : Email does not exists'
        })
      } else if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error : Email Invalid'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error : Invalid Password'
        });
      }

      const userSession = new UserSession;
      userSession.userID = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error : Email does not exists'
          })
        }
        return res.send({
          success: true,
          message: 'Valid Sign in',
          token: doc._id
        });
      });
    });
  });

  app.post('/api/account/signup', function(req, res, next) {
    const {
      body
    } = req;
    const {
      firstName,
      lastName,
      password
    } = body;

    let {
      email
    } = body;
    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error : Missing First Name'

      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error : Missing lastName'

      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error : Missing email'

      });
    }
    if (!password) {
      res.end({
        success: false,
        message: 'Error : Missing password'

      });
    }
    email = email.toLowerCase();
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send('Error: Server Error')
      } else if (previousUsers.length > 0) {
        return res.send('Error:Account already exists.');
      }
      const newUser = new User();

      newUser.email = email;
      newUser.firstName = newUser.encryptText(firstName);
      newUser.lastName = newUser.encryptText(lastName);
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'server Error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed Up'
        });
      });
    });
  });

  app.get('/api/account/verify', (req, res, next) => {
    //get token
    const {
      query
    } = req;
    const {
      token
    } = query;
    // verify token is one of a kind

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      };
    });
  });

  app.get('/api/account/logOut', (req, res, next) => {
    const {
      query
    } = req;
    const {
      token
    } = query;
    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server Error'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      };
    });


  });

};
