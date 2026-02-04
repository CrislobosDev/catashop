const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking 'products' table...");
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Columns found in 'products':", Object.keys(data[0]));
    } else {
        console.log("No products found to infer columns. Attempting insert to test columns...");
        // Try to insert a dummy to see what fails? No, that's risky.
        console.log("Table seems empty or accessible.");
    }
}

checkSchema();
