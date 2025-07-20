import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Zap, 
  Globe, 
  Mail, 
  TrendingUp,
  Brain,
  DollarSign,
  Megaphone,
  User,
  Settings,
  ShoppingCart,
  Handshake
} from 'lucide-react';

interface AboutPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function AboutPage({ darkMode, toggleDarkMode }: AboutPageProps) {

  const categories = [
    {
      name: 'AI',
      icon: Brain,
      description: 'Artificial Intelligence, Machine Learning, and emerging tech innovations',
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Finance & Accounting',
      icon: DollarSign,
      description: 'Financial strategies, accounting innovations, and fintech solutions',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Content Creation & Marketing',
      icon: Megaphone,
      description: 'Content strategies, marketing automation, and creative techniques',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'Personal Branding & Thought Leadership',
      icon: User,
      description: 'Building personal brands and establishing thought leadership',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      name: 'Operations & Productivity',
      icon: Settings,
      description: 'Tools, systems, and methodologies for operational excellence',
      color: 'from-orange-500 to-amber-600'
    },
    {
      name: 'Sales & Customer Relations',
      icon: Handshake,
      description: 'Sales techniques, CRM strategies, and customer relationship management',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'E-commerce & Retail',
      icon: ShoppingCart,
      description: 'Online commerce, retail technology, and digital marketplace strategies',
      color: 'from-red-500 to-pink-600'
    }
  ];

  const stats = [
    { label: 'Daily Readers', value: '12.5K+', icon: Users },
    { label: 'Articles Published', value: '500+', icon: Target },
    { label: 'Categories Covered', value: '7', icon: Globe },
    { label: 'Growth Rate', value: '25%', icon: TrendingUp }
  ];

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-[1200px] mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">AS</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  About <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">The Apex Index</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Your daily source for cutting-edge insights across AI, finance, marketing, branding, operations, sales, and e-commerce. 
                  We curate and rewrite the most important stories shaping tomorrow's business landscape.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-[1200px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    In an era of information overload, we believe in quality over quantity. The Apex Index cuts through 
                    the noise to deliver the signal that truly matters for your business success.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Every day, our team analyzes hundreds of sources to identify the trends, insights, and innovations 
                    that will shape the future of business. We then rewrite these stories with clarity, context, and actionable insights.
                  </p>
                  <Button
                    onClick={() => window.open('mailto:subscribe@theapexindex.com?subject=Newsletter Subscription', '_blank')}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 hover:scale-105 transition-all duration-200"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Join Our Community
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="pt-6">
                        <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-muted/30">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What We Cover</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Seven key areas that drive modern business success, delivered with expert analysis and actionable insights.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The principles that guide everything we do at The Apex Index.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Precision</h3>
                  <p className="text-muted-foreground">
                    We focus on what matters most, filtering out the noise to deliver only the most relevant insights.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Speed</h3>
                  <p className="text-muted-foreground">
                    In fast-moving markets, timing is everything. We deliver insights when they matter most.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community</h3>
                  <p className="text-muted-foreground">
                    We're building a community of forward-thinking professionals who shape the future of business.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-500 to-teal-500">
            <div className="max-w-[1200px] mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Stay Ahead?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust The Apex Index for their daily dose of business intelligence.
              </p>
              <Button
                onClick={() => window.open('mailto:subscribe@theapexindex.com?subject=Newsletter Subscription', '_blank')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-200"
              >
                <Mail className="h-5 w-5 mr-2" />
                Subscribe Now
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>

    </>
  );
}