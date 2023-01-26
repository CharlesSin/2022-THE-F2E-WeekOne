// Banner Animation
setTimeout(() => {
  document.querySelectorAll(".banner")[0].style["display"] = "none";
  document.querySelectorAll(".main")[0].style["display"] = "block";
}, 3000);

const awardCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
};
let awardObserver = new IntersectionObserver(awardCallback);
const awardArray = document.querySelectorAll(".award-item");
awardArray.forEach((item) => {
  awardObserver.observe(item);
});

// section
const sectionCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.body.className = "";
      document.body.classList.add(entry.target.dataset.navbar);
    } else {
      // entry.target.style.animation = "none";
    }
  });
};
let sectionObserver = new IntersectionObserver(sectionCallback);
const sectionArray = document.querySelectorAll("section");
sectionArray.forEach((item) => {
  sectionObserver.observe(item);
});

const content2Callback = (entries) => {
  entries.forEach((entry) => {
    let ele = document.querySelector(".team-row");
    if (entry.isIntersecting) {
      ele.classList.add("active");
    } else {
      ele.classList.remove("active");
    }
  });
};

let content2Observer = new IntersectionObserver(content2Callback);
const content2Items = document.querySelectorAll(".trigger-team-text");
content2Items.forEach((item) => {
  content2Observer.observe(item);
});

const contentOneCallback = (entries) => {
  entries.forEach((entry) => {
    let ele = document.querySelector(".bg-card");
    if (entry.isIntersecting) {
      // ele.classList.add('animation');
      entry.target.classList.add("animation");
    } else {
      // ele.classList.remove('animation');
      entry.target.classList.remove("animation");
    }
  });
};

let contentOneObserver = new IntersectionObserver(contentOneCallback);
const contentOneItems = document.querySelectorAll(".content");
contentOneItems.forEach((item) => {
  contentOneObserver.observe(item);
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { doc, setDoc, collection, getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUyUXit_cf7HTxTJAtZPt1ywUIjhdbb-c",
  authDomain: "eugene-fingerprint.firebaseapp.com",
  projectId: "eugene-fingerprint",
  storageBucket: "eugene-fingerprint.appspot.com",
  messagingSenderId: "471916759323",
  appId: "1:471916759323:web:5ac4337f3e3c803fa9abbe",
  measurementId: "G-491BP86Y6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function getVisitorData() {
  const fp = await FingerprintJS.load({ debug: true });
  return await fp.get();
}

function getLocation(uri) {
  return fetch(`${uri}`)
    .then((response) => response.json())
    .then((data) => JSON.stringify(data.data));
}

async function startPlayground() {
  try {
    const { visitorId, confidence, components } = await getVisitorData();
    let domain = new URL(window.location.href);
    domain = domain.hostname;
    let usersCol = collection(firestore, "prd-user-log");
    if (domain.startsWith("127") || domain.startsWith("localhost")) {
      usersCol = collection(firestore, "dev-user-log");
    }
    const userRef = doc(usersCol, `${visitorId}@${new Date().getTime()}@${Math.floor(Math.random() * 100)}`);
    const geoLoc = await getLocation("https://eugene-fcm.vercel.app/geolocation");
    console.log("location: ", geoLoc);
    await setDoc(userRef, {
      fingerprintID: `${visitorId}`,
      createAt: new Date(),
      website: window.location.href,
      location: `${geoLoc}`,
    });
  } catch (err) {
    const errorCol = collection(firestore, "error-log");
    const errorRef = doc(errorCol, `${new Date().getTime()}@${Math.floor(Math.random() * 100)}`);
    await setDoc(errorRef, {
      error: `${JSON.stringify(err)}`,
      createAt: new Date(),
      website: window.location.href,
    });
  }
}

startPlayground();
