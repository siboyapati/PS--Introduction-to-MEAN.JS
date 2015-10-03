'use strict';

/**
 * Module dependencies.
 */
var sendgrid = require('sendgrid')('meanjs_demo', 'gRzaKU7pv9ND'); 

/**
 * Create a Email
 */
exports.create = function(req, res) {
    console.log(req.body);
    var email = new sendgrid.Email({
        to: 'psvolunteer.signups@gmail.com',
        from: req.body.email,
        subject: 'Volunteer Sign-up',
        text: req.body.message
    });

    sendgrid.send(email, function(err, json) {
        if (err) {
            return res.status(400).send('Error');
        }
        return res.status(200).send('Success');       
    });

};
