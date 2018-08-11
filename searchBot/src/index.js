
const rp = require("request-promise");
const checksum = require("checksum");
const co = require("cheerio");

acc_SID = 'private';
auth_token = 'private';
const client = require('twilio')(acc_SID, auth_token)

const url = `https://www.indeed.com/jobs?q=Software+engineer+intern&l=California&sort=date`;

// empty var outside function so we can save its value
let hash = "";

function checkURL(siteToCheck) {
  return rp(siteToCheck)
  .then(HTMLresponse => {
    const $ = co.load(HTMLresponse);
    let jobString = "";
    
    // use Cheerio to check the html elements for non-dynamic changes in page
    $(".row.result.clickcard").attr("data-tn-component", "organicJob").each((i, element) => {
      jobString += `${element.attribs["id"]}`;
    });

    if(hash === '') {
      console.log('Making initial fetch...')
      hash = checksum(jobString);
    }
    // compare hashed version of page to check for changes
    if(hash !== checksum(jobString)) {
      console.log(checksum(jobString));
      hash = checksum(jobString)
      return true;
    }
    return false;
  })
  .catch(err => {
    console.log(`Could not complete fetch of ${url}: ${err}`);
  });
}

function SMS({
  body,
  to,
  from
}) {
  client.messages
    .create({
      body,
      to,
      from
    })
    .then(() => {
      console.log(`Success! Message has been sent to ${to}`);
    })
    .catch(err => {
      console.log(err);
    });
}
// replace to with your number
// from is your twilio number
setInterval(async() => {
  if(await checkURL(url)) {
    console.log('Found a change! Sending text.')
    SMS({
      body: `There is a new add at ${url}`,
      to: "+18185777925",
      from: "+18057741640"
    })
  }
  console.log('No new ads.');
}, 10000);
