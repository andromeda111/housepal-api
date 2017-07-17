const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jwt-simple')
const passport	= require('passport');
require('../config/passport')(passport);
const moment = require('moment');

router.get('/house', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting /list');
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let allChores = []
    db('chores').where({house_id: decoded.house_id}).then(result => {
      console.log('before');
      allChores = result

        allChores.forEach(obj => {
          console.log(obj.currentDueDay.currentDueDay);
          if (obj.dueToday === false && obj.late === false) {
            console.log('Not due today, and not late');
            let result;
            if (moment(moment().add(1, 'day')).isSame(obj.currentDueDay.currentDueDay, 'day')) {
              // console.log(moment().day(obj.currentDueDay.currentDueDay, 'day'));
              console.log('same day');
              obj.dueToday = true
            }
            if (moment(moment().add(1, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
              obj.dueToday = true
              obj.late = true
            }
          }
          if (obj.dueToday === true && moment(moment().add(1, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
            obj.late = true
          }
          db('chores').where({id: obj.id}).update(obj).then(() => {})
        })

        console.log('after');
        console.log(allChores);

        db('chores').where({house_id: decoded.house_id}).then(result => {
          console.log('DONE - ready to send JSON');
          console.log(result);
          res.json(result)
        })




    })







  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

//
// router.put('/done/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
//
//   let token = getToken(req.headers);
//   if (token) {
//     let decoded = jwt.decode(token, process.env.JWT_SECRET);
//
//     let id = req.params.id
//
//     db('chores').where({id}).update({done:})
//     .then((updatedItem) => {
//       res.status(200).json(req.body)
//     })
//
//
//
//   } else {
//     return res.status(403).send({success: false, msg: 'No token provided.'});
//   }
// });




//working
// router.get('/house', passport.authenticate('jwt', { session: false}), function(req, res, next) {
//   console.log('hitting /list');
//   let token = getToken(req.headers);
//   if (token) {
//     let decoded = jwt.decode(token, process.env.JWT_SECRET);
//
//     let allChores = []
//     db('chores').where({house_id: decoded.house_id}).then(result => {
//
//
//       console.log('before');
//       console.log('Hitting route ', result);
//       // console.log('current day: ', moment().add(1, 'day'));
//       allChores = result
//         allChores.forEach(obj => {
//           console.log(obj.currentDueDay.currentDueDay);
//           if (obj.dueToday === false && obj.late === false) {
//             console.log('both false');
//             let result;
//             if (moment(moment().add(1, 'day')).isSame(moment(moment().add(1, 'day')).day(obj.currentDueDay.currentDueDay, 'day'))) {
//               console.log(moment().day(obj.currentDueDay.currentDueDay, 'day'));
//               console.log('same day');
//               obj.dueToday = true
//             }
//             if (moment(moment().add(1, 'day')).isAfter(moment(moment().add(1, 'day')).day(obj.currentDueDay.currentDueDay, 'day'))) {
//               obj.dueToday = true
//               obj.late = true
//             }
//           }
//           if (obj.dueToday === true && moment(moment().add(1, 'day')).isAfter(moment(moment().add(1, 'day')).day(obj.currentDueDay.currentDueDay, 'day'))) {
//             obj.late = true
//           }
//           db('chores').where({id: obj.id}).update(obj).then(() => {})
//         })
//
//         console.log('after');
//         console.log(allChores);
//
//         db('chores').where({house_id: decoded.house_id}).then(result => {
//           console.log('DONE - ready to send JSON');
//           console.log(result);
//           res.json(result)
//         })
//
//
//
//
//     })
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//   } else {
//     return res.status(403).send({success: false, msg: 'No token provided.'});
//   }
// });

router.post('/new', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let newChore = req.body
    newChore.house_id = decoded.house_id

    db('chores').insert(newChore).returning('*').then(postedChore => {
      postedChore[0].cycle.cycleList.forEach(el => {
        db('users_chores').insert({user_id: el, chore_id: postedChore[0].id}).then(() => {
          console.log('posted to join');
        })
      })
      res.json(postedChore);
    })
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }

});


getToken = function (headers) {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
