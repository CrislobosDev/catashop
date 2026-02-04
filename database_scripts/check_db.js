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
    console.log("Checking 'orders' table...");
    const { data, error } = await supabase.from('orders').select('*').limit(1);

    if (error) {
        console.error("Error fetching orders:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Columns found in 'orders':", Object.keys(data[0]));
    } else {
        // If table is empty, we can't easily infer columns with simple select *.
        // But usually RLS allows insert if policy is right.
        // Let's try to insert a dummy row that is invalid to see error, or just report empty.
        console.log("No orders found. Columns cannot be inferred from empty select.");
    }
}

checkSchema();
