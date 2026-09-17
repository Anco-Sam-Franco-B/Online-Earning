const STORAGE_KEY = "earnly-demo-state-v1";


/* DEFAULT DEMO DATA */

const defaultState = {

  balance: 12.50,

  completedTasks: 2,

  referrals: 1,

  streak: 1,

  transactions: [

    {
      description: "Welcome demo credit",
      date: "Today",
      status: "Demo",
      amount: 12.50
    },

    {
      description: "Simulated referral reward",
      date: "Yesterday",
      status: "Demo",
      amount: 2.50
    }

  ],

  taskDone: [
    true,
    true,
    false,
    false,
    false,
    false
  ],

  referralActivity: [

    {
      name: "Demo User #001",
      date: "Yesterday",
      reward: 2.50
    }

  ]

};


/* FICTIONAL TASKS */

const tasks = [

  {
    id: 0,
    icon: "◈",
    title: "Product Feedback",
    description:
      "Review a fictional product card and select a simulated response.",
    reward: 2.50,
    time: "2 min"
  },

  {
    id: 1,
    icon: "▣",
    title: "Design Survey",
    description:
      "Answer a short fictional survey about dashboard usability.",
    reward: 1.75,
    time: "3 min"
  },

  {
    id: 2,
    icon: "◎",
    title: "UI Check",
    description:
      "Inspect a fictional landing page and identify interface elements.",
    reward: 3.20,
    time: "4 min"
  },

  {
    id: 3,
    icon: "✦",
    title: "Content Review",
    description:
      "Classify fictional content for this product demonstration.",
    reward: 2.10,
    time: "3 min"
  },

  {
    id: 4,
    icon: "◇",
    title: "Data Challenge",
    description:
      "Complete a simple fictional data categorization activity.",
    reward: 4.50,
    time: "5 min"
  },

  {
    id: 5,
    icon: "☷",
    title: "App Walkthrough",
    description:
      "Explore a simulated app and mark the features you discover.",
    reward: 2.90,
    time: "4 min"
  }

];


let state = loadState();


/* SHORTCUTS */

const $ = (selector) =>
  document.querySelector(selector);


const $$ = (selector) =>
  [...document.querySelectorAll(selector)];


/* FORMAT MONEY */

function money(value) {

  return `$${Number(value).toFixed(2)}`;

}


/* BASIC HTML ESCAPING */

function escapeHTML(value) {

  return String(value).replace(
    /[&<>"']/g,
    (character) => {

      const entities = {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      };

      return entities[character];

    }
  );

}


/* LOAD STATE */

function loadState() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    return saved
      ? {
          ...structuredClone(defaultState),
          ...saved
        }
      : structuredClone(defaultState);

  } catch {

    return structuredClone(defaultState);

  }

}


/* SAVE STATE */

function saveState() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

  render();

}


/* RENDER EVERYTHING */

function render() {

  $("#balance").textContent =
    money(state.balance);

  $("#withdrawBalance").textContent =
    money(state.balance);

  $("#completedTasks").textContent =
    state.completedTasks;

  $("#referralCount").textContent =
    state.referrals;

  $("#streak").textContent =
    `${state.streak} ${
      state.streak === 1
        ? "day"
        : "days"
    }`;

  renderTasks();

  renderTransactions();

  renderRecentActivity();

  renderReferrals();

}


/* TASKS */

function renderTasks() {

  $("#taskList").innerHTML =
    tasks
      .map((task) => {

        const completed =
          Boolean(
            state.taskDone[task.id]
          );

        return `

          <article
            class="task-card ${
              completed
                ? "done"
                : ""
            }"
          >

            <div class="task-top">

              <div class="task-icon">
                ${task.icon}
              </div>

              <span class="reward">
                +${money(task.reward)}
              </span>

            </div>


            <h3>
              ${escapeHTML(task.title)}
            </h3>


            <p>
              ${escapeHTML(task.description)}
            </p>


            <div class="task-meta">

              <span>
                ◷ ${task.time}
              </span>

              <span>
                • Fictional
              </span>

            </div>


            <button
              class="task-btn"
              data-task="${task.id}"
              ${completed ? "disabled" : ""}
            >
              ${
                completed
                  ? "✓ Completed in Demo"
                  : "Complete Task"
              }
            </button>

          </article>

        `;

      })
      .join("");


  $$(".task-btn").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () =>
          completeTask(
            Number(
              button.dataset.task
            )
          )
      );

    }
  );

}


/* COMPLETE TASK */

function completeTask(id) {

  if (state.taskDone[id]) {

    return;

  }


  const task = tasks[id];


  state.taskDone[id] = true;


  state.completedTasks += 1;


  state.balance =
    Number(
      (
        state.balance +
        task.reward
      ).toFixed(2)
    );


  state.transactions.unshift({

    description:
      `${task.title} reward`,

    date:
      "Just now",

    status:
      "Demo",

    amount:
      task.reward

  });


  saveState();


  showModal(

    "Task completed",

    `You received ${money(
      task.reward
    )} in simulated demo credits. No real money was earned.`

  );

}


/* RECENT ACTIVITY */

function renderRecentActivity() {

  const items =
    state.transactions.slice(
      0,
      4
    );


  if (!items.length) {

    $("#recentActivity").innerHTML =
      `<p class="helper">
        No demo activity yet.
      </p>`;

    return;

  }


  $("#recentActivity").innerHTML =
    items
      .map(
        (transaction) => `

          <div class="activity">

            <div class="activity-icon">
              ${
                transaction.amount < 0
                  ? "↘"
                  : "✓"
              }
            </div>


            <div class="activity-main">

              <b>
                ${escapeHTML(
                  transaction.description
                )}
              </b>

              <small>
                ${escapeHTML(
                  transaction.date
                )}
                ·
                ${escapeHTML(
                  transaction.status
                )}
              </small>

            </div>


            <span class="amount">

              ${
                transaction.amount < 0
                  ? "-"
                  : "+"
              }

              ${money(
                Math.abs(
                  transaction.amount
                )
              )}

            </span>

          </div>

        `
      )
      .join("");

}


/* TRANSACTION TABLE */

function renderTransactions() {

  $("#transactionTable").innerHTML =
    state.transactions
      .map(
        (transaction) => `

          <tr>

            <td>
              ${escapeHTML(
                transaction.description
              )}
            </td>

            <td>
              ${escapeHTML(
                transaction.date
              )}
            </td>

            <td>

              <span class="status">
                ${escapeHTML(
                  transaction.status
                )}
              </span>

            </td>

            <td
              class="${
                transaction.amount < 0
                  ? ""
                  : "amount"
              }"
            >

              ${
                transaction.amount < 0
                  ? "-"
                  : "+"
              }

              ${money(
                Math.abs(
                  transaction.amount
                )
              )}

            </td>

          </tr>

        `
      )
      .join("");

}


/* REFERRALS */

function renderReferrals() {

  if (
    !state.referralActivity.length
  ) {

    $("#referralList").innerHTML =
      `<p class="helper">
        No demo referrals yet.
      </p>`;

    return;

  }


  $("#referralList").innerHTML =
    state.referralActivity
      .map(
        (referral) => `

          <div class="activity">

            <div class="activity-icon">
              ↗
            </div>


            <div class="activity-main">

              <b>
                ${escapeHTML(
                  referral.name
                )}
              </b>

              <small>
                ${escapeHTML(
                  referral.date
                )}
                · Fictional referral
              </small>

            </div>


            <span class="amount">
              +${money(
                referral.reward
              )}
            </span>

          </div>

        `
      )
      .join("");

}


/* NAVIGATION */

function navigate(page) {

  $$(".page").forEach(
    (section) => {

      section.classList.toggle(
        "active",
        section.id === page
      );

    }
  );


  $$(".nav-item").forEach(
    (item) => {

      item.classList.toggle(
        "active",
        item.dataset.page === page
      );

    }
  );


  const pageTitles = {

    dashboard:
      "Dashboard",

    tasks:
      "Tasks",

    referrals:
      "Referrals",

    transactions:
      "Transactions",

    withdraw:
      "Withdraw"

  };


  $("#pageTitle").textContent =
    pageTitles[page] ||
    "Dashboard";


  $("#sidebar").classList.remove(
    "open"
  );


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* SIDEBAR NAV */

$$(".nav-item").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () =>
        navigate(
          button.dataset.page
        )
    );

  }
);


/* QUICK LINKS */

$$("[data-go]").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () =>
        navigate(
          button.dataset.go
        )
    );

  }
);


/* MOBILE MENU */

$("#menuBtn").addEventListener(
  "click",
  () => {

    $("#sidebar").classList.toggle(
      "open"
    );

  }
);


/* RESET */

$("#resetBtn").addEventListener(
  "click",
  () => {

    state =
      structuredClone(
        defaultState
      );

    saveState();

    showToast(
      "Demo data reset."
    );

  }
);


/* COPY DEMO REFERRAL */

$("#copyReferral").addEventListener(
  "click",
  async () => {

    const text =
      $("#referralLink")
        .textContent
        .trim();


    try {

      await navigator.clipboard.writeText(
        text
      );

      showToast(
        "Demo referral link copied."
      );

    } catch {

      showToast(
        "Copy is unavailable in this browser."
      );

    }

  }
);


/* SIMULATE REFERRAL */

$("#simulateReferral").addEventListener(
  "click",
  () => {

    state.referrals += 1;


    state.balance =
      Number(
        (
          state.balance +
          2.50
        ).toFixed(2)
      );


    const demoUser =
      `Demo User #${String(
        state.referrals
      ).padStart(3, "0")}`;


    state.referralActivity.unshift({

      name:
        demoUser,

      date:
        "Just now",

      reward:
        2.50

    });


    state.transactions.unshift({

      description:
        "Simulated referral reward",

      date:
        "Just now",

      status:
        "Demo",

      amount:
        2.50

    });


    saveState();


    showModal(

      "Referral simulated",

      "A fictional referral and reward were added locally. No invitation was sent."

    );

  }
);


/* WITHDRAWAL SIMULATION */

$("#withdrawForm").addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const amount =
      Number(
        $("#amount").value
      );


    const method =
      $("#method").value;


    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {

      showToast(
        "Enter a valid demo amount."
      );

      return;

    }


    if (
      amount >
      state.balance
    ) {

      showToast(
        "The demo amount exceeds the simulated balance."
      );

      return;

    }


    state.balance =
      Number(
        (
          state.balance -
          amount
        ).toFixed(2)
      );


    state.transactions.unshift({

      description:
        `Demo withdrawal · ${method}`,

      date:
        "Just now",

      status:
        "Simulated",

      amount:
        -amount

    });


    $("#amount").value =
      "";


    saveState();


    showModal(

      "Withdrawal simulated",

      `${money(
        amount
      )} was removed from the fictional balance. No payment was processed.`

    );

  }
);


/* TOAST */

function showToast(message) {

  const toast =
    $("#toast");


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(
      () =>
        toast.classList.remove(
          "show"
        ),
      2600
    );

}


/* MODAL */

function showModal(
  title,
  text
) {

  $("#modalTitle").textContent =
    title;

  $("#modalText").textContent =
    text;

  $("#modalBackdrop").classList.add(
    "open"
  );

}


function closeModal() {

  $("#modalBackdrop").classList.remove(
    "open"
  );

}


$("#modalClose").addEventListener(
  "click",
  closeModal
);


$("#modalOk").addEventListener(
  "click",
  closeModal
);


$("#modalBackdrop").addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      $("#modalBackdrop")
    ) {

      closeModal();

    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeModal();

    }

  }
);


/* INITIAL RENDER */

render();
