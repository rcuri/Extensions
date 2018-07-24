const rp = require("request-promise");
const checksum = require("checksum");
const co = require("cheerio");

const url = `https://www.indeed.com/jobs?q=Software+engineer+intern&l=California&sort=date`;

// empty var outside function so we can save its value
let hash = "";

function checkURL(siteToCheck) {
  return rp(siteToCheck)
  .then(HTMLresponse => {
    const $ = co.load(HTMLresponse);
    let jobString = "";

    $(".row.result.clickcard").attr("data-tn-component", "organicJob").each((i, element) => {
      jobString += '${element.attribs["id"]}';
    });

    if(hash === '') {
      console.log('Making initial fetch...')
      hash = checksum(jobString);
    }

    if(hash !== checksum(jobString)) {
      console.log(checksum(jobString));
      hash = checksum(jobString)
      return true;
    }

    return false;
  })
  .catch(err => {
    console.log('Could not complete fetch of ${url}: ${err}');
  });
}


setInterval(async() => {
  if(await checkURL(url)) {
    console.log('Found a change!');
  }
  console.log('No new ads.');
}, 10000);
