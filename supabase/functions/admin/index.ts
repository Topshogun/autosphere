import { createClient } from 'npm:@supabase/supabase-js@2';
import { createHash } from 'node:crypto';

interface LoginPayload {
  username: string;
  password: string;
}

interface PageViewPayload {
  article_id: number;
  user_agent?: string;
  ip_address?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const pathname = url.pathname;

    // Admin login
    if (req.method === "POST" && pathname.endsWith('/login')) {
      const loginData: LoginPayload = await req.json();

      if (!loginData.username || !loginData.password) {
        return new Response(
          JSON.stringify({ error: "Username and password are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Simple password check (in production, use proper bcrypt)
      const passwordHash = createHash('sha256').update(loginData.password).digest('hex');
      
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('id, username')
        .eq('username', loginData.username)
        .single();

      if (error || !admin) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // For demo purposes, accept "admin123" as password
      if (loginData.password !== 'admin123') {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          admin: {
            id: admin.id,
            username: admin.username
          },
          token: `admin_${admin.id}_${Date.now()}`
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get dashboard stats
    if (req.method === "GET" && pathname.endsWith('/stats')) {
      // Get subscription stats
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('is_active, created_at');

      const totalSubscribers = subscriptions?.length || 0;
      const activeSubscribers = subscriptions?.filter(s => s.is_active).length || 0;

      // Get today's page views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayViews } = await supabase
        .from('page_views')
        .select('id')
        .gte('viewed_at', today.toISOString());

      const pageViewsToday = todayViews?.length || 0;

      // Get popular articles (most viewed in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: popularArticles } = await supabase
        .from('page_views')
        .select(`
          article_id,
          articles!inner(title, category)
        `)
        .gte('viewed_at', weekAgo.toISOString());

      // Count views per article
      const articleViews = popularArticles?.reduce((acc, view) => {
        const articleId = view.article_id;
        if (!acc[articleId]) {
          acc[articleId] = {
            id: articleId,
            title: view.articles.title,
            category: view.articles.category,
            views: 0
          };
        }
        acc[articleId].views++;
        return acc;
      }, {} as Record<number, any>) || {};

      const topArticles = Object.values(articleViews)
        .sort((a: any, b: any) => b.views - a.views)
        .slice(0, 5);

      return new Response(
        JSON.stringify({
          totalSubscribers,
          activeSubscribers,
          pageViewsToday,
          popularArticles: topArticles
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get recent subscribers
    if (req.method === "GET" && pathname.endsWith('/subscribers')) {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = (page - 1) * limit;

      const { data: subscribers, error } = await supabase
        .from('subscriptions')
        .select('email, created_at, is_active, source')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({ subscribers: subscribers || [] }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Export subscribers to CSV
    if (req.method === "GET" && pathname.endsWith('/export')) {
      const { data: subscribers, error } = await supabase
        .from('subscriptions')
        .select('email, created_at, is_active, source, preferences')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Generate CSV
      const csvHeader = 'Email,Subscribed Date,Status,Source,Preferences\n';
      const csvRows = subscribers?.map(sub => {
        const date = new Date(sub.created_at).toLocaleDateString();
        const status = sub.is_active ? 'Active' : 'Inactive';
        const preferences = JSON.stringify(sub.preferences || {});
        return `"${sub.email}","${date}","${status}","${sub.source}","${preferences}"`;
      }).join('\n') || '';

      const csv = csvHeader + csvRows;

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="autosphere-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
          ...corsHeaders,
        },
      });
    }

    // Track page view
    if (req.method === "POST" && pathname.endsWith('/track-view')) {
      const viewData: PageViewPayload = await req.json();

      if (!viewData.article_id) {
        return new Response(
          JSON.stringify({ error: "Article ID is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const { error } = await supabase
        .from('page_views')
        .insert({
          article_id: viewData.article_id,
          user_agent: viewData.user_agent,
          ip_address: viewData.ip_address
        });

      if (error) {
        console.error('Error tracking page view:', error);
        // Don't throw error for tracking failures
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error processing admin request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});