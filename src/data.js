// everything you'll want to edit lives here. anything in [brackets] is for you to fill in.

export const links = {
  email: 'hiranyakithmini@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kithmini-bandhusena-985079326',
  github: 'https://github.com/kithmini-hub', // update if you rename
  resume: '/resume.pdf', // replace public/resume.pdf with your real one
}

// the word before "i’m kithmini". add as many as you like.
export const hi = ['hi', 'hii', 'hellooo', 'hiyaa', 'ayubowan', 'hiiiis', 'ආයුබෝවන්', 'hellows']

export const sub = 'cs undergrad at iit colombo. into cloud and devops. learning marketing on the side.'

export const projects = {
  breach: {
    name: 'breach-radar',
    short: 'checks if your email or password has been in a breach.',
    text: 'cli and web ui, built with python, fastapi and react. for passwords it uses k-anonymity, so only the first few characters of the hash leave your machine and the password itself never goes anywhere.',
    extra: '[the part that gave you trouble]',
    stack: 'python, fastapi, react, tailwind',
    links: [['github', 'https://github.com/kithmini-hub/breach-radar']],
  },
  sentinel: {
    name: 'cloud sentinel',
    short: 'runtime security for aws lambda, built with a team of six.',
    text: 'real-time threat detection, docker clusters, a waf, anomaly detection and a live react dashboard. my part: the frontend (profile and notifications pages) and all the marketing: brand, socials, go-to-market and the pitch.',
    extra: '[one thing you learned about the cloud side from working next to it]',
    stack: 'react, tailwind, aws',
    links: [
      ['dashboard', 'https://github.com/kithmini-hub/CloudSentinel'],
      ['landing page', 'https://github.com/kithmini-hub/Cloud_Sentinel'],
      ['video', 'https://youtu.be/X06bWbXrj4k'],
    ],
  },
  spotify: {
    name: 'spotify friends',
    short: 'a redesign of the friends feed.',
    text: 'spotify barely shows what your friends are listening to. i redesigned it so you can see their mood and how it shifts over time.',
    stack: 'figma, prototyping',
    links: [['figma', 'https://www.figma.com/design/gv8mjA06R0bRKsjomCTgm6/Spotify-Friends?node-id=0-1&t=7gZPh982c7iJi6xz-1']],
  },
  estate: {
    name: 'estate website',
    short: 'listings and filtering in plain html, css and javascript.',
    text: 'a real-estate site with listings and filtering, no frameworks.',
    stack: 'html, css, javascript',
    links: [['github', 'https://github.com/kithmini-hub/ACS']],
  },
}

// the three pinned on the front page. use a key from projects, or null for an empty slot.
export const pinned = ['breach', 'sentinel', null]

export const cs = ['breach', 'estate', 'spotify']
export const csSlots = ['frontend project', 'software engineering project', 'one more']

// cloud projects still to build, in the order to do them.
// when one is done: set done: true, add links, rewrite the line in past tense.
export const cloud = [
  {
    name: 'this site on s3 and cloudfront',
    status: 'this week',
    time: 'about a day',
    line: 'host this portfolio on aws instead of netlify, with https and a cache in front.',
    stack: 's3, cloudfront, acm, github actions',
    steps: [
      'upload the build to a private s3 bucket',
      'put cloudfront in front, with origin access control so the bucket stays private',
      'get a certificate from acm and point a domain at it',
      'github actions: push to main, build, sync to s3, invalidate the cache',
      'write down what went wrong',
    ],
  },
  {
    name: 'serverless uptime checker',
    status: 'this week',
    time: '1 to 2 days',
    line: 'checks a list of urls every few minutes and emails me when one goes down. it watches my own projects.',
    stack: 'lambda, eventbridge, dynamodb, sns',
    steps: [
      'lambda function that requests each url and records status and response time',
      'eventbridge rule to run it every 5 minutes',
      'dynamodb table for the history',
      'sns topic that emails me after two failures in a row',
    ],
  },
  {
    name: 'breach-radar on aws',
    status: 'this week',
    time: '2 to 3 days',
    line: 'breach-radar running online instead of on my laptop. api on lambda, frontend on s3 and cloudfront.',
    stack: 'lambda, api gateway, s3, cloudfront, github actions',
    steps: [
      'wrap the fastapi app so it runs on lambda (mangum)',
      'api gateway in front of it',
      'frontend build to s3 and cloudfront, pointed at the api',
      'github actions deploy on push',
      'rate limiting, so it can’t be hammered',
    ],
  },
  {
    name: 'whale shark sightings pipeline',
    status: 'next week',
    time: '4 to 5 days',
    line: 'pulls public whale shark sighting records on a schedule, stores them, and shows the latest ones on this page.',
    stack: 'lambda, eventbridge, s3, dynamodb, terraform',
    steps: [
      'pick the data source and check it has dates and locations (gbif has open records)',
      'scheduled lambda that pulls new records into s3',
      'clean them into dynamodb',
      'small api that returns the latest sightings',
      'show them here, then move the infra into terraform',
    ],
  },
]

export const marketing =
  'my current internship is in marketing, and i’m studying seo and aeo as i go. small section for now, it’ll grow as i learn.'

export const communities = [
  ['women in foss', 'vice chairperson, mozilla campus club iit'],
  ['mozilla campus club', ''],
  ['ieee', ''],
  ['ieee wie', ''],
  ['rotaract', ''],
]
