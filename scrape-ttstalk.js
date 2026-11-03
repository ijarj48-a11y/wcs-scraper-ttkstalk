import fs from "node:fs/promises";

const username = (process.argv[2] || "").replace(/^@/, "");

if (!/^[a-zA-Z0-9._]{2,24}$/.test(username)) {
  console.log('Gunakan: node scrape-ttstalk.js "@username"');
  process.exit(1);
}

const url = `https://www.tiktok.com/@${username}`;

try {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    },
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const html = await response.text();

  const scriptId = 'id="__UNIVERSAL_DATA_FOR_REHYDRATION__"';
  const scriptPosition = html.indexOf(scriptId);

  if (scriptPosition === -1) {
    throw new Error("Data profil tidak ditemukan.");
  }

  const contentStart = html.indexOf(">", scriptPosition) + 1;
  const contentEnd = html.indexOf("</script>", contentStart);

  if (contentStart === 0 || contentEnd === -1) {
    throw new Error("Data profil tidak ditemukan.");
  }

  const root = JSON.parse(html.slice(contentStart, contentEnd));
  const detail = root?.__DEFAULT_SCOPE__?.["webapp.user-detail"];
  const info = detail?.userInfo;
  const user = info?.user;
  const stats = info?.statsV2 || info?.stats;

  if (!user || !stats || detail.statusCode !== 0) {
    throw new Error(detail?.statusMsg || "Profil tidak tersedia.");
  }

  const result = {
    status: "success",
    mode: "public-profile",
    count: 1,
    results: [{
      name: user.nickname ?? null,
      username: `@${user.uniqueId}`,
      verified: user.verified ?? null,
      private: user.privateAccount ?? null,
      followers: Number(stats.followerCount) || 0,
      following: Number(stats.followingCount) || 0,
      likes: Number(stats.heartCount ?? stats.heart) || 0,
      videos: Number(stats.videoCount) || 0,
      bio: user.signature ?? null,
      profile: user.avatarLarger ?? null,
      profile_url: url,
      user_id: user.id ?? null
    }]
  };

  const output = JSON.stringify(result, null, 2);

  await fs.mkdir("results", { recursive: true });
  await fs.writeFile(`results/${username}.json`, output);

  console.log(output);
  console.log(`Tersimpan: results/${username}.json`);

} catch (error) {
  console.log(JSON.stringify({
    status: "unavailable",
    username: `@${username}`,
    message: error.message
  }, null, 2));
}
