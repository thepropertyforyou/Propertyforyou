const url = "https://cdytokrrxcgxoloirdkk.supabase.co/rest/v1/categories?select=*";
const key = "sb_publishable_thM3dKaP_vHxnqWUEuQ1Gw_RNXBZo4D";

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
