const express = require('express');
const router = express.Router();
const db = require('../db')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'cp-server' });
});

router.get('/data', function(req, res, next) {
  db('houses').then(result => {
    console.log(result);
    res.json(result);
  })
});

router.get('/list', function(req, res, next) {
  db('shopping-list-items').then(result => {
    console.log('Hitting route ', result);
    res.json(result);
  })
});

router.put('/list/:id', function(req, res, next) {
  const id = req.params.id
  const item = req.body
  console.log('router req.body: ', item);
  db('shopping-list-items').where({id: id}).update({buyer: item.buyer})
  .then((updatedItem) => {
    res.status(200).json(req.body)
  })
});

router.delete('/list/:id', function(req, res, next) {
  const id = req.params.id
  console.log('router id: ', id);
  db('shopping-list-items').where({id: id}).del().returning('*')
  .then((thisItem) => {
    res.status(210).json(thisItem)
  })
});

module.exports = router;
