// //ts-ignore
// import { TwitterClient } from "twitter-api-client";
//
// const twitterClient = new TwitterClient({
//   apiKey: "LB5d7RdVUdwqI7zePMcOFueWp",
//   apiSecret: "5yS8oincsavDpSQlAXNjv5fRroVsdII6EptXBUEdi97U5wDiam",
//   accessToken:
//     "AAAAAAAAAAAAAAAAAAAAAL3OPAEAAAAAkU3MwrmHrl1NTQLC0njvzVO5WEY%3DGKWNG6IJdpPt2RTM35EROcrzmmFft0beUh3QOHgEgAJMUB2755",
// });
//
// export { twitterClient };
require("dotenv").config();
const OAuth = require("oauth");

const twitter_application_consumer_key = process.env.APP_KEY;
const twitter_application_secret = process.env.APP_SECRET;
const twitter_user_access_token = process.env.CLIENT_KEY;
const twitter_user_secret = process.env.CLIENT_SECRET;

const oauth = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  twitter_application_consumer_key,
  twitter_application_secret,
  "1.0A",
  null,
  "HMAC-SHA1"
);

const generateTweetString = (tweet: Record<string, any>) => {
  const { rsn, differences } = tweet;

  let tweetBody: string = `ALERT\n\nAccount: ${rsn}\n\n`;

  if (Object.keys(differences.skills)) {
    Object.keys(differences.skills).forEach((skill) => {
      tweetBody += `+${differences.skills[skill]}xp in ${skill}\n`;
    });
  }

  if (Object.keys(differences.clues)) {
    Object.keys(differences.clues).forEach((level) => {
      tweetBody += `+${differences.clues[level]} in ${level} clues\n`;
    });
  }

  if (Object.keys(differences.bosses)) {
    Object.keys(differences.bosses).forEach((boss) => {
      tweetBody += `+${differences.bosses[boss]}kc at ${boss}\n`;
    });
  }

  return tweetBody;
};

const sendTweet = async (tweet: Record<string, any>) => {
  const tweetBody = generateTweetString(tweet);

  const postBody = {
    status: tweetBody,
  };

  oauth.post(
    "https://api.twitter.com/1.1/statuses/update.json",
    twitter_user_access_token, // oauth_token (user access token)
    twitter_user_secret, // oauth_secret (user secret)
    postBody, // post body
    "", // post content type ?
    function (err, data, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    }
  );
};

export { sendTweet };
