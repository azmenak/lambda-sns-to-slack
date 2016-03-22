var https = require('https');
var util = require('util');

exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, 2));
    console.log('From SNS:', event.Records[0].Sns.Message);

    // Modify these to whatever...
    var postData = {
        "channel": "#emails",
        "username": "Wall-E",
        "text": "*" + event.Records[0].Sns.Subject + "*",
        "icon_emoji": ":e-mail:"
    };

    var options = {
        method: 'POST',
        hostname: 'hooks.slack.com',
        port: 443,
        // Remove hispter-ness, add your Slack hook URL
        path: '/services/hiPsTER/IpSum/90sY0L0s1ngl3oRIGinC0f33'
    };

    var message = event.Records[0].Sns.Message;
    try {
        if (typeof message === 'string') {
            message = JSON.parse(message);
        }
        var attachment = {
            mrkdwn_in: ['text']
        };
        var text;
        var color;
        switch (message.notificationType) {
        case "Bounce":
            attachment.color = 'danger';
            break;
        case "Delivery":
            attachment.color = 'good';
            var sourceEmail = message.mail.source;
            var destinationEmails = message.mail.destination;
            var timestamp = new Date(message.mail.timestamp);

            postData.text = '*Email Delivery* from ' + sourceEmail;
            attachment.fields = [{
                title: 'Destination',
                value: destinationEmails.join(', '),
                short: true
            },{
                title: 'Timestamp',
                value: timestamp.toDateString() + '\nat ' + timestamp.toTimeString(),
                short: true
            }];
            break;
        default:
            attachment.color = '#B7BEC3';
            attachment.fields = [];
            for (var key in message) {
                attachment.fields.push({
                    title: key,
                    value: JSON.stringify(message[key]),
                    short: false
                });
            }
            break;
        }
        postData.attachments = [attachment];
    } catch (e) {
        console.log(e.message);
        postData.text = message;
    }

    var req = https.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        context.done(null);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.write(util.format("%j", postData));
    console.log(JSON.stringify(postData, null, 2));
    req.end();
};
