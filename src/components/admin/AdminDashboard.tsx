import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Download, 
  LogOut, 
  RefreshCw,
  Mail,
  Calendar,
  BarChart3,
  Home
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  pageViewsToday: number;
  popularArticles: Array<{
    id: number;
    title: string;
    category: string;
    views: number;
  }>;
}

interface Subscriber {
  email: string;
  created_at: string;
  is_active: boolean;
  source: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    logout, 
    getDashboardStats, 
    getSubscribers, 
    exportSubscribers, 
    loading, 
    error, 
    adminUser 
  } = useAdmin();

  const loadDashboardData = async () => {
    setRefreshing(true);
    const [statsData, subscribersData] = await Promise.all([
      getDashboardStats(),
      getSubscribers(1, 10)
    ]);
    
    if (statsData) setStats(statsData);
    setSubscribers(subscribersData);
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    // Navigate to admin login page after logout
    navigate('/admin/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      AI: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Design: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Construction: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">AutoSphere Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {adminUser?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoHome}
                className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeSubscribers || 0} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views Today</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pageViewsToday || 0}</div>
              <p className="text-xs text-muted-foreground">
                Unique article views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalSubscribers ? 
                  Math.round((stats.activeSubscribers / stats.totalSubscribers) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Subscriber retention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Articles</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.popularArticles?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Trending this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Subscribers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Subscribers</CardTitle>
                <CardDescription>Latest newsletter signups</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportSubscribers}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{subscriber.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(subscriber.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                          {subscriber.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.source}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {subscribers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No subscribers found
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
              <CardDescription>Most viewed articles this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.popularArticles?.map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {article.title}
                      </h4>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="flex items-center space-x-1 text-sm font-medium">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    No popular articles data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}