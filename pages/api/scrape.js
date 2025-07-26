export default async function handler(req, res) {
  // CORS headers
  const allowedOrigins = ["https://ejgavin.github.io", "https://ejgsapis.onrender.com", "https://logsystem.vercel.app", "https://musicstreamer-2ojd.onrender.com", "https://musicstreamer.koyeb.app"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const parsedUrl = new URL(url);

    let headers;

    let referer = null;
    let origin = null;

    switch (parsedUrl.hostname) {
      case "oca.kendrickl-3amar.site":
        referer = origin = "https://xprime.tv";
        headers = {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
          "Connection": "keep-alive",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
          "Priority": "u=3, i",
          "Host": "oca.kendrickl-3amar.site"
        };
        break;
      case "api.rgshows.me":
        referer = "https://www.vidsrc.wtf/";
        origin = "https://www.vidsrc.wtf";
        headers = {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "en-US,en;q=0.9",
          "DNT": "1",
          "Origin": origin,
          "Referer": referer,
          "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "cross-site",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
        };
        break;
      case "frostywinds73.pro":
        referer = "https://xprime.tv/foxtemp";
        break;
      case "c2tjzlkedcnp.cdn-centaurus.com":
        referer = origin = "https://uqloads.xyz";
        break;
      case "vidsrc.su":
        referer = origin = "https://vidsrc.su";
        break;
      case "maxflix.top":
        referer = origin = "https://maxflix.top";
        break;
      case "embed.su":
        referer = origin = "https://embed.su";
        headers = {
          "Accept": "*/*",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
          "Referer": referer,
          "Origin": origin
        };
        break;
      case "ikm.fleurixsun.xyz":
        referer = origin = "https://autoembed.cc";
        break;
    }

    if (!headers) {
      headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "Priority": "u=3, i"
      };
    }

    if (referer && parsedUrl.hostname !== "embed.su") headers["Referer"] = referer;
    if (origin && parsedUrl.hostname !== "embed.su") headers["Origin"] = origin;

    const response = await fetch(url, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: "Failed to fetch the URL",
        debug: {
          url,
          headers,
          usedHeaders: {
            referer: referer || "none",
            origin: origin || "none"
          },
          responseStatus: response.status,
          responseBody: errorText,
          note: "Fetch failed before parsing content"
        }
      });
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
      const json = await response.json();
      if (parsedUrl.hostname === "api.rgshows.me") {
        const rawBody = JSON.stringify(json, null, 2);
        return res.status(200).json({
          content: json,
          raw: rawBody,
          debug: {
            url,
            headers,
            usedHeaders: {
              referer: referer || "none",
              origin: origin || "none"
            },
            responseStatus: response.status,
            contentType,
            note: "This is a forced debug return for api.rgshows.me"
          }
        });
      }
      return res.status(200).json({
        content: json,
        usedHeaders: {
          referer: referer || "none",
          origin: origin || "none"
        }
      });
    } else {
      const text = await response.text();
      const annotatedText = `${text}\n\n<!-- Referer: ${referer || "none"} | Origin: ${origin || "none"} -->`;
      return res.status(200).send(annotatedText);
    }
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
