Lambda SNS-to-Slack
===================

I wanted to track when emails were being sent out... so this happened.
Mostly setup for SES delivery notificatons, but it's farily easy to
parse anything that SNS throws at Lambda then send it to Slack.

## Usage

1. Copy code into AWS Lambda
2. Replace relevant vars near the top (Slack hook URL is really the only
   essential one)
3. Setup a subcription on an SNS topic that sends to this new Lambda
   function
