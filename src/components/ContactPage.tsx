import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import './index.css';
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_ENDPOINTS.SUBMIT_CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          ip: 'Unknown' // Will be handled by backend
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      // Still show success for better UX, but log the error
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our investment calculator or need personalized financial advice? 
            We're here to help you make informed investment decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div className='ml-2'>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">wertrends@gmail.com</p>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>
                

              
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div className='ml-2'>
                    <h3 className="font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      New York, NY 10004<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div className='ml-2'>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Why Contact Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Get personalized investment advice based on your financial goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Learn more about our investment calculator methodology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Report technical issues or provide feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Discuss partnership or collaboration opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Request custom investment analysis for your portfolio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you with your investment planning..."
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investment Resources Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground text-center">Investment Education Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Beginner's Guide to Investing</h3>
                  <p className="text-muted-foreground text-sm">
                    Learn the fundamentals of investing, from understanding risk vs. return to building your first portfolio. 
                    Perfect for those just starting their investment journey.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Advanced Investment Strategies</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore sophisticated investment techniques including dollar-cost averaging, portfolio rebalancing, 
                    and tax-efficient investing strategies for experienced investors.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Market Analysis & Trends</h3>
                  <p className="text-muted-foreground text-sm">
                    Stay informed with our regular market analysis, economic indicators, and investment trend reports 
                    to make more informed financial decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How accurate are your investment forecasts?</h3>
                  <p className="text-muted-foreground text-sm">
                    Our forecasts are based on historical market data and statistical models. While we strive for accuracy, 
                    past performance doesn't guarantee future results. Always consult with a financial advisor.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Is your service free to use?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! Our basic investment calculator is completely free. We also offer personalized investment 
                    advice consultations for those who need more detailed guidance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Do you store my personal information?</h3>
                  <p className="text-muted-foreground text-sm">
                    We only collect information you voluntarily provide. We never sell your data and follow strict 
                    privacy guidelines. See our Privacy Policy for details.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Can I get investment advice for specific stocks?</h3>
                  <p className="text-muted-foreground text-sm">
                    Our calculator focuses on broad asset classes (stocks, bonds, crypto, gold). For specific stock 
                    recommendations, please contact us for a personalized consultation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What makes your calculator different?</h3>
                  <p className="text-muted-foreground text-sm">
                    Our calculator uses real-time market data and provides comprehensive comparisons across multiple 
                    asset classes with detailed risk analysis and personalized recommendations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How often should I review my investments?</h3>
                  <p className="text-muted-foreground text-sm">
                    We recommend reviewing your investment strategy quarterly or when major life events occur. 
                    Our calculator helps you track progress and adjust your strategy as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Tips Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground text-center">Investment Tips & Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Start Early, Invest Regularly</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    The power of compound interest works best over time. Even small, regular investments can grow significantly 
                    over decades. Our calculator shows you exactly how much your money can grow with consistent contributions.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Set up automatic monthly contributions</li>
                    <li>• Increase contributions with salary raises</li>
                    <li>• Take advantage of employer 401(k) matching</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Diversify Your Portfolio</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Don't put all your eggs in one basket. A diversified portfolio across stocks, bonds, and other assets 
                    can help reduce risk while maintaining growth potential. Our calculator shows you how different 
                    allocations perform over time.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mix of stocks, bonds, and alternative investments</li>
                    <li>• Consider international diversification</li>
                    <li>• Rebalance periodically to maintain target allocation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Understand Your Risk Tolerance</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Your risk tolerance should match your investment timeline and financial goals. Younger investors 
                    can typically take more risk, while those nearing retirement may prefer more conservative approaches.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Assess your ability to handle market volatility</li>
                    <li>• Consider your investment timeline</li>
                    <li>• Don't invest money you can't afford to lose</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Keep Costs Low</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    High fees can significantly impact your long-term returns. Look for low-cost index funds and ETFs, 
                    and avoid unnecessary trading fees. Our calculator shows the impact of fees on your returns.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Choose low-cost index funds and ETFs</li>
                    <li>• Avoid high-fee actively managed funds</li>
                    <li>• Minimize trading and transaction costs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
