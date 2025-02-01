const express = require('express');
const {getData, postData} = require('../controllers/faqController');

const router = express.Router();

router.post('/faqs',postData);
router.get('/faqs',getData);

module.exports = router;