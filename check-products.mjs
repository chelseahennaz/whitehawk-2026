import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://udpsykhbbodlczzwvvhe.supabase.co',
  'sb_publishable_xNu-1L_xkRSWxNrP43RFGw_N352xkdt'
);

async function updateDB() {
  const { data, error } = await supabase.from('products').select('id, name, image');
  if (error) {
    console.error(error);
    return;
  }
  
  const timestamp = Date.now();
  for (const product of data) {
    if (product.image && product.image.includes('/assets/shop/')) {
      // Force it to be exactly /assets/shop/ without /src/
      const filename = product.image.split('/').pop().split('?')[0];
      const newImage = `/assets/shop/${filename}?v=${timestamp}`;
      const { error: updateError } = await supabase
        .from('products')
        .update({ image: newImage })
        .eq('id', product.id);
      if (updateError) {
        console.error(`Error updating ${product.id}:`, updateError);
      } else {
        console.log(`Updated ${product.id} -> ${newImage}`);
      }
    }
  }
  console.log("Database update complete.");
}
updateDB();
