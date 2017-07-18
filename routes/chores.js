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
          console.log('init current due idx: ', obj.currentDueDay.currentDueIdx);
          console.log(obj.daysDue.daysDue[obj.currentDueDay.currentDueIdx + 1]);
          console.log('IN OBJ');


          // Check if Chore is Done, and update/cycle
          // Get next index of daysDue
          if (obj.done) {
            let nextDueIdx = 0
            console.log('DAYS DUE LENGTH ', obj.daysDue.daysDue.length);
            // Get the Index of the next due day
            if (obj.daysDue.daysDue.length > 1) {
              console.log('checking next idx');
              if (!obj.daysDue.daysDue[obj.currentDueDay.currentDueIdx + 1]) {
                console.log('idx reset');
                nextDueIdx = 0
              } else {
                console.log('idx +1');
                nextDueIdx = obj.currentDueDay.currentDueIdx + 1
              }
            }
            // If Today is after the current Due Date
            console.log('is today after the curr due date: ', moment(moment().add(1, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day'));
            if (moment(moment().add(8, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {



            let nextDayDue;
            let nextDays;
            nextDays = obj.daysDue.daysDue.filter(day => {
              console.log('day in arr', moment(moment().add(8, 'day')).day(day,'day').format('YYYY-MM-DD'));
              let blah = moment(moment().add(8, 'day')).day(day,'day').format('YYYY-MM-DD')
              console.log('due date', obj.currentDueDay.currentDueDay);
              console.log('today: ', moment(blah).isAfter(moment(moment().add(8, 'day')), 'day'));
              if (moment(blah).isAfter(obj.currentDueDay.currentDueDay, 'day') && moment(blah).isAfter(moment(moment().add(8, 'day')), 'day')) {
                return true
              }
            })

            console.log('nextDays after set: ', nextDays);


            if (nextDays.length > 0) {
              nextDayDue = moment().add(8, 'day').day(nextDays[0], 'day')
            } else {
              console.log('check: ', moment(moment().add(8, 'day')).isAfter(moment(moment().add(8, 'day')).day(obj.daysDue.daysDue[0], 'day')));
              if (moment(moment().add(8, 'day')).isAfter(moment(moment().add(8, 'day')).day(obj.daysDue.daysDue[0], 'day'))) {
              nextDayDue = moment(moment().add(8, 'day')).add(1, 'weeks').day(obj.daysDue.daysDue[0], 'day');
              } else {
                nextDayDue = moment().add(8, 'day').day(obj.daysDue.daysDue[0], 'day')

              }
            }


            obj.currentDueDay.currentDueDay = nextDayDue.format("YYYY-MM-DD")
            obj.currentDueDay.currentDueIdx = nextDueIdx

            // If today is After the current due date:
            if (moment(moment().add(8, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
              console.log('today is after the due date');
              } else {
                obj.dueToday = false
              }

              obj.late = false
              obj.done = false

            }
            console.log('END of DONE currentDueDay: ', obj.currentDueDay.currentDueDay);
          }



          // Once done is false
          console.log('Current Due Day: ', obj.currentDueDay.currentDueDay);
          if (obj.dueToday === false && obj.late === false) {
            console.log('Not due today, and not late');
            let result;
            if (moment(moment().add(8, 'day')).isSame(obj.currentDueDay.currentDueDay, 'day')) {
              // console.log(moment().day(obj.currentDueDay.currentDueDay, 'day'));
              console.log('same day');
              obj.dueToday = true
            }
            if (moment(moment().add(8, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
              obj.dueToday = true
              obj.late = true
            }
          }
          if (obj.dueToday === true && moment(moment().add(8, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
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


router.put('/done', passport.authenticate('jwt', { session: false}), function(req, res, next) {

  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let id = req.body.id
    console.log('id: ', id);

    db('chores').where({id}).update({done: true})
    .then(doneChore => {
      res.json(doneChore)
    })



  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});




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
