async function check() {
  const url = "https://udpsykhbbodlczzwvvhe.supabase.co/rest/v1/custom_fixtures?select=*";
  const key = "sb_publishable_xNu-1L_xkRSWxNrP43RFGw_N352xkdt";
  
  const res = await fetch(url, {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`
    }
  });
  const data = await res.json();
  const charlton = data.filter(f => JSON.stringify(f).toLowerCase().includes("charlton"));
  console.log("CHARLTON CUSTOM FIXTURES:", JSON.stringify(charlton, null, 2));
}
check();
