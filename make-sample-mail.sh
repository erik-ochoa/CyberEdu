#!/bin/sh
cat > sample-mail.txt <<THEMAILSTOPSHERE
TO: jrhansf@terpmail.umd.edu
FROM: cyber_edu@umd.edu
SUBJECT: the message's subject
MIME-Version: 1.0
Content-Type: multipart/alternative;boundary="someRandomCharacters"

--someRandomCharacters
Content-Type: text/plain

This the body of the message goes here. This section is a fallback for email clients that do not support (or are configured to refuse) HTML email content.
--someRandomCharacters
Content-Type: multipart/related;boundary="someOtherRandomCharacters"

--someOtherRandomCharacters
Content-Type: text/html

<html>
<body>
<p> The body of the message goes here. This will be displayed for most email clients, who support HTML. </p>
<p> Note that it is even possible to include an image in the email, like this: </p>
<img src="cid:image001"> </img>
</body>
</html>
--someOtherRandomCharacters
Content-Type: image/gif
Content-Id: <image001>
Content-Transfer-Encoding: base64

$(base64 /export/software/cyberedu/alpha_v3/images/phone_app_icon_mail.gif)
--someOtherRandomCharacters--

--someRandomCharacters--
THEMAILSTOPSHERE
