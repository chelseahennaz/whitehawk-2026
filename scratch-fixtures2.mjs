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
  const carshalton = data.filter(f => JSON.stringify(f).toLowerCase().includes("carshalton"));
  console.log("CARSHALTON CUSTOM FIXTURES:", JSON.stringify(carshalton, null, 2));
}
check();
