"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Clock } from "lucide-react";

interface DashboardData {
  blogPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    isFeatured: number;
    publishDate: string | null;
    createdAt: string;
    category: string | null;
  }>;
  caseStudies: Array<{
    id: string;
    clientName: string | null;
    title: string | null;
    slug: string | null;
    status: string;
    isFeatured: number;
    createdAt: string;
  }>;
  testimonials: Array<{
    id: string;
    author: string;
    company: string | null;
    createdAt: string;
  }>;
  systems: Array<{
    id: string;
    title: string;
    order: number;
    createdAt: string;
  }>;
  socialProof: Array<{
    id: string;
    name: string;
    order: number;
    createdAt: string;
  }>;
  timestamp: string;
  error?: string;
}

const RealtimeDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/data', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#4a3728]" />
            <span className="ml-3 text-lg">Loading database data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#09090b] mb-2">
              Real-Time Database Dashboard
            </h1>
            <p className="text-[#71717a]">
              Live data from your backend database
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-[#71717a]">Auto-refresh (5s)</span>
            </label>
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#4a3728] text-white rounded-lg hover:bg-[#5a4738] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Last Update Time */}
        {lastUpdate && (
          <div className="flex items-center gap-2 text-sm text-[#71717a]">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            {data?.timestamp && (
              <span className="ml-4">
                Server time: {formatDate(data.timestamp)}
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Database Connection Status */}
        {data?.error ? (
          <Card className="border-yellow-500 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-700">
                Database connection issue: {data.error}
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Make sure DATABASE_URL is set in your .env.local file
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-700" />
                <p className="text-green-700 font-semibold">Database Connected</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#09090b]">
                {data?.blogPosts.length || 0}
              </div>
              <p className="text-sm text-[#71717a] mt-1">
                {data?.blogPosts.filter(p => p.status === 'published').length || 0} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#09090b]">
                {data?.caseStudies.length || 0}
              </div>
              <p className="text-sm text-[#71717a] mt-1">
                {data?.caseStudies.filter(c => c.status === 'published').length || 0} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#09090b]">
                {data?.testimonials.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#09090b]">
                {data?.systems.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Proof</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#09090b]">
                {data?.socialProof.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Latest blog posts from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data?.blogPosts.slice(0, 10).map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border border-[#4a3728]/20 rounded-lg hover:bg-[#fdfaf3] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#09090b] truncate">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`${getStatusColor(post.status)} text-white text-xs`}
                          >
                            {post.status}
                          </Badge>
                          {post.isFeatured === 1 && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Featured
                            </Badge>
                          )}
                          {post.category && (
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#71717a] mt-1">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.blogPosts || data.blogPosts.length === 0) && (
                  <p className="text-[#71717a] text-center py-4">No blog posts found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Case Studies */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Case Studies</CardTitle>
              <CardDescription>Latest case studies from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data?.caseStudies.slice(0, 10).map((study) => (
                  <div
                    key={study.id}
                    className="p-3 border border-[#4a3728]/20 rounded-lg hover:bg-[#fdfaf3] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#09090b] truncate">
                          {study.clientName || study.title || 'Untitled'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={`${getStatusColor(study.status)} text-white text-xs`}
                          >
                            {study.status}
                          </Badge>
                          {study.isFeatured === 1 && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#71717a] mt-1">
                          {formatDate(study.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.caseStudies || data.caseStudies.length === 0) && (
                  <p className="text-[#71717a] text-center py-4">No case studies found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Testimonials</CardTitle>
              <CardDescription>Latest testimonials from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data?.testimonials.slice(0, 10).map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-3 border border-[#4a3728]/20 rounded-lg hover:bg-[#fdfaf3] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#09090b]">
                          {testimonial.author}
                        </h4>
                        {testimonial.company && (
                          <p className="text-sm text-[#71717a] mt-1">
                            {testimonial.company}
                          </p>
                        )}
                        <p className="text-xs text-[#71717a] mt-1">
                          {formatDate(testimonial.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.testimonials || data.testimonials.length === 0) && (
                  <p className="text-[#71717a] text-center py-4">No testimonials found</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Systems */}
          <Card>
            <CardHeader>
              <CardTitle>Systems</CardTitle>
              <CardDescription>All systems from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data?.systems.map((system) => (
                  <div
                    key={system.id}
                    className="p-3 border border-[#4a3728]/20 rounded-lg hover:bg-[#fdfaf3] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#09090b]">
                          {system.title}
                        </h4>
                        <p className="text-xs text-[#71717a] mt-1">
                          Order: {system.order} • {formatDate(system.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.systems || data.systems.length === 0) && (
                  <p className="text-[#71717a] text-center py-4">No systems found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
