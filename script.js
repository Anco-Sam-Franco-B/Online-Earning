/* =========================================================
   EAR NLY DEMO PLATFORM
   ---------------------------------------------------------
   This is a browser-only fictional simulation.

   No:
   - real payments
   - real withdrawals
   - bank APIs
   - mobile-money APIs
   - external authentication
   - financial credential collection
========================================================= */

const STORAGE_KEY = "earnly-demo-state-v2";
const SESSION_KEY = "earnly-demo-session-v2";

/* =========================================================
   DEFAULT STATE
========================================================= */

const defaultState = {
  users: [],
  currentUser: null,

  balance: 12.5,
  completedTasks: 2,
  referrals: 1,
  streak: 1,

  taskDone: [
    true,
    true,
    false,
    false,
    false,
    false
  ],

  referralsList: [
    {
      name: "Demo Friend",
      email: "friend@example.demo",
      reward: 2.5,
      date: "Today"
    }
  ],

  transactions: [
    {
      description: "Welcome demo credit",
      type: "Credit",
      amount: 12.5,
      date: "Today"
    },
    {
      description: "Simulated referral reward",
      type: "Referral",
      amount: 2.5,
      date: "Today"
    }
  ]
};

/* =========================================================
   FICTIONAL TASKS
========================================================= */

const tasks = [
  {
    title: "Explore the Dashboard",
    description: "Explore the fictional dashboard interface.",
    reward: 2.5,
    icon: "⌂"
  },
  {
    title: "Read Demo Guide",
    description: "Read the fictional platform information.",
    reward: 1.75,
    icon: "?"
  },
  {
    title: "Complete a Survey",
    description: "Complete a fictional survey simulation.",
    reward: 3.2,
    icon: "✓"
  },
  {
    title: "Watch Demo Video",
    description: "Simulate watching a short promotional video.",
    reward: 2.1,
    icon: "▶"
  },
  {
    title: "Product Discovery",
    description: "Explore a fictional product discovery task.",
    reward: 4.5,
    icon: "◈"
  },
  {
    title: "Daily Check-in",
    description: "Complete your fictional daily activity.",
    reward: 2.9,
    icon: "★"
  }
];

/* =========================================================
   FICTIONAL WITHDRAWAL NOTIFICATIONS
========================================================= */

const demoWithdrawals = [
  {
    name: "Aline M.",
    amount: 18.5
  },
  {
    name: "Kevin R.",
    amount: 25
  },
  {
    name: "Eric N.",
    amount: 12.75
  },
  {
    name: "Diane K.",
    amount: 31.2
  },
  {
    name: "Patrick T.",
    amount: 9.5
  },
  {
    name: "Grace U.",
    amount: 42
  },
  {
    name: "Daniel B.",
    amount: 15.8
  },
  {
    name: "Claudine A.",
    amount: 27.4
  }
];

/* =========================================================
   DOM
========================================================= */

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const pageTitle = document.getElementById("pageTitle");

const heroBalance = document.getElementById("heroBalance");
const balanceStat = document.getElementById("balanceStat");
const tasksStat = document.getElementById("tasksStat");
const referralsStat = document.getElementById("referralsStat");
const streakStat = document.getElementById("streakStat");

const withdrawBalance = document.getElementById("withdrawBalance");

const activityList = document.getElementById("activityList");
const tasksGrid = document.getElementById("tasksGrid");
const transactionsBody = document.getElementById("transactionsBody");
const referralsList = document.getElementById("referralsList");

const sidebarName = document.getElementById("sidebarName");
const sidebarEmail = document.getElementById("sidebarEmail");
const sidebarAvatar = document.getElementById("sidebarAvatar");

const topUserName = document.getElementById("topUserName");
const topAvatar = document.getElementById("topAvatar");

const logoutBtn = document.getElementById("logoutBtn");

const withdrawAmount = document.getElementById("withdrawAmount");
const withdrawBtn = document.getElementById("withdrawBtn");

const referralLink = document.getElementById("referralLink");
const copyReferral = document.getElementById("copyReferral");
const simulateReferral = document.getElementById("simulateReferral");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const withdrawNotification =
  document.getElementById("withdrawNotification");

const notificationAvatar =
  document.getElementById("notificationAvatar");

const notificationText =
  document.getElementById("notificationText");

const notificationTime =
  document.getElementById("notificationTime");

const closeNotification =
  document.getElementById("closeNotification");

const modalOverlay =
  document.getElementById("modalOverlay");

const closeModal =
  document.getElementById("closeModal");

const cancelModal =
  document.getElementById("cancelModal");

const confirmReset =
  document.getElementById("confirmReset");

/* =========================================================
   STATE
========================================================= */

let state = loadState();
let notificationTimer = null;
let notificationIndex = 0;

/* =========================================================
   STORAGE
========================================================= */

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(stored);

    return {
      ...structuredClone(defaultState),
      ...parsed
    };
  } catch (error) {
    console.error("Unable to load demo state:", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

/* =========================================================
   SESSION
========================================================= */

function getSession() {
  try {
    return JSON.parse(
      localStorage.getItem(SESSION_KEY)
    );
  } catch {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* =========================================================
   UTILITIES
========================================================= */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getInitials(name) {
  if (!name) {
    return "D";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function getCurrentUser() {
  return getSession();
}

/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* =========================================================
   AUTH SCREEN
========================================================= */

function showLoginForm() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  authTitle.textContent = "Welcome back";

  authSubtitle.textContent =
    "Login to continue your simulated earning journey.";
}

function showSignupForm() {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");

  authTitle.textContent = "Create your account";

  authSubtitle.textContent =
    "Create a fictional account for this demo.";
}

showSignup.addEventListener(
  "click",
  showSignupForm
);

showLogin.addEventListener(
  "click",
  showLoginForm
);

/* =========================================================
   SIGN UP
========================================================= */

signupForm.addEventListener("submit", event => {
  event.preventDefault();

  const name =
    document.getElementById("signupName").value.trim();

  const email =
    document.getElementById("signupEmail").value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById("signupPassword").value;

  const confirmPassword =
    document.getElementById("signupConfirm").value;

  if (!name || !email || !password) {
    showToast("Please complete all fields.");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.");
    return;
  }

  const existingUser =
    state.users.find(
      user => user.email === email
    );

  if (existingUser) {
    showToast("A demo account already exists.");
    return;
  }

  /*
    This is intentionally local-only demo authentication.
    Password is not sent anywhere.
  */

  const user = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()),

    name,
    email,
    password
  };

  state.users.push(user);

  state.currentUser = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  saveState();

  setSession(state.currentUser);

  signupForm.reset();

  showApp();

  showToast(
    "Demo account created successfully."
  );
});

/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const email =
    document.getElementById("loginEmail").value
      .trim()
      .toLowerCase();

  const password =
    document.getElementById("loginPassword").value;

  /*
    Convenient demo login:
    If no account exists, users can use:

    Email: demo@example.com
    Password: demo123
  */

  if (
    email === "demo@example.com" &&
    password === "demo123"
  ) {
    let demoUser =
      state.users.find(
        user => user.email === email
      );

    if (!demoUser) {
      demoUser = {
        id: "demo-account",
        name: "Demo User",
        email,
        password
      };

      state.users.push(demoUser);

      saveState();
    }

    const sessionUser = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email
    };

    setSession(sessionUser);

    state.currentUser = sessionUser;

    loginForm.reset();

    showApp();

    showToast(
      "Welcome to the Earnly demo."
    );

    return;
  }

  const user =
    state.users.find(
      item =>
        item.email === email &&
        item.password === password
    );

  if (!user) {
    showToast(
      "Invalid demo login details."
    );

    return;
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  state.currentUser = sessionUser;

  setSession(sessionUser);

  saveState();

  loginForm.reset();

  showApp();

  showToast(
    "Logged in to the demo."
  );
});

/* =========================================================
   SHOW / HIDE APP
========================================================= */

function showApp() {
  authScreen.classList.add("hidden");
  app.classList.remove("hidden");

  updateUserUI();
  renderAll();

  startWithdrawalNotifications();
}

function showAuth() {
  app.classList.add("hidden");
  authScreen.classList.remove("hidden");

  stopWithdrawalNotifications();
}

function updateUserUI() {
  const user = getCurrentUser();

  if (!user) {
    return;
  }

  sidebarName.textContent = user.name;
  sidebarEmail.textContent = user.email;

  topUserName.textContent = user.name;

  const initials = getInitials(user.name);

  sidebarAvatar.textContent = initials;
  topAvatar.textContent = initials;
}

/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener("click", () => {
  clearSession();

  state.currentUser = null;

  showAuth();

  showLoginForm();

  showToast("You have been logged out.");
});

/* =========================================================
   NAVIGATION
========================================================= */

const navItems =
  document.querySelectorAll(".nav-item");

const pages =
  document.querySelectorAll(".page");

function openPage(pageName) {

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  navItems.forEach(item => {
    item.classList.remove("active");
  });

  const page =
    document.getElementById(
      `${pageName}Page`
    );

  const nav =
    document.querySelector(
      `.nav-item[data-page="${pageName}"]`
    );

  if (page) {
    page.classList.add("active-page");
  }

  if (nav) {
    nav.classList.add("active");

    pageTitle.textContent =
      nav.textContent.trim();
  }

  sidebar.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

navItems.forEach(item => {
  item.addEventListener("click", () => {
    openPage(item.dataset.page);
  });
});

document
  .querySelectorAll("[data-page-link]")
  .forEach(button => {
    button.addEventListener("click", () => {
      openPage(button.dataset.pageLink);
    });
  });

/* =========================================================
   MOBILE MENU
========================================================= */

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

  heroBalance.textContent =
    formatMoney(state.balance);

  balanceStat.textContent =
    formatMoney(state.balance);

  tasksStat.textContent =
    state.completedTasks;

  referralsStat.textContent =
    state.referrals;

  streakStat.textContent =
    `${state.streak} day${state.streak === 1 ? "" : "s"}`;

  withdrawBalance.textContent =
    formatMoney(state.balance);
}

/* =========================================================
   TASKS
========================================================= */

function renderTasks() {

  tasksGrid.innerHTML = "";

  tasks.forEach((task, index) => {

    const completed =
      Boolean(state.taskDone[index]);

    const card =
      document.createElement("article");

    card.className =
      `task-card ${completed ? "task-completed" : ""}`;

    card.innerHTML = `
      <div class="task-top">
        <div class="task-icon">
          ${task.icon}
        </div>

        <span class="reward">
          +${formatMoney(task.reward)}
        </span>
      </div>

      <h3>
        ${escapeHTML(task.title)}
      </h3>

      <p>
        ${escapeHTML(task.description)}
      </p>

      <button
        class="${completed ? "secondary-btn" : "primary-btn"}"
        data-task-index="${index}"
        ${completed ? "disabled" : ""}
      >
        ${completed ? "✓ Completed" : "Complete Task"}
      </button>
    `;

    tasksGrid.appendChild(card);
  });

  tasksGrid
    .querySelectorAll("[data-task-index]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {
          completeTask(
            Number(button.dataset.taskIndex)
          );
        }
      );

    });
}

function completeTask(index) {

  if (state.taskDone[index]) {
    return;
  }

  const task = tasks[index];

  state.taskDone[index] = true;

  state.completedTasks += 1;

  state.balance += task.reward;

  state.streak += 1;

  state.transactions.unshift({
    description:
      `Completed demo task: ${task.title}`,

    type: "Task",

    amount: task.reward,

    date: "Just now"
  });

  saveState();

  renderAll();

  showToast(
    `${formatMoney(task.reward)} added to demo balance.`
  );
}

/* =========================================================
   REFERRALS
========================================================= */

function renderReferrals() {

  referralsList.innerHTML = "";

  if (
    !state.referralsList ||
    state.referralsList.length === 0
  ) {

    referralsList.innerHTML = `
      <div class="empty-state">
        No demo referrals yet.
      </div>
    `;

    return;
  }

  state.referralsList.forEach(referral => {

    const row =
      document.createElement("div");

    row.className = "referral-row";

    row.innerHTML = `
      <div class="avatar">
        ${escapeHTML(getInitials(referral.name))}
      </div>

      <div>
        <strong>
          ${escapeHTML(referral.name)}
        </strong>

        <small>
          ${escapeHTML(referral.email)}
        </small>
      </div>

      <span class="referral-reward">
        +${formatMoney(referral.reward)}
      </span>
    `;

    referralsList.appendChild(row);
  });
}

simulateReferral.addEventListener(
  "click",
  () => {

    const names = [
      "Alex Demo",
      "Maya Test",
      "Jordan Demo",
      "Chris Sample",
      "Taylor Demo"
    ];

    const randomName =
      names[
        Math.floor(
          Math.random() * names.length
        )
      ];

    const referral = {
      name: randomName,
      email:
        randomName
          .toLowerCase()
          .replaceAll(" ", ".") +
        "@example.demo",

      reward: 2.5,

      date: "Just now"
    };

    state.referralsList.unshift(referral);

    state.referrals += 1;

    state.balance += referral.reward;

    state.transactions.unshift({
      description:
        `Simulated referral: ${referral.name}`,

      type: "Referral",

      amount: referral.reward,

      date: "Just now"
    });

    saveState();

    renderAll();

    showToast(
      "Demo referral simulated successfully."
    );
  }
);

/* =========================================================
   COPY REFERRAL
========================================================= */

copyReferral.addEventListener(
  "click",
  async () => {

    const text =
      referralLink.value;

    try {

      await navigator.clipboard.writeText(
        text
      );

      showToast(
        "Demo referral link copied."
      );

    } catch {

      referralLink.select();

      document.execCommand("copy");

      showToast(
        "Demo referral link copied."
      );
    }
  }
);

/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions() {

  transactionsBody.innerHTML = "";

  if (
    !state.transactions ||
    state.transactions.length === 0
  ) {

    transactionsBody.innerHTML = `
      <tr>
        <td colspan="4">
          No demo transactions.
        </td>
      </tr>
    `;

    return;
  }

  state.transactions.forEach(transaction => {

    const row =
      document.createElement("tr");

    const positive =
      Number(transaction.amount) >= 0;

    row.innerHTML = `
      <td>
        ${escapeHTML(transaction.description)}
      </td>

      <td>
        <span class="type-badge">
          ${escapeHTML(transaction.type)}
        </span>
      </td>

      <td
        class="${
          positive
            ? "amount-positive"
            : "amount-negative"
        }"
      >
        ${positive ? "+" : "-"}
        ${formatMoney(
          Math.abs(transaction.amount)
        )}
      </td>

      <td>
        ${escapeHTML(transaction.date)}
      </td>
    `;

    transactionsBody.appendChild(row);
  });
}

/* =========================================================
   ACTIVITY
========================================================= */

function renderActivity() {

  activityList.innerHTML = "";

  const recent =
    state.transactions.slice(0, 5);

  if (!recent.length) {

    activityList.innerHTML = `
      <div class="activity-empty">
        No recent demo activity.
      </div>
    `;

    return;
  }

  recent.forEach(transaction => {

    const item =
      document.createElement("div");

    item.className = "activity-item";

    const positive =
      Number(transaction.amount) >= 0;

    item.innerHTML = `
      <div class="activity-icon">
        ${positive ? "+" : "−"}
      </div>

      <div>
        <strong>
          ${escapeHTML(transaction.description)}
        </strong>

        <small>
          ${
            positive ? "+" : "-"
          }${formatMoney(
            Math.abs(transaction.amount)
          )}
          · ${escapeHTML(transaction.date)}
        </small>
      </div>
    `;

    activityList.appendChild(item);
  });
}

/* =========================================================
   WITHDRAWAL SIMULATION
========================================================= */

withdrawBtn.addEventListener(
  "click",
  () => {

    const amount =
      Number(withdrawAmount.value);

    const method =
      document.querySelector(
        'input[name="method"]:checked'
      )?.value || "Demo Wallet";

    if (!amount || amount <= 0) {
      showToast(
        "Enter a valid demo amount."
      );

      return;
    }

    if (amount > state.balance) {
      showToast(
        "Demo amount exceeds your balance."
      );

      return;
    }

    state.balance -= amount;

    state.transactions.unshift({
      description:
        `Simulated withdrawal via ${method}`,

      type: "Withdrawal",

      amount: -amount,

      date: "Just now"
    });

    saveState();

    withdrawAmount.value = "";

    renderAll();

    showToast(
      `${formatMoney(amount)} withdrawal simulated.`
    );

    /*
      Important:
      Nothing is actually transferred.
    */

    setTimeout(() => {

      showToast(
        "Simulation complete — no payment was processed."
      );

    }, 1200);
  }
);

/* =========================================================
   WITHDRAWAL POPUPS
========================================================= */

function showWithdrawalNotification() {

  const item =
    demoWithdrawals[
      notificationIndex %
      demoWithdrawals.length
    ];

  notificationIndex++;

  const initials =
    getInitials(item.name);

  notificationAvatar.textContent =
    initials;

  notificationText.textContent =
    `${item.name} simulated a withdrawal of ${formatMoney(item.amount)}.`;

  notificationTime.textContent =
    "Just now · Demo activity";

  withdrawNotification.classList.add(
    "show"
  );

  setTimeout(() => {

    withdrawNotification.classList.remove(
      "show"
    );

  }, 6500);
}

function startWithdrawalNotifications() {

  stopWithdrawalNotifications();

  /*
    First popup appears after 5 seconds.
  */

  notificationTimer =
    setTimeout(() => {

      showWithdrawalNotification();

      /*
        Then continue every 15 seconds.
      */

      notificationTimer =
        setInterval(
          showWithdrawalNotification,
          15000
        );

    }, 5000);
}

function stopWithdrawalNotifications() {

  if (notificationTimer) {

    clearTimeout(notificationTimer);
    clearInterval(notificationTimer);

    notificationTimer = null;
  }

  withdrawNotification.classList.remove(
    "show"
  );
}

closeNotification.addEventListener(
  "click",
  () => {
    withdrawNotification.classList.remove(
      "show"
    );
  }
);

/* =========================================================
   RESET DEMO
========================================================= */

function openResetModal() {
  modalOverlay.classList.add("show");
}

function closeResetModal() {
  modalOverlay.classList.remove("show");
}

closeModal.addEventListener(
  "click",
  closeResetModal
);

cancelModal.addEventListener(
  "click",
  closeResetModal
);

confirmReset.addEventListener(
  "click",
  () => {

    state = clone(defaultState);

    saveState();

    closeResetModal();

    renderAll();

    showToast(
      "Demo state has been reset."
    );
  }
);

modalOverlay.addEventListener(
  "click",
  event => {

    if (event.target === modalOverlay) {
      closeResetModal();
    }
  }
);

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeResetModal();

      withdrawNotification.classList.remove(
        "show"
      );

      sidebar.classList.remove(
        "open"
      );
    }

  }
);

/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

  renderDashboard();

  renderTasks();

  renderReferrals();

  renderTransactions();

  renderActivity();

  updateUserUI();
}

/* =========================================================
   INITIALIZATION
========================================================= */

(function init() {

  const session = getSession();

  if (session) {

    state.currentUser = session;

    showApp();

  } else {

    showAuth();

    showLoginForm();

  }

})();
