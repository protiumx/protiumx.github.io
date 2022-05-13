const MEDIUM_FEED_URL = "https://medium.com/feed/@protiumx";

async function fecthLastMediumArticles() {
  const feed = new Meed({ proxy: "https://cors.bridged.cc/" });
  const user = await feed.user("protiumx");
  console.log(user);
}

fecthLastMediumArticles();
