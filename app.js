/* =========================================================
   Ariel Builds — form logic

   Two forms on this page, ranked:
     1. Discovery Session request  -> table "discovery_requests"
     2. Field Notes email list     -> table "waitlist"

   Both work the same way: check the input, send it to
   Supabase, tell the person what happened.
   ========================================================= */

document.getElementById("year").textContent = new Date().getFullYear();

const isConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.startsWith("http") &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 20;

const db = (isConfigured && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function setStatus(el, message, kind) {
  el.textContent = message;
  el.className = "status" + (kind ? " " + kind : "");
}

function val(id) {
  return document.getElementById(id).value.trim();
}

/* ---------------------------------------------------------
   1. Discovery Session request — the primary ask
   --------------------------------------------------------- */
const sessionForm   = document.getElementById("session-form");
const sessionStatus = document.getElementById("session-status");
const sessionBtn    = document.getElementById("session-btn");

sessionForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // A bot filled the hidden field. Pretend it worked and stop.
  if (val("s-website")) {
    setStatus(sessionStatus, "Thanks — I'll be in touch shortly.", "ok");
    sessionForm.reset();
    return;
  }

  const name    = val("s-name");
  const email   = val("s-email").toLowerCase();
  const problem = val("s-problem");

  if (!name) {
    setStatus(sessionStatus, "I need a name to reply to.", "bad");
    return;
  }
  if (!looksLikeEmail(email)) {
    setStatus(sessionStatus, "That email doesn't look quite right — mind checking it?", "bad");
    return;
  }
  if (problem.length < 10) {
    setStatus(sessionStatus, "Tell me a little more about the problem — a sentence is enough.", "bad");
    return;
  }
  if (!db) {
    setStatus(sessionStatus, "The form works, but Supabase isn't connected yet. Add your keys in config.js.", "bad");
    return;
  }

  sessionBtn.disabled = true;
  setStatus(sessionStatus, "Sending…");

  const { error } = await db.from("discovery_requests").insert({
    name: name,
    email: email,
    organization: val("s-org") || null,
    role: val("s-role") || null,
    problem: problem,
    timing: document.getElementById("s-timing").value || null
  });

  sessionBtn.disabled = false;

  if (error) {
    console.error("Supabase error:", error);
    setStatus(sessionStatus, "Something went wrong on my end. Try again in a minute?", "bad");
    return;
  }

  setStatus(sessionStatus, "Got it. I'll read this myself and reply within two business days.", "ok");
  sessionForm.reset();
});

/* ---------------------------------------------------------
   2. Field Notes list — the secondary ask
   --------------------------------------------------------- */
const listForm   = document.getElementById("waitlist-form");
const listStatus = document.getElementById("status");
const listBtn    = document.getElementById("submit-btn");

listForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (val("company_website")) {
    setStatus(listStatus, "Thanks — you're on the list.", "ok");
    listForm.reset();
    return;
  }

  const email = val("email").toLowerCase();

  if (!looksLikeEmail(email)) {
    setStatus(listStatus, "That email doesn't look quite right — mind checking it?", "bad");
    return;
  }
  if (!db) {
    setStatus(listStatus, "The form works, but Supabase isn't connected yet. Add your keys in config.js.", "bad");
    return;
  }

  listBtn.disabled = true;
  setStatus(listStatus, "Sending…");

  const { error } = await db.from("waitlist").insert({ email: email });

  listBtn.disabled = false;

  if (error) {
    // 23505 is Postgres for "that value already exists".
    if (error.code === "23505") {
      setStatus(listStatus, "You're already on the list — thanks for the enthusiasm.", "ok");
      listForm.reset();
      return;
    }
    console.error("Supabase error:", error);
    setStatus(listStatus, "Something went wrong on my end. Try again in a minute?", "bad");
    return;
  }

  setStatus(listStatus, "You're in. Thanks.", "ok");
  listForm.reset();
});
