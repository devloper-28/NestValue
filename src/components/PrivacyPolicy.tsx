import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Welcome to NestValue.us ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website nestvalue.us, 
                including any other media form, media channel, mobile website, or mobile application 
                related or connected thereto (collectively, the "Site").
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this 
                privacy policy, please do not access the site.
              </p>
              <p>
                <strong className="text-foreground">Your Privacy Matters:</strong> At NestValue, we understand that your financial information is sensitive. 
                We are committed to protecting your privacy and ensuring the security of your personal data when using our 
                investment calculator and financial planning tools. This policy outlines our comprehensive approach to data protection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Personal Information</h3>
                <p>
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Use our investment calculator</li>
                  <li>Request personalized investment advice</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our contact form</li>
                </ul>
                <p className="mt-2">
                  This information may include your name, email address, investment preferences, 
                  and any other information you choose to provide.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Usage Data</h3>
                <p>
                  We automatically collect certain information when you visit our Site, including:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website</li>
                  <li>Device information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide and maintain our investment calculator services</li>
                <li>Generate personalized investment forecasts and recommendations</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you newsletters and marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With trusted service providers who assist us in operating our website</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our Site. 
                Cookies are small data files stored on your device that help us:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling 
                cookies may affect the functionality of our Site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the 
                Contact Us section below.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our Site may contain links to third-party websites. We are not responsible for the 
                privacy practices or content of these external sites. We encourage you to review the 
                privacy policies of any third-party sites you visit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of our Site after any modifications constitutes acceptance of the 
                updated Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law. Specifically:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Investment calculator data: Retained for 2 years for service improvement</li>
                <li>Contact form submissions: Retained for 3 years for customer service</li>
                <li>Analytics data: Retained for 26 months for website optimization</li>
                <li>Marketing data: Retained until you opt out or request deletion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure that such transfers comply with applicable data protection laws and implement appropriate 
                safeguards to protect your personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Website:</strong> https://nestvalue.us</p>
                <p><strong>Email:</strong> privacy@nestvalue.us</p>
                <p><strong>Address:</strong> New York, USA</p>
                <p><strong>Response Time:</strong> We typically respond to privacy inquiries within 48 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
