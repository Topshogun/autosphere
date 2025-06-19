import { createClient } from 'npm:@supabase/supabase-js@2';

interface SubscriptionPayload {
  email: string;
  source?: string;
  preferences?: Record<string, any>;
}

interface UnsubscribePayload {
  token: string;
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

    if (req.method === "POST" && pathname.endsWith('/subscribe')) {
      // Handle subscription
      const subscriptionData: SubscriptionPayload = await req.json();

      // Validate email
      if (!subscriptionData.email || !isValidEmail(subscriptionData.email)) {
        return new Response(
          JSON.stringify({ 
            error: "Valid email address is required" 
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

      // Check if email already exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('id, is_active')
        .eq('email', subscriptionData.email.toLowerCase())
        .single();

      if (existingSubscription) {
        if (existingSubscription.is_active) {
          return new Response(
            JSON.stringify({ 
              message: "You're already subscribed to our newsletter!",
              alreadySubscribed: true
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        } else {
          // Reactivate subscription
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ 
              is_active: true, 
              subscribed_at: new Date().toISOString(),
              source: subscriptionData.source || 'website'
            })
            .eq('id', existingSubscription.id);

          if (updateError) {
            throw updateError;
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Welcome back! Your subscription has been reactivated.",
              reactivated: true
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
      }

      // Create new subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          email: subscriptionData.email.toLowerCase(),
          source: subscriptionData.source || 'website',
          preferences: subscriptionData.preferences || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('New subscription created:', subscription);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Successfully subscribed! Welcome to AutoSphere.",
          subscription: {
            id: subscription.id,
            email: subscription.email,
            subscribed_at: subscription.subscribed_at
          }
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

    if (req.method === "POST" && pathname.endsWith('/unsubscribe')) {
      // Handle unsubscription
      const unsubscribeData: UnsubscribePayload = await req.json();

      if (!unsubscribeData.token) {
        return new Response(
          JSON.stringify({ 
            error: "Unsubscribe token is required" 
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

      // Find and deactivate subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('unsubscribe_token', unsubscribeData.token)
        .eq('is_active', true)
        .select()
        .single();

      if (error || !subscription) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid or expired unsubscribe token" 
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Successfully unsubscribed. We're sorry to see you go!"
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

    if (req.method === "GET" && pathname.endsWith('/stats')) {
      // Get subscription statistics
      const { data: stats, error } = await supabase
        .from('subscriptions')
        .select('is_active, source, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const totalSubscriptions = stats?.length || 0;
      const activeSubscriptions = stats?.filter(s => s.is_active).length || 0;
      const sourceBreakdown = stats?.reduce((acc, sub) => {
        acc[sub.source] = (acc[sub.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return new Response(
        JSON.stringify({
          total: totalSubscriptions,
          active: activeSubscriptions,
          inactive: totalSubscriptions - activeSubscriptions,
          sources: sourceBreakdown
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

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error processing subscription request:', error);
    
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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}