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

            if (moment(moment().add(1, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {

              // CYLE DAYS

            let nextDayDue;
            let nextDays;
            nextDays = obj.daysDue.daysDue.filter(day => {
              // console.log('day in arr', moment(moment().add(1, 'day')).day(day,'day').format('YYYY-MM-DD'));
              let blah = moment(moment().add(1, 'day')).day(day,'day').format('YYYY-MM-DD')
              if (moment(blah).isAfter(obj.currentDueDay.currentDueDay, 'day') && moment(blah).isSame(moment(moment().add(1, 'day')), 'day') && !obj.late) {
                return true
              } else if (moment(blah).isAfter(obj.currentDueDay.currentDueDay, 'day') && moment(blah).isAfter(moment(moment().add(1, 'day')), 'day')) {
                return true
              }
            })


            //   if (moment(blah).isAfter(obj.currentDueDay.currentDueDay, 'day') && moment(blah).isSameOrAfter(moment(moment().add(1, 'day')), 'day')) {
            //     return true
            //   }
            // })

            console.log('nextDays after set: ', nextDays);


            if (nextDays.length > 0) {
              nextDayDue = moment().add(1, 'day').day(nextDays[0], 'day')
            } else {
              console.log('check: ', moment(moment().add(1, 'day')).isAfter(moment(moment().add(1, 'day')).day(obj.daysDue.daysDue[0], 'day')));
              if (moment(moment().add(1, 'day')).isAfter(moment(moment().add(1, 'day')).day(obj.daysDue.daysDue[0], 'day'))) {
              nextDayDue = moment(moment().add(1, 'day')).add(1, 'weeks').day(obj.daysDue.daysDue[0], 'day');
              } else {
                nextDayDue = moment().add(1, 'day').day(obj.daysDue.daysDue[0], 'day')

              }
            }


            obj.currentDueDay.currentDueDay = nextDayDue.format("YYYY-MM-DD")
            obj.currentDueDay.currentDueIdx = nextDueIdx

            // If today is After the current due date:
            if (moment(moment().add(1, 'day')).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
              console.log('today is after the due date');
              } else {
                obj.dueToday = false
              }

              obj.late = false
              obj.done = false

              // CYCLE HOUSEMATES
              let nextCycle = 0
              console.log('cycle length: ', obj.cycle.cycleList.length);
              // Get the Index of the next due day
              if (obj.cycle.cycleList.length > 1) {
                console.log('checking next cycle idx');
                if (!obj.cycle.cycleList[obj.currentAssigned + 1]) {
                  console.log('idx reset');
                  nextCycle = 0
                } else {
                  console.log('idx +1');
                  nextCycle = obj.currentAssigned + 1
                }
              }

              obj.currentAssigned = nextCycle
            }
            console.log('END of DONE currentDueDay: ', obj.currentDueDay.currentDueDay);
          }



          // Once done is false
          console.log('Current Due Day: ', obj.currentDueDay.currentDueDay);
          let currDay = moment().add(1, 'day').format('YYYY-MM-DD')
          if (obj.dueToday === false && obj.late === false) {
            console.log('Not due today, and not late');
            console.log(obj.currentDueDay.currentDueDay);
            console.log(currDay);
            let result;
            if (moment(currDay).isSame(obj.currentDueDay.currentDueDay, 'day')) {
              // console.log(moment().day(obj.currentDueDay.currentDueDay, 'day'));
              console.log('same day');
              obj.dueToday = true
            }
            if (moment(currDay).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
              obj.dueToday = true
              obj.late = true
            }
          }
          if (obj.dueToday === true && moment(currDay).isAfter(obj.currentDueDay.currentDueDay, 'day')) {
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

router.get('/getById/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting /list');

  let id = req.params.id
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let chore = []
    db('chores').where({id}).then(result => {
      console.log('router result: ', result);
      chore = result[0]
      res.json(chore)
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


router.put('/updateChore/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let editedChore = req.body
    let choreId = req.params.id

    db('users_chores').where({chore_id: choreId}).del().then(()=> {
      db('chores').where({id: choreId}).update(editedChore).returning('*').then(updatedChore => {
        updatedChore[0].cycle.cycleList.forEach(el => {
          db('users_chores').insert({user_id: el, chore_id: updatedChore[0].id}).then(() => {
            console.log('posted to join');
            res.json(updatedChore);
          })
        })
      })
    })

  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }

});

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

router.delete('/delete/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  console.log('hitting route');
  console.log('body: ', req.body);
  let token = getToken(req.headers);
  if (token) {
    let decoded = jwt.decode(token, process.env.JWT_SECRET);

    let delChoreId = req.params.id
    console.log(delChoreId);

    db('chores').where({id: delChoreId}).del('*').returning('*').then(delChore => {
      console.log('deleted: ', delChore);
      res.status(200);
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
