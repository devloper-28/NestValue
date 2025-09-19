import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Mail, User, Calendar, DollarSign, Target } from 'lucide-react';

interface EmailData {
  email: string;
  investmentData: {
    totalBalance: string;
    amount: string;
    monthlyContribution: string;
    targetYear: string;
    riskProfile: string;
  };
  timestamp: string;
  id: number;
}

interface ContactData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  ip: string;
}

export function EmailAdmin() {
  const [emails, setEmails] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('emails');

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadEmails();
    } else {
      setLoading(false);
    }
  }, []);

  const loadEmails = async () => {
    try {
      // Always try to fetch from backend first
      const response = await fetch('https://nestvalue.onrender.com/api/emails?password=nestvalue2025');
      if (response.ok) {
        const backendEmails = await response.json();
        setEmails(backendEmails);
        console.log('✅ Loaded emails from backend:', backendEmails.length);
      } else {
        console.error('❌ Backend returned error:', response.status);
        setEmails([]);
      }
    } catch (error) {
      console.error('❌ Error loading emails from backend:', error);
      setEmails([]);
    }
    setLoading(false);
  };

  const loadContacts = async () => {
    try {
      const response = await fetch('https://nestvalue.onrender.com/api/contacts?password=nestvalue2025');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        console.log('✅ Loaded contacts from backend:', data.length);
      } else {
        console.error('❌ Backend returned error:', response.status);
        setContacts([]);
      }
    } catch (error) {
      console.error('❌ Error loading contacts from backend:', error);
      setContacts([]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - you can change this password
    if (password === 'nestvalue2025') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadEmails();
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
    setError('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Amount', 'Target Year', 'Monthly Contribution', 'Risk Profile', 'Timestamp', 'IP Address'],
      ...emails.map(email => [
        email.email,
        email.investmentData.amount,
        email.investmentData.targetYear,
        email.investmentData.monthlyContribution,
        email.investmentData.riskProfile,
        new Date(email.timestamp).toLocaleString(),
        email.ip || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearEmails = () => {
    if (confirm('Are you sure you want to clear all emails? This action cannot be undone.')) {
      localStorage.removeItem('consultationEmails');
      setEmails([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="mt-4 min-h-screen bg-background py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-foreground">
                Admin Login
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Enter password to access consultation emails
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Consultation Email Admin
            </h1>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Logout
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">
            View and manage consultation requests from users
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={clearEmails} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Clear All Emails
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground">{emails.length}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground">
                {emails.length > 0 ? formatCurrency(emails.reduce((sum, email) => sum + (email.investmentData?.amount ? parseFloat(email.investmentData.amount) : 0), 0)) : '$0'}
              </div>
              <div className="text-sm text-muted-foreground">Total Investment Value</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground">
                {emails.length > 0 ? Math.round(emails.reduce((sum, email) => sum + (email.investmentData?.amount ? parseFloat(email.investmentData.amount) : 0), 0) / emails.length) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Average Investment</div>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        {emails.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No consultation requests yet</h3>
              <p className="text-muted-foreground">Emails will appear here when users submit consultation requests.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {emails.map((emailData, index) => {
              // Skip if emailData is invalid
              if (!emailData || !emailData.email) {
                return null;
              }
              
              // Check if this is a contact form submission or consultation email
              const isContactForm = emailData.name && emailData.subject && emailData.message;
              const isConsultationEmail = emailData.investmentData;
              
              return (
              <Card key={emailData.id || index} className="shadow-lg border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      {isContactForm ? 'Contact Form' : 'Consultation'} #{index + 1}
                    </CardTitle>
                    <Badge variant="outline">
                      {new Date(emailData.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        {isContactForm && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">{emailData.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <span className="text-sm font-medium text-foreground">{emailData.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Submitted:</span>
                          <span className="text-sm text-foreground">
                            {new Date(emailData.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Form Details OR Investment Details */}
                    {isContactForm ? (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Message Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Subject:</span>
                            <div className="font-medium">{emailData.subject}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Message:</span>
                            <div className="font-medium mt-1 p-2 bg-muted rounded text-xs">{emailData.message}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Investment Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <div className="font-medium">{emailData.investmentData?.amount ? formatCurrency(parseFloat(emailData.investmentData.amount)) : 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target Year:</span>
                            <div className="font-medium">{emailData.investmentData?.targetYear || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monthly:</span>
                            <div className="font-medium">{emailData.investmentData?.monthlyContribution ? formatCurrency(parseFloat(emailData.investmentData.monthlyContribution)) : 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Risk:</span>
                            <div className="font-medium capitalize">{emailData.investmentData?.riskProfile || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
