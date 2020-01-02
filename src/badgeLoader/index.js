function showWidget(
  address,
  lat,
  long,
  token,
  userNameRequesting,
  body,
  styles,
  type,
  badgeType,
  middleColumnText
) {
  const isV2 = badgeType ? true : false;
  const badgeEl = document.getElementById("cls-badge-el");
  const iframe = document.createElement("iframe");
  iframe.setAttribute("id", "cls-badge-el-iframe");
  setFrameSource(
    iframe,
    address,
    lat,
    long,
    styles,
    type,
    token,
    userNameRequesting,
    body,
    badgeType,
    middleColumnText
  );
  setFrameStyle(iframe, styles, isV2);
  badgeEl.appendChild(iframe);
}

function setFrameSource(
  frame,
  address,
  lat,
  long,
  styles,
  type,
  token,
  userNameRequesting,
  body,
  badgeType,
  middleColumnText
) {
  if (lat && long) {
    frame.src = clsUrl(
      `/widget/badge${
        badgeType ? `/v2` : ""
      }?lat=${lat}&long=${long}&styles=${encodeURIComponent(
        JSON.stringify(styles)
      )}&type=${type}&token=${encodeURIComponent(
        token
      )}&body=${body}&userNameRequesting=${userNameRequesting}${
        badgeType
          ? `&badgeType=${badgeType}&middleColumnText=${middleColumnText}`
          : ""
      }`
    );
  } else if (address) {
    frame.src = clsUrl(
      `/widget/badge${
        badgeType ? `/v2` : ""
      }?address=${address}&styles=${encodeURIComponent(
        JSON.stringify(styles)
      )}&type=${type}&token=${encodeURIComponent(
        token
      )}&body=${body}&userNameRequesting=${userNameRequesting}${
        badgeType
          ? `&badgeType=${badgeType}&middleColumnText=${middleColumnText}`
          : ""
      }`
    );
  }
}

function setFrameStyle(frame, styles, v2) {
  // const style = styles ? JSON.parse(styles) : {};
  // Object.keys(style).forEach(prop => {
  //   frame.style[prop] = style[prop];
  // });

  if (styles && styles.width) {
    const width = parseInt(styles.width.substring(0, styles.width.length - 1));
    frame.style.width = width > 120 ? width + "px" : "120px"; //minimum
    frame.style.height = parseInt(width * (216 / 334)) + "px";
  } else {
    frame.style.width = v2 ? "650px" : "334px";
    frame.style.height = v2 ? "346px" : "216px";
  }
  if (styles && styles.backgroundColor) {
    // to avoid white outline
    frame.style["background-color"] = styles.backgroundColor;
  }
  frame.style["border-width"] = "0px";
  frame.style.padding = 0;
}

function handleWindowMessage(event) {
  if (event.data.action === "metropolis.getBadge") {
    const {
      lat,
      long,
      address,
      token,
      userNameRequesting,
      body,
      styles,
      type
    } = event.data.payload;
    showWidget(
      address,
      lat,
      long,
      token,
      userNameRequesting,
      body,
      styles,
      type
    );
  } else if (event.data.action === "metropolis.getBadgeV2") {
    const {
      lat,
      long,
      address,
      token,
      userNameRequesting,
      body,
      styles,
      type,
      badgeType,
      middleColumnText
    } = event.data.payload;
    showWidget(
      address,
      lat,
      long,
      token,
      userNameRequesting,
      body,
      styles,
      type,
      badgeType,
      middleColumnText
    );
  }
}

function clsUrl(absPath = "") {
  return process.env.CLS_URL.replace(/\/$/, "") + absPath;
}

window.addEventListener("message", handleWindowMessage);
