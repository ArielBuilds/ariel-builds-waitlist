/* =========================================================
   Ariel Builds — waitlist form logic

   What happens here, in plain English:
   1. Connect to Supabase using the values in config.js
   2. When someone submits the form, check the email looks real
   3. Send the row to the "waitlist" table in Supabase
   4. Tell the person what happened
   ========================================================= */

// Show the current year in the footer.
document.getElementById("year").textContent = new Date().getFullYear();

const form      = document.getElementById("waitlist-form");
const statusEl  = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

// Have the keys actually been filled in yet?
const isConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.startsWith("http") &&
  typeof SUPABASE_ANON_KEY === "string" &&
  SUPABASE_ANON_KEY.length > 20;

// Create the Supabase client (only if we have real keys).
const db = (isConfigured && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function setStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = "status" + (kind ? " " + kind : "");
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim().toLowerCase();
  const headache = document.getElementById("headache").value.trim();
  const honeypot = document.getElementById("company_website").value;

  // A bot filled the hidden field. Pretend everything is fine and stop.
  if (honeypot) {
    setStatus("Thanks — you're on the list.", "ok");
    form.reset();
    return;
  }

  if (!looksLikeEmail(email)) {
    setStatus("That email doesn't look quite right — mind checking it?", "bad");
    return;
  }

  if (!db) {
    setStatus(
      "The form works, but Supabase isn't connected yet. Add your keys in config.js.",
      "bad"
    );
    return;
  }

  submitBtn.disabled = true;
  setStatus("Sending…");

  const { error } = await db.from("waitlist").insert({
    name: name || null,
    email: email,
    headache: headache || null
  });

  submitBtn.disabled = false;

  if (error) {
    // 23505 is Postgres for "that value already exists" (duplicate email).
    if (error.code === "23505") {
      setStatus("You're already on the list — thanks for the enthusiasm.", "ok");
      form.reset();
      return;
    }
    console.error("Supabase error:", error);
    setStatus("Something went wrong on my end. Try again in a minute?", "bad");
    return;
  }

  setStatus("You're in. Thanks — I'll be in touch.", "ok");
  form.reset();
});
