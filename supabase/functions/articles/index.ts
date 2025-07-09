import { createClient } from 'npm:@supabase/supabase-js@2';

interface ArticlePayload {
  title: string;
  content: string;
  author: string;
  category: 'AI' | 'Finance & Accounting' | 'Content Creation & Marketing' | 'Personal Branding & Thought Leadership' | 'Operations & Productivity' | 'Sales & Customer Relations' | 'E-commerce & Retail';
  published_date: string;
  image_url?: string;
  summary?: string;
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

    if (req.method === "GET") {
      // Get articles with pagination
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '9');
      const category = url.searchParams.get('category');
      
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      const validCategories = [
        'AI',
        'Finance & Accounting',
        'Content Creation & Marketing',
        'Personal Branding & Thought Leadership',
        'Operations & Productivity',
        'Sales & Customer Relations',
        'E-commerce & Retail'
      ];
      
      if (category && validCategories.includes(category)) {
        query = query.eq('category', category);
      }
      
      const { data: articles, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      return new Response(
        JSON.stringify({
          articles: articles || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
          }
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    if (req.method === "POST") {
      // Create new article
      const articleData: ArticlePayload = await req.json();

      // Validate required fields
      const requiredFields = ['title', 'content', 'author', 'category', 'published_date'];
      const missingFields = requiredFields.filter(field => !articleData[field]);
      
      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ 
            error: "Missing required fields", 
            missing: missingFields 
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Validate category
      const validCategories = [
        'AI',
        'Finance & Accounting',
        'Content Creation & Marketing',
        'Personal Branding & Thought Leadership',
        'Operations & Productivity',
        'Sales & Customer Relations',
        'E-commerce & Retail'
      ];
      if (!validCategories.includes(articleData.category)) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid category", 
            validCategories 
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Validate image_url if provided
      if (articleData.image_url && !isValidUrl(articleData.image_url)) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid image_url format. Must be a valid URL." 
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Set default image if not provided
      const imageUrl = articleData.image_url || getDefaultImageForCategory(articleData.category);
      
      // Insert article into database
      const { data: article, error } = await supabase
        .from('articles')
        .insert({
          title: articleData.title,
          content: articleData.content,
          summary: articleData.summary, // Will be auto-generated if not provided
          author: articleData.author,
          category: articleData.category,
          image_url: imageUrl,
          published_date: articleData.published_date,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('New article created:', article);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Article published successfully",
          article: {
            id: article.id,
            title: article.title,
            category: article.category,
            slug: article.slug,
            image_url: article.image_url,
            published_date: article.published_date,
            created_at: article.created_at,
          },
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

function getDefaultImageForCategory(category: string): string {
  const imageMap = {
    'AI': 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Finance & Accounting': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Content Creation & Marketing': 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Personal Branding & Thought Leadership': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Operations & Productivity': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'Sales & Customer Relations': 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    'E-commerce & Retail': 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  };
  return imageMap[category] || imageMap['AI'];
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}